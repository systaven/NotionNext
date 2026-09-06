'use client'

import FontFaceObserver from 'fontfaceobserver'
import { useEffect } from 'react'

const FontLoader = () => {
  useEffect(() => {
    const root = document.documentElement
    const observer = new FontFaceObserver('Maruko Gothic SC', { weight: 500 })
    let timer

    observer.load('Mizuki', 5000)
      .then(() => {
        root.classList.add('font-maruko-ready', 'font-maruko-transition')
        timer = window.setTimeout(() => {
          root.classList.remove('font-maruko-transition')
        }, 180)
      })
      .catch(() => {
        root.classList.remove('font-maruko-ready', 'font-maruko-transition')
      })

    return () => window.clearTimeout(timer)
  }, [])

  return null
}

export default FontLoader
