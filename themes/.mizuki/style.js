import React from 'react';

/**
 * Mizuki主题的全局样式组件
 * 包含了从Astro主题移植过来的所有CSS
 */
const MizukiGlobalStyles = () => {
  return (
    <style jsx global>{`
      /* 从 AStrotheme/mizuki_theme/src/styles/main.css */
      @import "./albums.css"; 
      @import "./anime.css"; 
      @import "./transition.css"; 
      @import "./animation-enhancements.css"; 
      @import "./gradient-buttons.css"; 

      /* 字体导入 */
      @font-face {
        font-family: "ZenMaruGothic-Medium";
        src: url("/assets/font/ZenMaruGothic-Medium.woff2") format("woff2");
        font-weight: 500;
        font-display: swap;
      }
      @font-face {
        font-family: "萝莉体 第二版";
        src: url("/assets/font/萝莉体 第二版.woff2") format("woff2");
        font-style: normal;
        font-weight: 400;
        font-display: swap;
      }

      @tailwind base;
      @tailwind components;
      @tailwind utilities;

      html {
        scroll-behavior: smooth;
      }

      /* Main content padding for fixed navbar */
      #main-grid {
        padding-top: 4.5rem; /* Navbar height */
      }

      .top-gradient-highlight {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        height: 180px;
        background: linear-gradient(to bottom, rgba(255, 255, 255, 0.5) 0%, rgba(255, 255, 255, 0.3) 30%, rgba(255, 255, 255, 0.15) 60%, rgba(255, 255, 255, 0.05) 80%, transparent 100%);
        pointer-events: none;
        z-index: 20;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      }

      :root.dark .top-gradient-highlight {
        background: linear-gradient(to bottom, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0.3) 30%, rgba(0, 0, 0, 0.15) 60%, rgba(0, 0, 0, 0.05) 80%, transparent 100%);
      }

      @layer components {
        ::view-transition-old(root),
        ::view-transition-new(root) {
          animation-duration: 0.5s;
          animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
          mix-blend-mode: normal;
        }

        /* Navbar Styles */
        #navbar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          width: 100%;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        #navbar > div {
            transition: background-color 0.3s cubic-bezier(0.4, 0, 0.2, 1), border-color 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        #navbar.scrolled > div {
            @apply bg-[var(--card-bg-transparent)] backdrop-blur-sm;
            border-bottom: 1px solid var(--line-color);
        }

        .transition,
        [class*="border"],
        [class*="transition"] {
          transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;
          transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
          transition-duration: 0.15s;
        }

        .card-base {
          @apply rounded-[var(--radius-large)] overflow-hidden bg-[var(--card-bg)] transition-colors duration-150;
        }

        .float-panel {
          @apply top-[5.25rem] rounded-[var(--radius-large)] overflow-hidden bg-[var(--float-panel-bg)] transition-colors duration-150 shadow-xl dark:shadow-none;
        }
        .float-panel-closed {
          @apply -translate-y-1 opacity-0 pointer-events-none;
        }
       
        /* ... (rest of the styles) */
      }

      /* ... (rest of the file) */
    `}</style>
  );
};

export default MizukiGlobalStyles;
