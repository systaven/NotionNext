
import { Container } from '@/components/Container'
import BlogPostArchive from '../components/BlogPostArchive'
import { useConfig } from '@/lib/config'

export const LayoutTimeline = ({ posts }) => {
  const BLOG = useConfig()

  // 按年份对文章进行分组
  const postsByYear = {}
  if (posts) {
    for (const post of posts) {
      const year = new Date(post.date.start_date).getFullYear()
      if (!postsByYear[year]) {
        postsByYear[year] = []
      }
      postsByYear[year].push(post)
    }
  }

  // 获取排序后的年份列表（降序）
  const sortedYears = Object.keys(postsByYear).sort((a, b) => b - a)

  return (
    <Container title={BLOG.TITLE} description={BLOG.DESCRIPTION}>
      <div className="w-full max-w-3xl mx-auto">
        {sortedYears.map(year => (
          <div key={year} className="relative mb-12">
            <div id={year} className="absolute -top-20" />
            <h2 className="sticky top-16 z-10 text-2xl md:text-3xl font-bold text-gray-900 dark:text-white py-4 bg-white dark:bg-gray-900 bg-opacity-90 backdrop-blur-md">
              {year}
            </h2>
            <div className="space-y-4 mt-4">
              {postsByYear[year].map(post => (
                <BlogPostArchive key={post.id} post={post} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </Container>
  )
}
