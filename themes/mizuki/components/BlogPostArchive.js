
import Link from 'next/link'
import { useConfig } from '@/lib/config'
import { formatDate } from '@/lib/utils/formatDate'

const BlogPostArchive = ({ post }) => {
  const BLOG = useConfig()
  const postLink = `${BLOG.PATH}/${post.slug}`

  return (
    <Link href={postLink} passHref legacyBehavior>
      <a className="w-full flex items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300">
        <div className="flex-shrink-0 text-gray-500 dark:text-gray-400 font-light text-sm">
          {formatDate(post?.date?.start_date || post.createdTime, 'yyyy-MM-dd')}
        </div>
        <div className="ml-4 flex-grow">
          <h2 className="font-semibold text-gray-900 dark:text-white">{post.title}</h2>
        </div>
      </a>
    </Link>
  )
}

export default BlogPostArchive
