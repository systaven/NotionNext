
import React from 'react';
import Link from 'next/link';

/**
 * 标签云小组件
 * @param {{ tags: import('notion-next').Tag[], currentTag: string }} props
 * @returns {JSX.Element}
 */
const WidgetTags = ({ tags, currentTag }) => {
  if (!tags || tags.length === 0) {
    return null;
  }

  // 为标签预设一个颜色列表，使其更加生动
  const tagColors = [
    'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300',
    'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300',
    'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
    'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
  ];

  return (
    <div className="w-full bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-bold mb-4 dark:text-white">标签</h3>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag, index) => {
          const isSelected = tag.name === currentTag;
          const colorClass = isSelected
            ? 'bg-blue-500 text-white'
            : `${tagColors[index % tagColors.length]} hover:bg-blue-500 hover:text-white dark:hover:bg-blue-500`;

          return (
            <Link
              key={tag.name}
              href={`/tag/${encodeURIComponent(tag.name)}`}
              className={`inline-block px-3 py-1 text-sm font-medium rounded-full transition-colors duration-200 ${colorClass}`}>
              {tag.name} ({tag.count})
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default WidgetTags;
