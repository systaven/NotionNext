
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useTheme } from './ThemeContext';
import LightDarkSwitch from './LightDarkSwitch';
import WallpaperSwitch from './WallpaperSwitch';
import CONFIG from '../config';

const Navbar = () => {
  const { toggleDisplaySettings } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      setIsScrolled(scrollTop > 50);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // 初始化状态
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div id="navbar" className={`z-50 onload-animation ${isScrolled ? 'scrolled' : ''}`}>
      <div className="!overflow-visible max-w-[var(--page-width)] h-[4.5rem] mx-auto flex items-center justify-between px-4">
        <Link href="/" passHref>
          <a className="btn-plain scale-animation rounded-lg h-[3.25rem] px-5 font-bold active:scale-95">
            <div className="flex flex-row items-center text-md">
              <img src={CONFIG.MIZUKI_NAV_ICON || "/assets/home/home.png"} alt={CONFIG.MIZUKI_NAV_TITLE} className="h-[1.75rem] w-[1.75rem] mb-1 mr-2 object-contain" loading="lazy" />
              <span className="dark:text-white text-black">{CONFIG.MIZUKI_NAV_TITLE}</span>
            </div>
          </a>
        </Link>
        
        <div className="flex items-center space-x-1">
           {/* Display Settings Button */}
           <button aria-label="Display Settings" className="btn-plain scale-animation rounded-lg h-11 w-11 active:scale-90" onClick={toggleDisplaySettings}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mx-auto" viewBox="0 0 20 20" fill="currentColor"><path d="M17.216 10c0-3.9-3.1-7-7-7s-7 3.1-7 7c0 3.9 3.1 7 7 7s7-3.1 7-7zm-2 0c0 2.8-2.2 5-5 5s-5-2.2-5-5 2.2-5 5-5 5 2.2 5 5z" /><path d="M10.015 10c.005 0 .01 0 .015 0h.015c.005 0 .01 0 .015 0V4.03a.75.75 0 00-1.5 0V10zM10 10a.75.75 0 00.75.75h5.97a.75.75 0 000-1.5H10A.75.75 0 0010 10z" /></svg>
            </button>
          
          {/* Wallpaper Switch */}
          <WallpaperSwitch />

          {/* Light/Dark Mode Switch */}
          <LightDarkSwitch />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
