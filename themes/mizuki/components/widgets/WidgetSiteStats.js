
import React from 'react';
import { Eye, FileText, Clock } from 'react-feather'; // 使用 react-feather 图标库

/**
 * 网站统计小组件
 * @param {import('notion-next').ThemeProps} props
 * @returns {JSX.Element}
 */
const WidgetSiteStats = (props) => {
  const { postCount, wordCount } = props
  // 假设平均阅读速度为 240 字/分钟
  const estimatedReadingTime = Math.ceil(wordCount / 240);

  return (
    <div className="w-full bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-bold mb-4 dark:text-white">统计</h3>
      <ul className="space-y-4">
        <li className="flex items-center text-sm text-gray-600 dark:text-gray-300">
          <FileText className="w-4 h-4 mr-2" />
          <span>文章总数: <strong>{postCount}</strong></span>
        </li>
        <li className="flex items-center text-sm text-gray-600 dark:text-gray-300">
          <Eye className="w-4 h-4 mr-2" />
          <span>总字数: <strong>{new Intl.NumberFormat().format(wordCount)}</strong></span>
        </li>
        <li className="flex items-center text-sm text-gray-600 dark:text-gray-300">
          <Clock className="w-4 h-4 mr-2" />
          <span>预计阅读: <strong>{estimatedReadingTime} 分钟</strong></span>
        </li>
      </ul>
    </div>
  );
};

export default WidgetSiteStats;
