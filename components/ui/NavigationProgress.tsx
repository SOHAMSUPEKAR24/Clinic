'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

export function NavigationProgress() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isNavigating, setIsNavigating] = useState(false)
  const [width, setWidth] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const prevPathRef = useRef(pathname + searchParams.toString())

  useEffect(() => {
    const currentPath = pathname + searchParams.toString()
    if (prevPathRef.current !== currentPath) {
      // Navigation completed — finish the bar
      setWidth(100)
      if (timerRef.current) clearInterval(timerRef.current)
      timeoutRef.current = setTimeout(() => {
        setIsNavigating(false)
        setWidth(0)
      }, 300)
      prevPathRef.current = currentPath
    }
  }, [pathname, searchParams])

  // Start the bar when a link is clicked
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest('a')
      if (!anchor) return
      const href = anchor.getAttribute('href')
      // Only internal navigations
      if (!href || href.startsWith('http') || href.startsWith('#') || href.startsWith('mailto')) return

      setIsNavigating(true)
      setWidth(15)

      let w = 15
      timerRef.current = setInterval(() => {
        // Slow crawl: never reaches 90 until navigation completes
        w = w < 70 ? w + Math.random() * 8 : w + Math.random() * 1
        if (w > 85) w = 85
        setWidth(w)
      }, 200)
    }

    window.addEventListener('click', handleClick, true)
    return () => {
      window.removeEventListener('click', handleClick, true)
      if (timerRef.current) clearInterval(timerRef.current)
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  if (!isNavigating && width === 0) return null

  return (
    <div
      id="nprogress-bar"
      style={{
        width: `${width}%`,
        opacity: isNavigating ? 1 : 0,
        transition: width === 100 ? 'width 0.2s ease, opacity 0.3s ease' : 'width 0.2s ease',
      }}
    />
  )
}
