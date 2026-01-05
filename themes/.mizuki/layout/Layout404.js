
import React from 'react';
import Link from 'next/link';
import LayoutBase from './LayoutBase';

/**
 * 404 页面布局
 * @param {import('notion-next').ThemeProps} props
 * @returns {JSX.Element}
 */
const Layout404 = (props) => {
  return (
    <LayoutBase {...props}>
      <div className="text-center py-20">
        <h1 className="text-5xl font-bold dark:text-white">404</h1>
        <p className="text-xl mt-4 mb-8 dark:text-gray-300">页面未找到</p>
        <Link href="/" passHref>
          <a className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
            返回首页
          </a>
        </Link>
      </div>
    </LayoutBase>
  );
};

export default Layout404;
