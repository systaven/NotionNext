'use client'

import FontFaceObserver from 'fontfaceobserver'
import { useEffect } from 'react'

const FontLoader = () => {
  useEffect(() => {
    const root = document.documentElement
    const observer = new FontFaceObserver('ChillRound', { weight: 400 })
    let timer

    observer.load('Mizuki', 5000)
      .then(() => {
        root.classList.add('font-chillround-ready', 'font-chillround-transition')
        timer = window.setTimeout(() => {
          root.classList.remove('font-chillround-transition')
        }, 180)
      })
      .catch(() => {
        root.classList.remove('font-chillround-ready', 'font-chillround-transition')
      })

    return () => window.clearTimeout(timer)
  }, [])

  return null
}

export default FontLoader
