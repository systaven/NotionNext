
import React from 'react';
import Header from '../../../themes/mizuki/components/Header'; // 导入 Header 组件

/**
 * 基础布局组件，为所有页面提供一个统一的内容容器
 * @param {import('notion-next').ThemeProps} props
 * @returns {JSX.Element}
 */
const LayoutBase = (props) => {
  const { children, headerSlot } = props
  return (
    <div className="w-full bg-white dark:bg-black min-h-screen flex flex-col">
      <Header {...props} />
      {headerSlot}
      <main id="main-grid" className="relative z-10 w-full bg-transparent flex-grow pt-16">
        {children}
      </main>
    </div>
  );
};

export default LayoutBase;
