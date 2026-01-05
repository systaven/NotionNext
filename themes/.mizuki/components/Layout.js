
import React from 'react';
import { ThemeProvider } from './ThemeContext';
import MizukiGlobalStyles from '../style';
import Navbar from './Navbar';
import DisplaySettings from './DisplaySettings';
import CONFIG from '../config';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';

/**
 * 基础布局
 * @param {object} props
 * @returns {JSX.Element}
 */
const MizukiLayout = (props) => {
  const { children, post } = props;

  // 根据 post 对象是否存在来决定是否在 body 上添加 'post-page' 类
  const bodyClassName = post ? 'post-page' : 'not-post-page';

  return (
    <ThemeProvider>
      <MizukiGlobalStyles />
      <div id='Mizuki-wrapper' className={`${CONFIG.MIZUKI_LANG} font-sans`}>
        <Navbar {...props} />

        <div id='page-wrapper' className={`m-auto max-w-[var(--page-width)] min-h-screen ${bodyClassName}`}>
          <div className='w-full h-full min-h-screen flex flex-col items-center gap-8 justify-between onload-animation-2'>
            <span className='text-center font-bold text-4xl mt-32 dark:text-white'>
              {CONFIG.MIZUKI_NAV_TITLE}
            </span>
            <span className='text-center text-md dark:text-white/75'>
              {CONFIG.MIZUKI_SUBTITLE} 
            </span>
          </div>

          <main id="main-grid" className="relative z-10 w-full bg-transparent min-h-screen">
            {children}
          </main>
        </div>

        <DisplaySettings />
      </div>
      {CONFIG.ANALYTICS_VERCEL && <Analytics />}
      {CONFIG.ANALYTICS_SPEED_INSIGHTS && <SpeedInsights />}
    </ThemeProvider>
  );
};

export default MizukiLayout;
