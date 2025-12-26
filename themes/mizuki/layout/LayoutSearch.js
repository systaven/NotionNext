
import { Container } from '@/components/Container'
import { BlogPostList } from '../components/BlogPostList'
import { Sidebar } from '../components/Sidebar'
import { useLocale } from '@/lib/locale'

export const LayoutSearch = (props) => {
  const { posts, keyword } = props
  const locale = useLocale()

  const getTitle = () => {
    if (keyword) return `${keyword} | ${locale.NAV.SEARCH}`
    return locale.NAV.SEARCH
  }

  return (
    <Container title={getTitle()}>
      <div className="w-full flex justify-center">
        <div className="w-full flex flex-col-reverse md:flex-row md:justify-between gap-8">
          {/* Main Content */}
          <main className="md:w-2/3 w-full">
            {/* No search results hint */}
            {posts && posts.length === 0 && (
              <div className="text-center py-12 text-gray-500 dark:text-gray-300">
                {locale.COMMON.NO_RESULTS}
              </div>
            )}
            <BlogPostList posts={posts} />
          </main>

          {/* Sidebar */}
          <aside className="md:w-1/3 w-full">
            <Sidebar {...props} />
          </aside>
        </div>
      </div>
    </Container>
  )
}
