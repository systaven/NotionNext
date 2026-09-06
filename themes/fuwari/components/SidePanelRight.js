import { siteConfig } from '@/lib/config'
import CONFIG from '../config'
import AnalyticsCard from './AnalyticsCard'
import Calendar from './Calendar'
import DailyQuote from './DailyQuote'
import MusicPlayer from './MusicPlayer'
import Toc from './Toc'
import { WidgetTitle } from './SidePanel'
import { useGlobal } from '@/lib/global'

/** Mizuki 的桌面右侧顺序：目录、站点统计、一言、日历、音乐。 */
const SidePanelRight = ({ postCount, categoryOptions = [], tagOptions = [], allNavPages, post }) => {
  const { locale } = useGlobal()
  const showToc = siteConfig('FUWARI_ARTICLE_TOC', true, CONFIG) && post?.toc?.length > 1
  return <aside className='fuwari-sidebar fuwari-sidebar-right space-y-4 sticky top-4 self-start'>
    {showToc && <section className='fuwari-card fuwari-widget-card p-4'><WidgetTitle>{locale?.ARTICLE?.TABLE_OF_CONTENT || '目录'}</WidgetTitle><Toc toc={post.toc} /></section>}
    <AnalyticsCard postCount={postCount} categoryOptions={categoryOptions} tagOptions={tagOptions} />
    <DailyQuote />
    <Calendar allNavPages={allNavPages} />
    {siteConfig('MUSIC_PLAYER', true, CONFIG) && <MusicPlayer />}
  </aside>
}

export default SidePanelRight
