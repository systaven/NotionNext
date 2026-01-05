
import React, { createContext, useState, useEffect, useContext } from 'react';
import CONFIG from '../config';

// 定义常量
const THEME_KEY = 'theme';
const HUE_KEY = 'hue';
const WALLPAPER_KEY = 'wallpaperMode';

// 创建上下文
const ThemeContext = createContext();

/**
 * 主题提供者组件，负责管理和应用主题相关设置
 */
export const ThemeProvider = ({ children }) => {
  // 状态管理
  const [theme, setThemeState] = useState(undefined);
  const [hue, setHueState] = useState(undefined);
  const [wallpaperMode, setWallpaperModeState] = useState(undefined);
  const [isDisplaySettingsOpen, setIsDisplaySettingsOpen] = useState(false); // 新增状态

  // --- 初始化阶段 ---
  useEffect(() => {
    const initialTheme = localStorage.getItem(THEME_KEY) || CONFIG.MIZUKI_THEME_DEFAULT;
    const initialHue = localStorage.getItem(HUE_KEY) || CONFIG.MIZUKI_HUE_DEFAULT;
    const initialWallpaperMode = localStorage.getItem(WALLPAPER_KEY) || CONFIG.MIZUKI_WALLPAPER_DEFAULT;

    setThemeState(initialTheme);
    setHueState(Number(initialHue));
    setWallpaperModeState(initialWallpaperMode);
  }, []);

  // --- 副作用处理 ---

  // 当 theme 状态改变时，更新 document
  useEffect(() => {
    if (theme === undefined) return;
    const applyThemeChange = () => {
      document.documentElement.classList.toggle('dark', theme === 'dark');
      document.documentElement.setAttribute('data-theme', theme === 'dark' ? 'github-dark' : 'github-light');
    };

    if (document.startViewTransition) {
        document.startViewTransition(applyThemeChange);
    } else {
        applyThemeChange();
    }
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  // 当 hue 状态改变时，更新 document
  useEffect(() => {
    if (hue === undefined) return;
    document.documentElement.style.setProperty('--hue', hue);
    localStorage.setItem(HUE_KEY, hue);
  }, [hue]);

  // 当 wallpaperMode 状态改变时，更新 document
  useEffect(() => {
    if (wallpaperMode === undefined) return;
    // 这里可以添加更新壁纸相关的类名或逻辑
    localStorage.setItem(WALLPAPER_KEY, wallpaperMode);
  }, [wallpaperMode]);

  // --- 公开的接口 ---
  const setTheme = (newTheme) => setThemeState(newTheme);
  const setHue = (newHue) => setHueState(newHue);
  const setWallpaperMode = (newMode) => setWallpaperModeState(newMode);
  const resetHue = () => setHueState(Number(CONFIG.MIZUKI_HUE_DEFAULT));
  const toggleDisplaySettings = () => setIsDisplaySettingsOpen(prev => !prev); // 新增函数

  // 传递给消费者的值
  const value = {
    theme,
    hue,
    wallpaperMode,
    isDisplaySettingsOpen, // 导出新状态
    setTheme,
    setHue,
    setWallpaperMode,
    resetHue,
    toggleDisplaySettings, // 导出新函数
    defaultHue: Number(CONFIG.MIZUKI_HUE_DEFAULT)
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

/**
 * 自定义 Hook，用于在组件中方便地使用主题上下文
 */
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
