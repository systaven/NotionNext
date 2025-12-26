
import { LAYOUT_MAPPING } from './layout';
import MizukiLayout from './components/Layout';

/**
 * 主题的入口文件
 * @param {*} props
 * @returns
 */
const Index = (props) => {
  const { layout } = props;

  // 根据 layout 名称从 LAYOUT_MAPPING 中获取对应的布局组件
  const LayoutComponent = LAYOUT_MAPPING[layout] || MizukiLayout; // 默认为 MizukiLayout

  return <LayoutComponent {...props} />;
};

export default Index;
