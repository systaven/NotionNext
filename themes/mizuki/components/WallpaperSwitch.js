
import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from './ThemeContext';

/**
 * 壁纸模式切换组件
 * 提供 Banner, Fullscreen, 和 None 三种模式的切换
 */
const WallpaperSwitch = () => {
  const { wallpaperMode, setWallpaperMode } = useTheme();
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const panelRef = useRef(null);

  // 定义壁纸模式常量
  const WALLPAPER_BANNER = 'banner';
  const WALLPAPER_FULLSCREEN = 'fullscreen';
  const WALLPAPER_NONE = 'none';

  // 处理外部点击，关闭面板
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        setIsPanelOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // 如果状态未加载，则不渲染
  if (wallpaperMode === undefined) {
    return null;
  }

  const togglePanel = () => {
    setIsPanelOpen(!isPanelOpen);
  };

  const switchMode = (mode) => {
    setWallpaperMode(mode);
    setIsPanelOpen(false); // 切换后关闭面板
  };

  // 根据当前模式决定主按钮显示哪个图标
  const mainIcon = () => {
    switch (wallpaperMode) {
      case WALLPAPER_FULLSCREEN:
        return <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M2 3a1 1 0 011-1h2.155a1 1 0 01.985.658l1.7 4.25a1 1 0 01-.22 1.03l-1.36 1.36a1 1 0 000 1.414l1.36 1.36a1 1 0 01.22 1.03l-1.7 4.25a1 1 0 01-.985.658H3a1 1 0 01-1-1V3zm16 0a1 1 0 011 1v12a1 1 0 01-1 1h-2.155a1 1 0 01-.985-.658l-1.7-4.25a1 1 0 01.22-1.03l1.36-1.36a1 1 0 000-1.414l-1.36-1.36a1 1 0 01-.22-1.03l1.7-4.25a1 1 0 01.985-.658H17z" /></svg>;
      case WALLPAPER_NONE:
        return <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" /></svg>;
      case WALLPAPER_BANNER:
      default:
        return <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M1 1h18v2H1V1zm0 16h18v2H1v-2zM5 4a1 1 0 011-1h8a1 1 0 011 1v10a1 1 0 01-1 1H6a1 1 0 01-1-1V4z" /></svg>;
    }
  };
  
  return (
    <div className="relative z-40" ref={panelRef}>
      <button 
        aria-label="Wallpaper Mode" 
        className="relative btn-plain scale-animation rounded-lg h-11 w-11 active:scale-90 theme-switch-btn" 
        onClick={togglePanel}
      >
        {mainIcon()}
      </button>

      {isPanelOpen && (
        <div id="wallpaper-mode-panel" className="absolute transition top-11 -right-2 pt-5">
          <div className="card-base float-panel p-2">
            {/* Banner Mode Button */}
            <button 
              className={`flex transition whitespace-nowrap items-center !justify-start w-full btn-plain scale-animation rounded-lg h-9 px-3 font-medium active:scale-95 mb-0.5 ${wallpaperMode === WALLPAPER_BANNER ? 'current-theme-btn' : ''}`}
              onClick={() => switchMode(WALLPAPER_BANNER)}
            >
               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor"><path d="M1 1h18v2H1V1zm0 16h18v2H1v-2zM5 4a1 1 0 011-1h8a1 1 0 011 1v10a1 1 0 01-1 1H6a1 1 0 01-1-1V4z" /></svg>
              Banner
            </button>
            {/* Fullscreen Mode Button */}
            <button 
              className={`flex transition whitespace-nowrap items-center !justify-start w-full btn-plain scale-animation rounded-lg h-9 px-3 font-medium active:scale-95 mb-0.5 ${wallpaperMode === WALLPAPER_FULLSCREEN ? 'current-theme-btn' : ''}`}
              onClick={() => switchMode(WALLPAPER_FULLSCREEN)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor"><path d="M2 3a1 1 0 011-1h2.155a1 1 0 01.985.658l1.7 4.25a1 1 0 01-.22 1.03l-1.36 1.36a1 1 0 000 1.414l1.36 1.36a1 1 0 01.22 1.03l-1.7 4.25a1 1 0 01-.985.658H3a1 1 0 01-1-1V3zm16 0a1 1 0 011 1v12a1 1 0 01-1 1h-2.155a1 1 0 01-.985-.658l-1.7-4.25a1 1 0 01.22-1.03l1.36-1.36a1 1 0 000-1.414l-1.36-1.36a1 1 0 01-.22-1.03l1.7-4.25a1 1 0 01.985-.658H17z" /></svg>
              Fullscreen
            </button>
            {/* None Mode Button */}
            <button 
              className={`flex transition whitespace-nowrap items-center !justify-start w-full btn-plain scale-animation rounded-lg h-9 px-3 font-medium active:scale-95 ${wallpaperMode === WALLPAPER_NONE ? 'current-theme-btn' : ''}`}
              onClick={() => switchMode(WALLPAPER_NONE)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" /></svg>
              None
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        .current-theme-btn {
            background-color: var(--primary);
            color: white;
        }
      `}</style>
    </div>
  );
};

export default WallpaperSwitch;

