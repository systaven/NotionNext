// 注意：这只是一个初步的移植版本，我们将在后续步骤中根据需要进行调整。
const CONFIG = {
  // ----------------------------------------------------
  // 基础信息
  // ----------------------------------------------------

  MIZUKI_LANG: 'zh-CN', // 语言, 例如 'en', 'zh-CN', 'ja'
  MIZUKI_THEME_COLOR_HUE: 230, // 主题色调 (0-360)

  // ----------------------------------------------------
  // 页面与布局
  // ----------------------------------------------------

  MIZUKI_POST_LIST_LAYOUT: 'list', // 'list' 或 'grid'
  MIZUKI_POST_LIST_LAYOUT_ALLOW_SWITCH: true, // 允许用户切换布局
  MIZUKI_WALLPAPER_MODE: 'banner', // 'banner', 'fullscreen', 或 'none'

  // 特色页面开关
  MIZUKI_FEATURE_PAGES: {
    ANIME: true,
    DIARY: true,
    FRIENDS: true,
    PROJECTS: true,
    SKILLS: true,
    TIMELINE: true,
    ALBUMS: true,
    DEVICES: true
  },

  // ----------------------------------------------------
  // 顶部导航栏
  // ----------------------------------------------------

  MIZUKI_NAV_TITLE: 'MizukiUI',
  MIZUKI_NAV_TITLE_ICON: '/assets/home/home.png',

  MIZUKI_MENU_LINKS: [
    // 预设链接，之后我们会用 React 组件来实现
    // LinkPreset.Home,
    // LinkPreset.Archive,
    {
      name: 'Links',
      url: '/links/',
      icon: 'material-symbols:link',
      children: [
        { name: 'GitHub', url: 'https://github.com/matsuzaka-yuki/Mizuki', external: true, icon: 'fa6-brands:github' },
        { name: 'Bilibili', url: 'https://space.bilibili.com/701864046', external: true, icon: 'fa6-brands:bilibili' }
      ]
    }
    // ... 其他菜单项
  ],

  // ----------------------------------------------------
  // 侧边栏小组件 (核心)
  // ----------------------------------------------------

  MIZUKI_SIDEBAR_POSITION: 'both', // 'unilateral' 或 'both'
  MIZUKI_SIDEBAR_WIDGETS: [
    { type: 'profile', enable: true, order: 1, position: 'top', sidebar: 'left' },
    { type: 'announcement', enable: true, order: 2, position: 'top', sidebar: 'left' },
    { type: 'categories', enable: true, order: 3, position: 'sticky', sidebar: 'left' },
    { type: 'tags', enable: true, order: 5, position: 'top', sidebar: 'left' },
    { type: 'site-stats', enable: true, order: 5, position: 'top', sidebar: 'right' },
    { type: 'calendar', enable: true, order: 6, position: 'top', sidebar: 'right' }
    // 我们将在这里动态渲染小组件
  ],

  // ----------------------------------------------------
  // 小组件具体配置
  // ----------------------------------------------------

  // 个人信息卡片
  MIZUKI_WIDGET_PROFILE: {
    AVATAR: '/assets/images/avatar.webp',
    NAME: 'Matsuzaka Yuki',
    BIO: 'The world is big, you have to go and see',
    LINKS: [
      { name: 'Bilibli', icon: 'fa6-brands:bilibili', url: 'https://space.bilibili.com/701864046' },
      { name: 'GitHub', icon: 'fa6-brands:github', url: 'https://github.com/matsuzaka-yuki' }
    ]
  },

  // 公告
  MIZUKI_WIDGET_ANNOUNCEMENT: {
    TITLE: 'Announcement',
    CONTENT: 'Welcome to my blog! This is a sample announcement.',
    LINK_TEXT: 'Learn More',
    LINK_URL: '/about/'
  },

  // 音乐播放器
  MIZUKI_WIDGET_MUSIC: {
    ENABLE: true,
    MODE: 'meting', // 'local' or 'meting'
    ID: '14164869977',
    SERVER: 'netease',
    TYPE: 'playlist'
  },

  // ----------------------------------------------------
  // 特殊效果
  // ----------------------------------------------------

  // 樱花特效
  MIZUKI_SAKURA_EFFECT: false,

  // 看板娘
  MIZUKI_PIO_WIDGET: true,

};

export default CONFIG;
