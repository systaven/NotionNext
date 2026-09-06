import SmartLink from '@/components/SmartLink'
import LazyImage from '@/components/LazyImage'
import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import { useState } from 'react'
import CONFIG from '../config'
import SocialButton from './SocialButton'
import MusicPlayer from './MusicPlayer'
import DailyQuote from './DailyQuote'
import Calendar from './Calendar'
import Toc from './Toc'
import dynamic from 'next/dynamic'

const NotionPage = dynamic(() => import('@/components/NotionPage'))

const WidgetTitle = ({ children }) => (
  <h3 className='fuwari-widget-title text-sm font-semibold mb-3 tracking-wide text-[var(--fuwari-muted)]'>{children}</h3>
)

const TagCloud = ({ tagOptions, locale }) => {
  if (!siteConfig('FUWARI_WIDGET_TAG_LIST', true, CONFIG) || !tagOptions.length) return null
  return <section className='fuwari-card fuwari-widget-card p-4'><WidgetTitle>{locale?.COMMON?.TAGS || '标签'}</WidgetTitle><div className='flex flex-wrap gap-2'>{tagOptions.slice(0, 28).map(tag => <SmartLink key={tag.name} href={`/tag/${encodeURIComponent(tag.name)}`} className='fuwari-chip'>#{tag.name}</SmartLink>)}</div></section>
}

const CategoryList = ({ categoryOptions, locale }) => {
  if (!siteConfig('FUWARI_WIDGET_CATEGORY_LIST', true, CONFIG) || !categoryOptions.length) return null
  return <section className='fuwari-card fuwari-widget-card p-4'><WidgetTitle>{locale?.COMMON?.CATEGORY || '分类'}</WidgetTitle><div className='space-y-1'>{categoryOptions.slice(0, 12).map(category => <SmartLink key={category.name} href={`/category/${encodeURIComponent(category.name)}`} className='fuwari-category-item flex items-center justify-between gap-3 rounded-xl px-2.5 py-2 text-sm'><span className='truncate'>{category.name}</span><span className='fuwari-category-count'>{category.count || 0}</span></SmartLink>)}</div></section>
}

const Profile = ({ avatar, title, description, greetings, greetingIndex, nextGreeting }) => (
  <section className='fuwari-card fuwari-profile-card p-4'>
    <SmartLink href={siteConfig('FUWARI_PROFILE_PATH', '/about', CONFIG)} className='fuwari-profile-link block mb-3'><div className='fuwari-profile-thumb relative overflow-hidden rounded-2xl'><LazyImage src={avatar} alt={title} className='w-full aspect-square object-cover' /><span className='fuwari-profile-overlay' aria-hidden='true'><i className='far fa-id-card' /></span></div></SmartLink>
    <button type='button' className='fuwari-profile-greeting text-left w-full' onClick={nextGreeting}><h2 className='text-xl font-semibold mb-1'>{greetings.length ? greetings[greetingIndex] : title}</h2><p className='text-sm leading-6 text-[var(--fuwari-muted)]'>{greetings.length ? title : description}</p></button>
    <div className='pt-3 mt-3 border-t border-[var(--fuwari-border)]'><SocialButton /></div>
  </section>
)

const Notice = ({ notice, locale }) => {
  if (!siteConfig('FUWARI_WIDGET_NOTICE', true, CONFIG) || !notice?.blockMap) return null
  return <section className='fuwari-card fuwari-widget-card p-4'><WidgetTitle>{locale?.COMMON?.ANNOUNCEMENT || '公告'}</WidgetTitle><div id='announcement-content' className='text-sm'><NotionPage post={notice} /></div></section>
}

const SidePanel = ({ tagOptions = [], categoryOptions = [], notice, siteInfo, post, allNavPages, mobile = false }) => {
  const { locale } = useGlobal()
  const title = siteConfig('TITLE')
  const description = siteConfig('DESCRIPTION')
  const greetings = siteConfig('FUWARI_PROFILE_GREETINGS', [], CONFIG)
  const [greetingIndex, setGreetingIndex] = useState(0)
  const avatar = siteConfig('FUWARI_AVATAR', '', CONFIG) || siteInfo?.icon
  const showMobileToc = mobile && siteConfig('FUWARI_ARTICLE_TOC', true, CONFIG) && post?.toc?.length > 1
  const nextGreeting = () => setGreetingIndex(index => (index + 1) % greetings.length)
  return <aside className={`fuwari-sidebar space-y-4 ${mobile ? 'fuwari-sidebar-mobile' : ''}`}><Profile avatar={avatar} title={title} description={description} greetings={greetings} greetingIndex={greetingIndex} nextGreeting={nextGreeting} /><Notice notice={notice} locale={locale} />{mobile && <DailyQuote />}{mobile && <MusicPlayer />}{mobile && <Calendar allNavPages={allNavPages} />}<TagCloud tagOptions={tagOptions} locale={locale} /><CategoryList categoryOptions={categoryOptions} locale={locale} />{showMobileToc && <section className='fuwari-card fuwari-widget-card p-4'><WidgetTitle>{locale?.ARTICLE?.TABLE_OF_CONTENT || '目录'}</WidgetTitle><Toc toc={post.toc} /></section>}</aside>
}

export { CategoryList, WidgetTitle }
export default SidePanel
