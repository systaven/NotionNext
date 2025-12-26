
import React from 'react';
import CONFIG from '../../config';

/**
 * 网站公告小组件
 * @param {import('notion-next').ThemeProps} props
 * @returns {JSX.Element}
 */
const WidgetAnnouncement = (props) => {
  const { title, content } = CONFIG.MIZUKI_WIDGET_ANNOUNCEMENT || {};

  // 如果没有内容，则不渲染组件
  if (!content) {
    return null;
  }

  return (
    <div className="w-full bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <div className="flex flex-col">
        {title && <h3 className="text-lg font-bold mb-4 dark:text-white">{title}</h3>}
        {/* 使用 whitespace-pre-line 来保留内容中的换行 */}
        <p className="text-sm text-gray-600 dark:text-gray-300 whitespace-pre-line">{content}</p>
      </div>
    </div>
  );
};

export default WidgetAnnouncement;
