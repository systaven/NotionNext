
import React from 'react';
import Header from '@/themes/mizuki/components/Header'; // 导入 Header 组件

/**
 * 基础布局组件，为所有页面提供一个统一的内容容器
 * @param {{ meta: object, children: React.ReactNode, ...props }} props
 * @returns {JSX.Element}
 */
const LayoutBase = ({ meta, children, ...props }) => {
  return (
    <div className="w-full bg-white dark:bg-black min-h-screen flex flex-col">
      <Header {...props} />
      <main id="main-grid" className="relative z-10 w-full bg-transparent flex-grow pt-16">
        {children}
      </main>
    </div>
  );
};

export default LayoutBase;
