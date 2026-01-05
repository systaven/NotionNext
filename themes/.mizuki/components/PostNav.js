
import Link from 'next/link'
import { useConfig } from '../../../lib/config'

export const PostNav = ({ prev, next }) => {
  const BLOG = useConfig()
  if (!prev && !next) return null
  return (
    <div className="flex justify-between mt-8">
      {prev ? (
        <Link href={`${BLOG.PATH}/${prev.slug}`} passHref legacyBehavior>
          <a className="w-1/2 p-4 text-left text-gray-800 dark:text-gray-200 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
            <div className="text-xs text-gray-500">Previous Post</div>
            <div className="font-bold">{prev.title}</div>
          </a>
        </Link>
      ) : <div className="w-1/2"></div>}
      {next ? (
        <Link href={`${BLOG.PATH}/${next.slug}`} passHref legacyBehavior>
          <a className="w-1/2 p-4 text-right text-gray-800 dark:text-gray-200 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 ml-4">
            <div className="text-xs text-gray-500">Next Post</div>
            <div className="font-bold">{next.title}</div>
          </a>
        </Link>
      ) : <div className="w-1/2"></div>}
    </div>
  )
}
