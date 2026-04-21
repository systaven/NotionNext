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
  const { post: originalPost } = props
  const router = useRouter()
  const { locale, isSignedIn } = useGlobal()
  const { showNotification, Notification } = useNotification()

  // 1. 同步计算文章内容和锁定状态 (为了不污染 originalPost，我们在这里生成一个新的 post 对象)
  const { post, isLocked, lockType } = useMemo(() => {
    if (!originalPost) return { post: null, isLocked: false, lockType: null }
    
    // 浅拷贝原始对象，防止污染
    const post = { ...originalPost }
    const blockMap = post.blockMap?.block
    if (!blockMap) return { post, isLocked: false, lockType: null }

    // 找到根 Page Block
    const pageBlockId = blockMap[post.id] ? post.id : Object.keys(blockMap).find(
      key => blockMap[key]?.value?.type === 'page'
    )
    const pageBlock = blockMap[pageBlockId]
    const allBlockIds = pageBlock?.value?.content || []

    // 扫描正文暗码
    let splitIndex = -1
    let contentLockType = null
    for (let i = 0; i < allBlockIds.length; i++) {
      const b = blockMap[allBlockIds[i]]
      const title = b?.value?.properties?.title
      const text = title ? JSON.stringify(title) : ''
      if (text.includes('==LOCK==') || text.includes('==锁==')) {
        splitIndex = i
        contentLockType = 'password'
        break
      }
      if (text.includes('==SIGNIN==') || text.includes('==登录==')) {
        splitIndex = i
        contentLockType = 'signin'
        break
      }
    }

    // 综合判断是否锁定
    const hasDbPassword = post.password && post.password !== ''
    const dbLockType = post.lock_by_login ? 'signin' : (hasDbPassword ? 'password' : null)
    
    // 最终锁类型优先级：DB设置 > 正文暗码
    const finalLockType = dbLockType || contentLockType
    
    let isLocked = false
    if (finalLockType === 'signin') {
      isLocked = !isSignedIn
    } else if (finalLockType === 'password') {
      // 这里的逻辑依然受外部控制，但我们默认假设需要锁
      isLocked = true 
    }

    // 处理内容截断
    if (isLocked) {
      if (splitIndex !== -1) {
        // 部分锁定：克隆 pageBlock 及其 content 以免污染
        post.blockMap = { ...post.blockMap, block: { ...blockMap, [pageBlockId]: { ...pageBlock, value: { ...pageBlock.value, content: allBlockIds.slice(0, splitIndex) } } } }
        post.isPartialLock = true
        post.lockType = finalLockType
      } else if (hasDbPassword || post.lock_by_login || splitIndex === -1) {
        // 全量锁定：清空内容
        post.blockMap = { ...post.blockMap, block: { ...blockMap, [pageBlockId]: { ...pageBlock, value: { ...pageBlock.value, content: [] } } } }
        post.isPartialLock = false
      }
    }

    return { post, isLocked, lockType: finalLockType }
  }, [originalPost, isSignedIn])

  // 2. 状态管理：只处理密码锁的 state
  const [passwordUnlocked, setPasswordUnlocked] = useState(false)
  
  // 最终的锁状态：如果是密码锁，还需要判断是否已输入密码
  const finalLock = useMemo(() => {
    if (!isLocked) return false
    if (lockType === 'password') return !passwordUnlocked
    return true
  }, [isLocked, lockType, passwordUnlocked])

  /**
   * 验证文章密码
   * @param {*} passInput
   */
  const validPassword = passInput => {
    if (!post) return false
    const encrypt = md5(post?.slug + passInput)
    if (passInput && encrypt === originalPost?.password) {
      setPasswordUnlocked(true)
      localStorage.setItem('password_' + router.asPath, passInput)
      showNotification(locale.COMMON.ARTICLE_UNLOCK_TIPS)
      return true
    }
    return false
  }

  // 自动尝试本地保存的密码
  useEffect(() => {
    const passInputs = getPasswordQuery(router.asPath)
    if (passInputs.length > 0) {
      for (const passInput of passInputs) {
        if (validPassword(passInput)) break
      }
    }
  }, [originalPost])

  // 生成目录（如果是锁定的，目录也会被 useMemo 里的 content 截断自动处理）
  useEffect(() => {
    if (post && !finalLock) {
      post.toc = getPageTableOfContents(post, post.blockMap)
    }
  }, [post, finalLock])

  const theme = siteConfig('THEME', BLOG.THEME, props.NOTION_CONFIG)
  return (
    <>
      {/* 文章布局 */}
      <DynamicLayout theme={theme} layoutName='LayoutSlug' {...finalProps} />
      {/* 解锁密码提示框 */}
      {originalPost?.password && originalPost?.password !== '' && !finalLock && <Notification />}
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
