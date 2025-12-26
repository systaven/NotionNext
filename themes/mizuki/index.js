
import { LayoutIndex } from './layout/LayoutIndex'
import { LayoutPost } from './layout/LayoutPost'
import { LayoutTimeline } from './layout/LayoutTimeline'
import { LayoutSearch } from './layout/LayoutSearch'
import { LayoutCategory } from './layout/LayoutCategory'
import { LayoutTag } from './layout/LayoutTag'

/**
 * Theme Csonfig for Mizuki
 * @type {import('notion-next').ThemeConfig}
 */
const theme = {
  //  layouts
  'layout-index': LayoutIndex,
  'layout-post': LayoutPost,
  'layout-timeline': LayoutTimeline,
  'layout-search': LayoutSearch,
  'layout-category': LayoutCategory,
  'layout-tag': LayoutTag,

  // metadata
  meta: {
    author: 'Your Name',
    title: 'Mizuki',
    description: 'A simple and elegant blog theme.',
    link: 'https://your-domain.com',
    icon: '/favicon.ico',
    avatar: '/avatar.png',
    keywords: ['blog', 'notion', 'nextjs', 'mizuki'],
    ogImage: 'og.png'
  },

  // Theme-specific configurations (if any)
  config: {
    // Add any theme-specific settings here
    // e.g., APPEARANCE: 'auto' // auto, light, dark
  }
}

export default theme
