
import BlogPostCard from './BlogPostCard'
import { Pagination } from './Pagination'

export const BlogPostList = ({ posts = [], page, totalPage }) => {
  return (
    <div>
      <div className="space-y-8">
        {posts.map(post => (
          <BlogPostCard key={post.id} post={post} />
        ))}
      </div>
      {totalPage > 1 && <div className="mt-8"><Pagination page={page} totalPage={totalPage} /></div>}
    </div>
  )
}
