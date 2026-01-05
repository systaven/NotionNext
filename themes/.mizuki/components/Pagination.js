
import Link from 'next/link';
import { useConfig } from '../../../lib/config';

/**
 * 分页组件
 * @param {{ page: number, totalPage: number }} props
 * @returns {JSX.Element}
 */
export const Pagination = ({ page, totalPage }) => {
  const BLOG = useConfig();
  const pagePrefix = BLOG.PATH;

  const pages = Array.from({ length: totalPage }, (_, i) => i + 1);

  return (
    <div className="flex justify-center items-center my-8">
      {page > 1 && (
        <Link href={`${pagePrefix}${page === 2 ? '' : `/page/${page - 1}`}`}>
          <a className="px-4 py-2 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-lg shadow-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            &laquo;
          </a>
        </Link>
      )}
      <div className="mx-4">
        {page} / {totalPage}
      </div>
      {page < totalPage && (
        <Link href={`${pagePrefix}/page/${page + 1}`}>
          <a className="px-4 py-2 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-lg shadow-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            &raquo;
          </a>
        </Link>
      )}
    </div>
  );
};
