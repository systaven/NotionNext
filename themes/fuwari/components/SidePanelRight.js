import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import SmartLink from '@/components/SmartLink'
import CONFIG from '../config'
import Calendar from './Calendar'
import DailyQuote from './DailyQuote'
import MusicPlayer from './MusicPlayer'

const CategoryList = ({ categoryOptions, locale }) => {
  if (!siteConfig('FUWARI_WIDGET_CATEGORY_LIST', true, CONFIG) || !categoryOptions.length) return null
  return (
    <section className='fuwari-card fuwari-widget-card p-4'>
      <h3 className='fuwari-widget-title text-sm font-semibold mb-3 text-[var(--fuwari-muted)]'>{locale?.COMMON?.CATEGORY || '分类'}</h3>
      <div className='space-y-1'>
        {categoryOptions.slice(0, 12).map(category => (
          <SmartLink key={category.name} href={`/category/${encodeURIComponent(category.name)}`} className='fuwari-category-item flex items-center justify-between gap-3 rounded-xl px-2.5 py-2 text-sm'>
            <span className='truncate'>{category.name}</span>
            <span className='fuwari-category-count'>{category.count || 0}</span>
          </SmartLink>
        ))}
      </div>
    </section>
  )
}

/** 正式 Mizuki 的右栏：普通组件先随页面滚动，分类和音乐作为粘性区域。 */
const SidePanelRight = ({ categoryOptions = [], allNavPages }) => {
  const { locale } = useGlobal()
  return (
    <aside className='fuwari-sidebar fuwari-sidebar-right h-full space-y-4'>
      <div className='fuwari-sidebar-flow space-y-4'>
        <DailyQuote />
        <Calendar allNavPages={allNavPages} />
      </div>
      <div className='fuwari-sidebar-sticky space-y-4'>
        <CategoryList categoryOptions={categoryOptions} locale={locale} />
        {siteConfig('MUSIC_PLAYER', true, CONFIG) && <MusicPlayer />}
      </div>
    </aside>
  )
}

export default SidePanelRight
