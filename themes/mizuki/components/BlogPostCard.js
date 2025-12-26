
import Link from 'next/link'
import Image from 'next/image'
import { ChevronRight } from 'react-feather'
import { useConfig } from '@/lib/config'
import { useLocale } from '@/lib/lang'
import { formatDate } from '@/lib/utils/formatDate'

/**
 * @param {{ post: import('notion-next').Post }} props
 */
const BlogPostCard = ({ post }) => {
  const BLOG = useConfig()
  const locale = useLocale()
  const postLink = `${BLOG.PATH}/${post.slug}`

  return (
    <div className="w-full bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transform hover:-translate-y-1 transition-transform duration-300">
      <Link href={postLink} passHref legacyBehavior>
        <a className="flex flex-col md:flex-row">
          {/* Cover Image */}
          {post.page_cover && (
            <div className="md:w-1/3 w-full h-56 md:h-auto relative">
              <Image
                src={post.page_cover}
                alt={post.title}
                layout="fill"
                objectFit="cover"
                className="transform hover:scale-105 transition-transform duration-500"
              />
            </div>
          )}

          {/* Post Info */}
          <div className={`p-6 flex flex-col justify-between ${post.page_cover ? 'md:w-2/3' : 'w-full'}`}>
            <div>
              {/* Category */}
              {post.category && (
                <div className="mb-2 text-sm font-medium text-blue-500 dark:text-blue-400">
                  {post.category}
                </div>
              )}

              {/* Title */}
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                {post.title}
              </h2>

              {/* Summary */}
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 leading-relaxed">
                {post.summary}
              </p>
            </div>

            <div>
              {/* Tags */}
              {post.tags && (
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  {post.tags.map(tag => (
                    <span key={tag} className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 rounded-full px-2 py-1">
                      #{tag}
                    </span>
                  ))
                  }
                </div>
              )}

              {/* Date and Read More */}
              <div className="flex justify-between items-center">
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {formatDate(post?.date?.start_date || post.createdTime, BLOG.LANG)}
                </div>
                <div className="flex items-center text-sm text-blue-500 dark:text-blue-400 font-semibold">
                  {locale.START_READING}
                  <ChevronRight className="w-4 h-4 ml-1" />
                </div>
              </div>
            </div>
          </div>
        </a>
      </Link>
    </div>
  )
}

export default BlogPostCard
