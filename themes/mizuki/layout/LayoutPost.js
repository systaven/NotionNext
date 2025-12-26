
import React from 'react';
import LayoutBase from './LayoutBase';
import Comment from '@/components/Comment';
import Sidebar from '@/themes/mizuki/components/Sidebar';
import CONFIG from '../config';

/**
 * 文章页布局
 * @param {{ frontMatter: object, children: React.ReactNode, ...props }} props
 * @returns {JSX.Element}
 */
const LayoutPost = (props) => {
  const { frontMatter, children } = props;
  const hasSidebar = CONFIG.MIZUKI_SIDEBAR_WIDGETS && CONFIG.MIZUKI_SIDEBAR_WIDGETS.length > 0;

  return (
    <LayoutBase {...props}>
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap -mx-4">
          {/* Main Content */}
          <div className={`w-full ${hasSidebar ? 'lg:w-3/4' : 'lg:w-full'} px-4 py-8`}>
            <article className="prose dark:prose-dark">
              {children}
            </article>
            
            <div className="mt-12">
              <Comment frontMatter={frontMatter} />
            </div>
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

export default LayoutPost;
