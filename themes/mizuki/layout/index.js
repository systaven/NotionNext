
import LayoutPost from './LayoutPost';
import LayoutIndex from './LayoutIndex';
import LayoutSearch from './LayoutSearch';
import LayoutArchive from './LayoutArchive';
import LayoutTag from './LayoutTag';
import LayoutCategory from './LayoutCategory';
import Layout404 from './Layout404'; // 导入404页布局
import MizukiLayout from '../components/Layout'; // 默认布局

/**
 * 布局映射
 * 将 layout 字符串映射到具体的布局组件
 */
export const LAYOUT_MAPPING = {
  post: LayoutPost,
  index: LayoutIndex,
  search: LayoutSearch,
  archive: LayoutArchive,
  tag: LayoutTag,
  category: LayoutCategory,
  404: Layout404, // 添加404页布局映射
};

/**
 * 根据布局名称获取对应的组件
 * 如果找不到，则返回默认的 MizukiLayout
 * @param {string} layout - 布局名称
 * @returns {React.ComponentType}
 */
const getLayout = (layout) => {
  return LAYOUT_MAPPING[layout] || MizukiLayout;
};

export default getLayout;
