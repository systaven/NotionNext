import {
  Admin,
  BooleanField,
  BooleanInput,
  Create,
  Datagrid,
  Edit,
  EditButton,
  List,
  Layout,
  Menu,
  DashboardMenuItem,
  MenuItemLink,
  Resource,
  SimpleForm,
  TextField,
  TextInput,
  useGetIdentity,
  useGetList,
  usePermissions
} from 'react-admin'
import { SignInButton, UserProfile } from '@clerk/nextjs'
import { useMemo } from 'react'

const api = async (url, options = {}) => {
  const response = await fetch(url, {
    credentials: 'same-origin',
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options
  })
  const body = await response.json().catch(() => ({}))
  if (!response.ok) {
    const error = new Error(body.error || 'Request failed')
    error.status = response.status
    throw error
  }
  return body
}

const dataProvider = {
  getList: async (resource, params) => {
    const query = new URLSearchParams()
    if (resource === 'users') {
      query.set('limit', params.pagination?.perPage || 25)
      query.set(
        'offset',
        ((params.pagination?.page || 1) - 1) *
          (params.pagination?.perPage || 25)
      )
    }
    const search = query.toString()
    const body = await api(
      `/api/admin/${resource}${search ? `?${search}` : ''}`
    )
    return { data: body.data, total: body.total }
  },
  getOne: async (resource, params) => {
    const body = await api(`/api/admin/${resource}/${params.id}`)
    return { data: body.data }
  },
  create: async (resource, params) => {
    const body = await api(`/api/admin/${resource}`, {
      method: 'POST',
      body: JSON.stringify(params.data)
    })
    return { data: body.data }
  },
  update: async (resource, params) => {
    const body = await api(`/api/admin/${resource}/${params.id}`, {
      method: 'PUT',
      body: JSON.stringify(params.data)
    })
    return { data: body.data }
  },
  delete: async (resource, params) => {
    const body = await api(`/api/admin/${resource}/${params.id}`, {
      method: 'DELETE'
    })
    return { data: body.data }
  }
}

const authProvider = {
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  checkError: error =>
    error.status === 401 ? Promise.reject() : Promise.resolve(),
  checkAuth: async () => {
    await api('/api/admin/session')
  },
  getIdentity: async () => api('/api/admin/session'),
  getPermissions: async () => (await api('/api/admin/session')).role
}

const AnnouncementList = () => (
  <List sort={{ field: '$createdAt', order: 'DESC' }} perPage={25}>
    <Datagrid bulkActionButtons={false} rowClick='edit'>
      <TextField source='title' label='标题' />
      <TextField source='content' label='内容' />
      <BooleanField source='published' label='发布中' />
      <TextField source='$createdAt' label='创建时间' />
      <EditButton />
    </Datagrid>
  </List>
)

const AnnouncementForm = () => (
  <SimpleForm>
    <TextInput source='title' label='标题' fullWidth required />
    <TextInput source='content' label='内容' multiline minRows={6} fullWidth />
    <BooleanInput source='published' label='立即发布' defaultValue />
  </SimpleForm>
)

const AnnouncementCreate = () => (
  <Create>
    <AnnouncementForm />
  </Create>
)
const AnnouncementEdit = () => (
  <Edit>
    <AnnouncementForm />
  </Edit>
)

const UserList = () => (
  <List perPage={25} sort={{ field: 'createdAt', order: 'DESC' }}>
    <Datagrid bulkActionButtons={false} rowClick='edit'>
      <TextField source='name' label='用户' />
      <TextField source='email' label='邮箱' />
      <TextField source='role' label='权限' />
      <TextField source='createdAt' label='注册时间' />
      <EditButton />
    </Datagrid>
  </List>
)

const UserEdit = () => (
  <Edit mutationMode='pessimistic'>
    <SimpleForm>
      <TextInput source='name' label='用户' disabled fullWidth />
      <TextInput source='email' label='邮箱' disabled fullWidth />
      <TextInput
        source='role'
        label='权限（admin 或 user）'
        required
        fullWidth
      />
    </SimpleForm>
  </Edit>
)

