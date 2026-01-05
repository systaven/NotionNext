
import React from 'react';
import LayoutBase from './LayoutBase';
import BlogPostArchive from '../components/BlogPostArchive';
import Sidebar from '../components/Sidebar';
import { useConfig } from '../../../lib/config';

/**
 * 归档页布局
 * @param {import('notion-next').ThemeProps} props
 * @returns {JSX.Element}
 */
const LayoutArchive = (props) => {
  const { posts, archiveTitle } = props;
  const CONFIG = useConfig();
  const hasSidebar = CONFIG.MIZUKI_SIDEBAR_WIDGETS && CONFIG.MIZUKI_SIDEBAR_WIDGETS.length > 0;

  return (
    <LayoutBase {...props}>
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap -mx-4">
          {/* Main Content */}
          <div className={`w-full ${hasSidebar ? 'lg:w-3/4' : 'lg:w-full'} px-4 py-8`}>
            <div className="mb-8 text-center">
              <h2 className="text-2xl font-bold dark:text-white">{archiveTitle}</h2>
            </div>
            <BlogPostArchive posts={posts} />
          </div>

          {/* Sidebar */}
          {hasSidebar && (
            <div className="w-full lg:w-1/4 px-4 py-8">
              <Sidebar {...props} />
            </div>
          )}
        </div>
      </div>
    </LayoutBase>
  );
};

export default LayoutArchive;
