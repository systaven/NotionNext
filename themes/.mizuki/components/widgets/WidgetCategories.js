
import React from 'react';
import Link from 'next/link';

/**
 * 文章分类小组件
 * @param {{ categories: import('notion-next').Category[], currentCategory: string }}
 * @returns {JSX.Element}
 */
const WidgetCategories = ({ categories, currentCategory }) => {
  if (!categories || categories.length === 0) {
    return null;
  }

  return (
    <div className="w-full bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-bold mb-4 dark:text-white">分类</h3>
      <ul className="space-y-2">
        {categories.map(category => {
          const isSelected = category.name === currentCategory;
          return (
            <li key={category.name}>
              <Link
                href={`/category/${encodeURIComponent(category.name)}`}
                className={`flex justify-between items-center py-2 px-3 rounded-lg transition-colors duration-200 ${
                  isSelected
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}>
                <span>{category.name}</span>
                <span className={`text-sm ${isSelected ? 'text-white' : 'text-gray-400 dark:text-gray-500'}`}>{category.count}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default WidgetCategories;
