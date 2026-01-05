import React, { useEffect } from 'react';
import { useConfig } from '../../../lib/config';

const Pio = () => {
  const CONFIG = useConfig();
  useEffect(() => {
    // Live2D 看板娘的初始化逻辑将在这里实现
    // 需要加载 pio.js 脚本并进行配置
    if (CONFIG.MIZUKI_PIO_WIDGET) {
      // 动态加载脚本的示例
      const script = document.createElement('script');
      script.src = '/pio/static/l2d.js';
      script.async = true;
      document.body.appendChild(script);
      
      // Pio 的初始化也可能需要一个额外的脚本
      const pioScript = document.createElement('script');
      pioScript.src = '/pio/static/pio.js';
      pioScript.async = true;
      document.body.appendChild(pioScript);

      return () => {
        // 组件卸载时清理脚本
        document.body.removeChild(script);
        document.body.removeChild(pioScript);
      };
    }
  }, []);

  if (!CONFIG.MIZUKI_PIO_WIDGET) {
    return null;
  }

  return (
    <div className="pio-container">
      {/* Live2D 看板娘的 canvas 将会渲染在这里 */}
    </div>
  );
};

export default Pio;
