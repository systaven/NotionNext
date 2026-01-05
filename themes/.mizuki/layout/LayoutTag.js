
import { Container } from '../components/Container'
import { BlogPostList } from '../components/BlogPostList'
import { Sidebar } from '../components/Sidebar'

export const LayoutTag = (props) => {
  const { tag, posts, page, totalPage } = props

  return (
    <Container title={tag}>
      <div className="w-full flex justify-center">
        <div className="w-full flex flex-col-reverse md:flex-row md:justify-between gap-8">
          {/* Main Content */}
          <main className="md:w-2/3 w-full">
            <BlogPostList posts={posts} page={page} totalPage={totalPage} />
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
