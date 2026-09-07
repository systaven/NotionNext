/* eslint-disable @next/next/no-img-element */

import { siteConfig } from '@/lib/config'
import { decodeExternalUrl, isExternalHttpLink } from '@/lib/utils/externalLink'
import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

const PREVIEW_WIDTH = 320
const PREVIEW_OFFSET = 14
const PREVIEW_HOVER_DELAY_MS = 320
const FILE_LIKE_URL_PATTERN =
  /\.(pdf|zip|rar|7z|docx?|xlsx?|pptx?|txt|mp3|mp4|mov|avi|apk|dmg|exe)(?:[?#]|$)/i
const previewCache = new Map()

const getPreviewPosition = rect => {
  const left = Math.min(
    Math.max(12, rect.left),
    Math.max(12, window.innerWidth - PREVIEW_WIDTH - 12)
  )
  const showAbove = rect.top > 276
  return {
    left,
    top: showAbove
      ? rect.top - PREVIEW_OFFSET
      : Math.min(window.innerHeight - 12, rect.bottom + PREVIEW_OFFSET),
    transform: showAbove ? 'translateY(-100%)' : 'none'
  }
}

const getActualUrl = link => {
  const storedUrl = link.dataset.linkPreviewUrl
  if (storedUrl) return storedUrl

  const href = link.getAttribute('href') || ''
  const shortLink = href.match(/^\/r\/([^?#/]+)/)
  return shortLink ? decodeExternalUrl(shortLink[1]) || href : href
}

const fetchPreview = async url => {
  const response = await fetch(
    `https://api.linkmetadata.com/v1/metadata?url=${encodeURIComponent(url)}`
  )
  if (!response.ok) throw new Error('link metadata request failed')

  const metadata = await response.json()
  return {
    title: metadata.title || null,
    description: metadata.description || null,
    image: metadata.image?.url || null,
    favicon: metadata.favicon?.url || null,
    siteName: new URL(metadata.url || url).hostname
  }
}

/** Adds previews to external Notion collection cards, which are not React Link components. */
const ArticleLinkPreview = () => {
  const rootRef = useRef(null)
  const timerRef = useRef(null)
  const [activeLink, setActiveLink] = useState(null)
  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [position, setPosition] = useState(null)
  const siteUrl = siteConfig('LINK')
  const enabled = siteConfig('LINK_PREVIEW_ENABLE', true)

  useEffect(() => {
    rootRef.current = document.getElementById('notion-article')
    if (!enabled || !rootRef.current) return

    const supportsHover = window.matchMedia(
      '(hover: hover) and (pointer: fine)'
    )
    if (!supportsHover.matches) return

    const isEligible = link => {
      const url = getActualUrl(link)
      return (
        !link.dataset.linkPreviewManaged &&
        !link.closest('.notion-bookmark') &&
        !link.classList.contains('notion-file-link') &&
        !FILE_LIKE_URL_PATTERN.test(url) &&
        isExternalHttpLink(url, siteUrl)
      )
    }

    const clearPreview = () => {
      if (timerRef.current) clearTimeout(timerRef.current)
      timerRef.current = null
      setActiveLink(null)
      setPreview(null)
      setLoading(false)
      setPosition(null)
    }

    const startPreview = link => {
      if (!isEligible(link)) return
      if (timerRef.current) clearTimeout(timerRef.current)
      timerRef.current = setTimeout(() => {
        const url = getActualUrl(link)
        setActiveLink({ link, url })
        setPreview(previewCache.get(url) || null)
        setLoading(!previewCache.has(url))
        setPosition(getPreviewPosition(link.getBoundingClientRect()))
        timerRef.current = null
      }, PREVIEW_HOVER_DELAY_MS)
    }

    const onMouseOver = event => {
      const link = event.target.closest('a[href]')
      if (!link || !rootRef.current.contains(link)) return
      if (link.contains(event.relatedTarget)) return
      startPreview(link)
    }
    const onMouseOut = event => {
      const link = event.target.closest('a[href]')
      if (link && !link.contains(event.relatedTarget)) clearPreview()
    }

    rootRef.current.addEventListener('mouseover', onMouseOver)
    rootRef.current.addEventListener('mouseout', onMouseOut)
    return () => {
      rootRef.current?.removeEventListener('mouseover', onMouseOver)
      rootRef.current?.removeEventListener('mouseout', onMouseOut)
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [enabled, siteUrl])

  useEffect(() => {
    if (!activeLink || preview) return
    let cancelled = false
    fetchPreview(activeLink.url)
      .then(data => {
        previewCache.set(activeLink.url, data)
        if (!cancelled) setPreview(data)
      })
      .catch(() => {
        if (!cancelled) setActiveLink(null)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [activeLink, preview])

  if (!activeLink || typeof document === 'undefined') return null

  return createPortal(
    <div className='pointer-events-none fixed z-[10020] w-80' style={position}>
      <div className='overflow-hidden rounded-2xl border border-[var(--fuwari-border)] bg-[var(--fuwari-surface)] shadow-[0_20px_60px_rgba(15,23,42,0.18)] backdrop-blur-sm'>
        {preview?.image && (
          <div className='h-36 w-full overflow-hidden bg-[var(--fuwari-bg-soft)]'>
            <img
              src={preview.image}
              alt=''
              className='h-full w-full object-cover'
            />
          </div>
        )}
        <div className='space-y-2 p-4'>
          <div className='flex items-center gap-2 text-xs text-[var(--fuwari-muted)]'>
            {preview?.favicon && (
              <img
                src={preview.favicon}
                alt=''
                className='h-4 w-4 rounded-[4px] border border-black/5 bg-white/80'
              />
            )}
            <span className='truncate'>
              {preview?.siteName || new URL(activeLink.url).hostname}
            </span>
          </div>
          <div className='text-sm font-semibold leading-6 text-[var(--fuwari-text)]'>
            {loading ? '正在读取网页信息...' : preview?.title || '外部链接预览'}
          </div>
          {(loading || preview?.description) && (
            <p className='line-clamp-3 text-sm leading-6 text-[var(--fuwari-muted)]'>
              {loading
                ? '鼠标停留时会读取网页标题、简介和首图。'
                : preview.description}
            </p>
          )}
        </div>
      </div>
    </div>,
    document.body
  )
}

export default ArticleLinkPreview
