
import React from 'react';
import CONFIG from '../config';
import WidgetProfile from './widgets/WidgetProfile';
import WidgetAnnouncement from './widgets/WidgetAnnouncement';
import WidgetCategories from './widgets/WidgetCategories';
// import WidgetTags from './widgets/WidgetTags';
// import WidgetSiteStats from './widgets/WidgetSiteStats';
// import WidgetCalendar from './widgets/WidgetCalendar';

/**
 * 侧边栏组件，根据配置动态渲染小组件
 * @param {{ ...props }} props
 * @returns {JSX.Element}
 */
const Sidebar = (props) => {
  // 定义所有可用的小组件及其对应的组件
  const WIDGETS = {
    profile: WidgetProfile,
    announcement: WidgetAnnouncement,
    categories: WidgetCategories,
    // tags: WidgetTags,
    // 'site-stats': WidgetSiteStats,
    // calendar: WidgetCalendar,
  };

  // 从配置中获取已启用的小组件
  const activeWidgets = CONFIG.MIZUKI_SIDEBAR_WIDGETS.filter(w => w.enable);

  return (
    <div className="w-full space-y-4">
      {activeWidgets.map((widget) => {
        const WidgetComponent = WIDGETS[widget.type];
        return WidgetComponent ? <WidgetComponent key={widget.type} {...props} /> : null;
      })}
    </div>
  );
};

export default Sidebar;
