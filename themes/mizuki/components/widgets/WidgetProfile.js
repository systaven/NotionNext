
import React from 'react';
import Image from 'next/image';
import CONFIG from '../../config';

/**
 * 个人信息卡片小组件
 * @returns {JSX.Element}
 */
const WidgetProfile = () => {
  const { AVATAR, NAME, BIO, LINKS } = CONFIG.MIZUKI_WIDGET_PROFILE;

  return (
    <div className="w-full bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <div className="flex flex-col items-center">
        <Image
          src={AVATAR}
          alt={NAME}
          width={80}
          height={80}
          className="rounded-full"
        />
        <h2 className="text-xl font-bold mt-4 dark:text-white">{NAME}</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 text-center">{BIO}</p>
      </div>
      <div className="flex justify-center space-x-4 mt-6">
        {LINKS.map(link => (
          <a
            key={link.url}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400"
          >
            {/* 在这里，我们可以使用一个图标库，但为了简单起见，我们暂时只显示名称 */}
            {link.name}
          </a>
        ))}
      </div>
    </div>
  );
};

export default WidgetProfile;