const Dashboard = () => {
  const { identity } = useGetIdentity()
  const { total: announcementCount } = useGetList('announcements', {
    pagination: { page: 1, perPage: 1 },
    sort: { field: '$createdAt', order: 'DESC' },
    filter: {}
  })
  const { total: userCount } = useGetList(
    'users',
    {
      pagination: { page: 1, perPage: 1 },
      sort: { field: 'createdAt', order: 'DESC' },
      filter: {}
    },
    { enabled: identity?.role === 'admin' }
  )
  const isAdmin = identity?.role === 'admin'
  return (
    <section style={{ padding: '12px 4px' }}>
      <h1 style={{ marginTop: 0 }}>你好，{identity?.fullName || '用户'}</h1>
      <p>这里是独立于博客与 Notion 内容的站点管理区。</p>
      <div
        style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginTop: 28 }}
      >
        <article
          style={{
            minWidth: 200,
            padding: 20,
            borderRadius: 12,
            background: '#eef4ff'
          }}
        >
          <strong>你的身份</strong>
          <p style={{ fontSize: 24, marginBottom: 0 }}>
            {isAdmin ? '管理员' : '普通用户'}
          </p>
        </article>
        <article
          style={{
            minWidth: 200,
            padding: 20,
            borderRadius: 12,
            background: '#f2f8f3'
          }}
        >
          <strong>公告</strong>
          <p style={{ fontSize: 24, marginBottom: 0 }}>
            {announcementCount || 0} 条
          </p>
        </article>
        {isAdmin && (
          <article
            style={{
              minWidth: 200,
              padding: 20,
              borderRadius: 12,
              background: '#fff7e8'
            }}
          >
            <strong>已注册用户</strong>
            <p style={{ fontSize: 24, marginBottom: 0 }}>{userCount || 0} 位</p>
          </article>
        )}
      </div>
      {isAdmin ? (
        <p style={{ marginTop: 28 }}>
          可从左侧管理公告和用户权限。统计会先使用这些真实业务数据，暂不额外追踪访客，避免无意义的数据写入。
        </p>
      ) : (
        <p style={{ marginTop: 28 }}>
          管理员发布的公告会显示在这里；你也可以通过 Clerk
          管理自己的账号与安全设置。
        </p>
      )}
      <div style={{ marginTop: 36 }}>
        <Account />
      </div>
    </section>
  )
}

const Account = () => (
  <div style={{ paddingTop: 12 }}>
    <UserProfile routing='hash' />
  </div>
)

const AdminMenu = () => {
  const { permissions } = usePermissions()
  const isAdmin = permissions === 'admin'
  return (
    <Menu>
      <DashboardMenuItem />
      {isAdmin && <MenuItemLink to='/announcements' primaryText='公告管理' />}
      {isAdmin && <MenuItemLink to='/users' primaryText='用户管理' />}
      <MenuItemLink to='/' primaryText='账号与安全' />
    </Menu>
  )
}

const AdminLayout = props => <Layout {...props} menu={AdminMenu} />

const AdminShell = () => {
  const theme = useMemo(
    () => ({
      palette: {
        primary: { main: '#2563eb' },
        secondary: { main: '#0f766e' },
        background: { default: '#f7f8fc' }
      },
      shape: { borderRadius: 10 }
    }),
    []
  )
  return (
    <Admin
      basename='/admin'
      title='站点管理'
      dataProvider={dataProvider}
      authProvider={authProvider}
      dashboard={Dashboard}
      layout={AdminLayout}
      theme={theme}
      requireAuth
    >
      <Resource
        name='announcements'
        options={{ label: '公告管理' }}
        list={AnnouncementList}
        create={AnnouncementCreate}
        edit={AnnouncementEdit}
      />
      <Resource
        name='users'
        options={{ label: '用户管理' }}
        list={UserList}
        edit={UserEdit}
      />
    </Admin>
  )
}

export default function AdminApp() {
  return <AdminShell />
}

export function AdminSignedOut() {
  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        background: '#f7f8fc',
        padding: 24
      }}
    >
      <section
        style={{
          width: '100%',
          maxWidth: 440,
          borderRadius: 16,
          background: '#fff',
          padding: 36,
          boxShadow: '0 16px 45px rgba(15,23,42,.12)'
        }}
      >
        <p style={{ color: '#2563eb', fontWeight: 700 }}>站点管理</p>
        <h1>请先登录</h1>
        <p>登录后可查看公告、账户信息及相应权限的管理功能。</p>
        <SignInButton mode='modal'>
          <button
            type='button'
            style={{
              marginTop: 18,
              border: 0,
              borderRadius: 8,
              padding: '10px 18px',
              background: '#2563eb',
              color: '#fff',
              cursor: 'pointer'
            }}
          >
            使用 Clerk 登录
          </button>
        </SignInButton>
      </section>
    </main>
  )
}
