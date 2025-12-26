
import Link from 'next/link'
import Image from 'next/image'
import { useConfig } from '@/lib/config'
import { formatDate } from '@/lib/formatDate'

export const PostHeader = ({ post }) => {
  const BLOG = useConfig()

  return (
    <header className="mb-8 text-center">
      {/* Title */}
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">{post.title}</h1>
      <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
        {/* Category */}
        {post.category && (
          <>
            <Link href={`/category/${post.category}`} passHref legacyBehavior>
              <a className="hover:text-blue-500 transition-colors duration-200">{post.category}</a>
            </Link>
            <span className="mx-2">|</span>
          </>
        )}
        {/* Date */}
        <span>{formatDate(post?.date?.start_date || post.createdTime, BLOG.LANG)}</span>
        {/* Word Count & Reading Time */}
        {post.word_count && (
          <>
            <span className="mx-2">|</span>
            <span>{post.word_count} words</span>
            <span className="mx-2">|</span>
            <span>{Math.ceil(post.word_count / 240)} min read</span>
          </>
        )}
      </div>
      {/* Cover Image */}
      {post.page_cover && (
        <div className="mt-6 w-full h-64 md:h-96 relative">
          <Image
            src={post.page_cover}
            alt={post.title}
            layout="fill"
            objectFit="cover"
            className="rounded-lg"
          />
        </div>
      )}
    </header>
  )
}
