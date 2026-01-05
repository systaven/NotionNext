
import Link from 'next/link'
import { useConfig } from '../../../lib/config'
import { PostNav } from './PostNav'

export const PostFooter = ({ post, prev, next }) => {
  return (
    <footer className="mt-8">
      {/* Tags */}
      {post.tags && (
        <div className="flex flex-wrap gap-2 mb-8">
          {post.tags.map(tag => (
            <Link href={`/tag/${encodeURIComponent(tag)}`} key={tag} passHref legacyBehavior>
              <a className="text-sm text-blue-500 dark:text-blue-400 bg-blue-100 dark:bg-blue-900 rounded-full px-3 py-1 hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors duration-200">
                #{tag}
              </a>
            </Link>
          ))}
        </div>
      )}
      {/* Copyright */}
      <div className="text-sm text-gray-500 dark:text-gray-400 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
        © {new Date().getFullYear()} {useConfig().AUTHOR}. All Rights Reserved.
      </div>
      {/* Nav */}
      <PostNav prev={prev} next={next} />
    </footer>
  )
}
