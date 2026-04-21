import { SignInButton } from '@clerk/nextjs'
import { useGlobal } from '@/lib/global'

/**
 * Clerk 登录锁组件
 */
const ClerkLock = () => {
  const { locale } = useGlobal()

  return (
    <div className="w-full max-w-2xl mx-auto py-12 px-4">
      <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-2xl bg-gray-50 dark:bg-gray-900 transition-all">
        <div className="text-5xl mb-6">🔐</div>
        <h2 className="text-2xl font-bold mb-2 text-gray-800 dark:text-gray-100">
          {locale.COMMON.ARTICLE_LOCK_BY_LOGIN || '登录后继续阅读'}
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8 text-center max-w-sm">
          {locale.COMMON.ARTICLE_LOCK_BY_LOGIN_TIPS || '这篇文章仅限登录用户访问，请登录或注册以解锁精彩内容。'}
        </p>
        
        <SignInButton mode="modal">
          <button className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full font-medium transition-all transform hover:scale-105 active:scale-95 shadow-lg shadow-blue-500/30">
            <span>✨</span>
            <span>{locale.COMMON.SIGN_IN || '立即登录 / 注册'}</span>
          </button>
        </SignInButton>
        
        <div className="mt-6 text-xs text-gray-400 dark:text-gray-500">
           NotionNext Security Protection
        </div>
      </div>
    </div>
  )
}

export default ClerkLock
