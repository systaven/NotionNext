/* eslint-disable react/no-unknown-property */
/**
 * 此处样式只对当前主题生效
 * 此处不支持tailwindCSS的 @apply 语法
 * @returns
 */
const Style = () => {
  return (
    <style jsx global>{`
      @font-face {
        font-family: 'AaMaoMaoXueTuanZiKeAiTi';
        src: url('/fonts/AaMaoMaoXueTuanZiKeAiTi-2.woff2') format('truetype');
        font-display: swap;
      }
      body, #theme-heo {
        font-family: 'AaMaoMaoXueTuanZiKeAiTi', sans-serif;
      }
      body {
        background-color: #FFF0F8;
      }

      // 公告栏中的字体固定白色
      #theme-heo #announcement-content .notion {
        color: #df364e;
      }

      ::-webkit-scrollbar-thumb {
        background: rgba(223, 54, 78, 0.4);
        border-radius: 8px;
        cursor: pointer;
      }

      ::-webkit-scrollbar {
        width: 8px;
        height: 8px;
      }

      #more {
        white-space: nowrap;
      }

      .today-card-cover {
        -webkit-mask-image: linear-gradient(to top, transparent 5%, black 70%);
        mask-image: linear-gradient(to top, transparent 5%, black 70%);
      }

      .recent-top-post-group::-webkit-scrollbar {
        display: none;
      }

      .scroll-hidden::-webkit-scrollbar {
        display: none;
      }

      * {
        box-sizing: border-box;
      }

      // 标签滚动动画
      .tags-group-wrapper {
        animation: rowup 60s linear infinite;
      }

      @keyframes rowup {
        0% {
          transform: translateX(0%);
        }
        100% {
          transform: translateX(-50%);
        }
      }

      .cursor-follower {
        position: fixed;
        width: 30px;
        height: 30px;
        border: 2px solid #000;
        border-radius: 50%;
        pointer-events: none;
        transform: translate(-50%, -50%);
        z-index: 9999;
        transition: transform 0.1s ease-out, border-color 0.3s ease;
      }

      html.dark .cursor-follower {
        border-color: #fff;
      }
    `}</style>
  )
}

export { Style }

