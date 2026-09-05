'use client'

import FontFaceObserver from 'fontfaceobserver'
import { useEffect } from 'react'

const FONT_READY_CLASS = 'font-wenkai-ready'
const FONT_TRANSITION_CLASS = 'font-wenkai-transition'

/**
 * Keep the system stack visible while the first local font slice arrives.
 * Font Face Observer verifies the face with Latin glyphs from the small base
 * slice; page-specific CJK slices remain browser-managed through unicode-range.
 */
const FontLoader = () => {
  useEffect(() => {
    const root = document.documentElement
    const font = new FontFaceObserver('LXGW WenKai', { weight: 400 })
    let transitionTimer

    font.load('BESbwy', 5000)
      .then(() => {
        root.classList.add(FONT_TRANSITION_CLASS, FONT_READY_CLASS)
        transitionTimer = window.setTimeout(() => {
          root.classList.remove(FONT_TRANSITION_CLASS)
        }, 180)
      })
      .catch(() => {
        // Keep the system font if the connection is too slow or the font fails.
        root.classList.remove(FONT_TRANSITION_CLASS, FONT_READY_CLASS)
      })

    return () => {
      window.clearTimeout(transitionTimer)
      root.classList.remove(FONT_TRANSITION_CLASS)
    }
  }, [])

  return null
}

export default FontLoader
