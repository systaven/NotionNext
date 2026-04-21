import BLOG from '@/blog.config'
import useNotification from '@/components/Notification'
import OpenWrite from '@/components/OpenWrite'
import { siteConfig } from '@/lib/config'
import { fetchGlobalAllData, resolvePostProps } from '@/lib/db/SiteDataApi'
import { useGlobal } from '@/lib/global'
import { getPageTableOfContents } from '@/lib/db/notion/getPageTableOfContents'
import { getPasswordQuery } from '@/lib/utils/password'
import { checkSlugHasNoSlash } from '@/lib/utils/post'
import { DynamicLayout } from '@/themes/theme'
import md5 from 'js-md5'
import { useRouter } from 'next/router'
import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'
import { isExport } from '@/lib/utils/buildMode'
import { getPriorityPages, prefetchAllBlockMaps } from '@/lib/build/prefetch'

/**
 * 根据notion的slug访问页面
 * 只解析一级目录例如 /about
 * @param {*} props
 * @returns
 */
const Slug = props => {
  const { post } = props
  const router = useRouter()
  const { locale, isSignedIn } = useGlobal()

  // 文章锁🔐
  const [lock, setLock] = useState(
    (post?.password && post?.password !== '') ||
    (post?.lock_by_login && !isSignedIn)
  )
  const { showNotification, Notification } = useNotification()

  /**
   * 验证文章密码
   * @param {*} passInput
   */
  const validPassword = passInput => {
    if (!post) {
      return false
    }
    const encrypt = md5(post?.slug + passInput)
    if (passInput && encrypt === post?.password) {
      setLock(false)
      // 输入密码存入localStorage，下次自动提交
      localStorage.setItem('password_' + router.asPath, passInput)
      showNotification(locale.COMMON.ARTICLE_UNLOCK_TIPS) // 设置解锁成功提示显示
      return true
    }
    return false
  }

  // 文章加载
  useEffect(() => {
    // 文章加密
    if (post?.password && post?.password !== '') {
      setLock(true)
    } else if (post?.lock_by_login && !isSignedIn) {
      setLock(true)
    } else {
      setLock(false)
    }

    // 读取上次记录 自动提交密码
    const passInputs = getPasswordQuery(router.asPath)
    if (passInputs.length > 0) {
      for (const passInput of passInputs) {
        if (validPassword(passInput)) {
          break // 密码验证成功，停止尝试
        }
      }
    }
  }, [post, isSignedIn])

  // 文章加载逻辑：处理部分内容锁定
  useEffect(() => {
    const blockMap = post?.blockMap?.block
    if (!blockMap) return

    // 1. 找到根 Page Block (其 parent_id 是 post.id)
    const pageBlockId = Object.keys(blockMap).find(
      key => blockMap[key]?.value?.type === 'page' && blockMap[key]?.value?.parent_id === post.id
    ) || post.id
    
    const pageBlock = blockMap[pageBlockId]
    if (!pageBlock?.value?.content) return

    // 2. 获取有序的子 Block ID 列表
    const allBlockIds = pageBlock.value.content

    // 3. 扫描暗码
    let splitIndex = -1
    let lockType = null // 'password' | 'signin'

    for (let i = 0; i < allBlockIds.length; i++) {
      const b = blockMap[allBlockIds[i]]
      // 提取文字内容
      const title = b?.value?.properties?.title
      const text = title ? JSON.stringify(title) : ''
      
      if (text.includes('==LOCK==') || text.includes('==锁==')) {
        splitIndex = i
        lockType = 'password'
        break
      }
      if (text.includes('==SIGNIN==') || text.includes('==登录==')) {
        splitIndex = i
        lockType = 'signin'
        break
      }
    }

    // 4. 判断是否需要锁定
    const hasDbPassword = post?.password && post?.password !== ''
    const isLoginOnly = post?.lock_by_login || lockType === 'signin'
    const isPasswordOnly = hasDbPassword || lockType === 'password'

    let isLocked = false
    if (isLoginOnly && !isSignedIn) {
      isLocked = true
    } else if (isPasswordOnly) {
      isLocked = lock // 沿用父级密码锁状态
    }

    // 5. 执行物理截断
    if (isLocked && splitIndex !== -1) {
      // 截断 Page Block 的 content 数组，这是决定渲染顺序的关键
      const keepIds = allBlockIds.slice(0, splitIndex)
      const dropIds = allBlockIds.slice(splitIndex)
      
      pageBlock.value.content = keepIds
      
      // 物理删除 blockMap 中的数据
      dropIds.forEach(id => {
        delete blockMap[id]
      })

      post.content = keepIds
      post.isPartialLock = true
      post.lockType = lockType
      setLock(true)
    } else if (isLocked && splitIndex === -1) {
      // 全量锁定
      post.content = []
      setLock(true)
    } else {
      // 解锁状态
      post.content = allBlockIds
      post.isPartialLock = false
      if (!hasDbPassword && !post?.lock_by_login) {
        setLock(false)
      }
    }

    // 生成目录
    post.toc = getPageTableOfContents(post, post.blockMap)
  }, [post, lock, isSignedIn])

  props = { ...props, lock, validPassword }
  const theme = siteConfig('THEME', BLOG.THEME, props.NOTION_CONFIG)
  return (
    <>
      {/* 文章布局 */}
      <DynamicLayout theme={theme} layoutName='LayoutSlug' {...props} />
      {/* 解锁密码提示框 */}
      {post?.password && post?.password !== '' && !lock && <Notification />}
      {/* 导流工具 */}
      <OpenWrite />
    </>
  )
}

Slug.propTypes = {
  post: PropTypes.shape({
    id: PropTypes.string,
    slug: PropTypes.string,
    password: PropTypes.string,
    content: PropTypes.array,
    toc: PropTypes.array,
    blockMap: PropTypes.shape({
      block: PropTypes.object
    })
  }),
  NOTION_CONFIG: PropTypes.object
}

export async function getStaticPaths() {
  const from = 'slug-paths'
  const { allPages } = await fetchGlobalAllData({ from })

  // Export 模式：全量预生成
  if (isExport()) {
    await prefetchAllBlockMaps(allPages)
    return {
      paths: allPages
        ?.filter(row => checkSlugHasNoSlash(row))
        .map(row => ({ params: { prefix: row.slug } })),
      fallback: false
    }
  }

  // ISR 模式：预生成最新10篇，其余按需渲染
  const tops = getPriorityPages(allPages)
  await prefetchAllBlockMaps(tops)

  return {
    paths: tops
      .filter(row => checkSlugHasNoSlash(row))
      .map(row => ({ params: { prefix: row.slug } })),
    fallback: 'blocking'
  }
}

export async function getStaticProps({ params: { prefix }, locale }) {
  const props = await resolvePostProps({
    prefix,
    locale,
  })

  return {
    props,
    revalidate: isExport()
      ? undefined
      : siteConfig(
        'NEXT_REVALIDATE_SECOND',
        BLOG.NEXT_REVALIDATE_SECOND,
        props.NOTION_CONFIG
      ),
    notFound: !props.post
  }
}

export default Slug
