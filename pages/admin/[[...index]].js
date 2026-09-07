import dynamic from 'next/dynamic'
import { SignedIn, SignedOut } from '@clerk/nextjs'

const AdminApp = dynamic(() => import('@/components/admin/AdminApp'), {
  ssr: false,
  loading: () => (
    <main style={{ minHeight: '100vh', display: 'grid', placeItems: 'center' }}>
      正在载入管理后台…
    </main>
  )
})
const AdminSignedOut = dynamic(
  () =>
    import('@/components/admin/AdminApp').then(module => module.AdminSignedOut),
  { ssr: false }
)

export default function AdminPage() {
  if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY)
    return <main style={{ padding: 40 }}>管理后台需要先配置 Clerk。</main>
  return (
    <>
      <SignedIn>
        <AdminApp />
      </SignedIn>
      <SignedOut>
        <AdminSignedOut />
      </SignedOut>
    </>
  )
}

AdminPage.isStandalonePage = true
