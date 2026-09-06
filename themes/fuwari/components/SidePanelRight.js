import { siteConfig } from '@/lib/config'
import CONFIG from '../config'
import AnalyticsCard from './AnalyticsCard'
import Calendar from './Calendar'
import MusicPlayer from './MusicPlayer'
import { CategoryList } from './SidePanel'

/** Mizuki 的桌面右侧顺序：站点统计、日历、分类、音乐。 */
const SidePanelRight = ({ postCount, categoryOptions = [], tagOptions = [], allNavPages }) => (
  <aside className='fuwari-sidebar fuwari-sidebar-right space-y-4 sticky top-4 self-start'>
    <AnalyticsCard postCount={postCount} categoryOptions={categoryOptions} tagOptions={tagOptions} />
    <Calendar allNavPages={allNavPages} />
    <CategoryList categoryOptions={categoryOptions} />
    {siteConfig('MUSIC_PLAYER', true, CONFIG) && <MusicPlayer />}
  </aside>
)

export default SidePanelRight
