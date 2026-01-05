
import React from 'react';
import { useTheme } from './ThemeContext';

/**
 * 浅色/深色模式切换按钮
 */
const LightDarkSwitch = () => {
  const { theme, setTheme } = useTheme();

  // 如果主题状态尚未加载，则不渲染任何内容
  if (theme === undefined) {
    return null;
  }

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const isDarkMode = theme === 'dark';

  return (
    <div className="relative z-50">
      <button
        aria-label="Light/Dark Mode"
        className="relative btn-plain scale-animation rounded-lg h-11 w-11 active:scale-90 theme-switch-btn"
        id="scheme-switch"
        onClick={toggleTheme}
        data-mode={theme}
      >
        {/* 太阳图标 */}
        <div 
          className={`absolute transition-all duration-300 ease-in-out ${!isDarkMode ? 'opacity-100 rotate-0' : 'opacity-0 rotate-180'}`}
        >
           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mx-auto" viewBox="0 0 20 20" fill="currentColor">
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
            </svg>
        </div>
        {/* 月亮图标 */}
        <div 
          className={`absolute transition-all duration-300 ease-in-out ${isDarkMode ? 'opacity-100 rotate-0' : 'opacity-0 -rotate-180'}`}
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mx-auto" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.706-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 16.464A1 1 0 106.465 15.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm-1.414-2.12a1 1 0 011.414 0l.706.707a1 1 0 11-1.414 1.414l-.706-.707a1 1 0 010-1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
            </svg>
        </div>
      </button>

      <style jsx>{`
        /* 确保主题切换按钮的背景色即时更新 */
        .theme-switch-btn::before {
          transition: transform 75ms ease-out, background-color 0ms !important;
        }
      `}</style>
    </div>
  );
};

export default LightDarkSwitch;
