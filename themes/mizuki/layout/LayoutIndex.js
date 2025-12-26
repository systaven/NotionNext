
import React from 'react';
import LayoutBase from './LayoutBase';
import BlogPostListScroll from '@/components/BlogPostListScroll';
import Sidebar from '@/themes/mizuki/components/Sidebar'; // Corrected import path
import CONFIG from '../config';

const LayoutIndex = (props) => {
  const { posts } = props;
  const hasSidebar = CONFIG.MIZUKI_SIDEBAR_WIDGETS && CONFIG.MIZUKI_SIDEBAR_WIDGETS.length > 0;

  return (
    <LayoutBase {...props}>
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap -mx-4">
          {/* Main Content */}
          <div className={`w-full ${hasSidebar ? 'lg:w-3/4' : 'lg:w-full'} px-4`}>
            <BlogPostListScroll posts={posts} />
          </div>

          {/* Sidebar */}
          {hasSidebar && (
            <div className="w-full lg:w-1/4 px-4">
              <Sidebar {...props} />
            </div>
          )}
        </div>
      </div>
    </LayoutBase>
  );
};

export default LayoutIndex;
