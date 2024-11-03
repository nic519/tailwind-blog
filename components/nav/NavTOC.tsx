'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { type NavData } from './types/nav'
import { generateUniqueId } from './GenerateUniqueId'

interface NavTOCProps {
  navItems: NavData
}

export default function NavTOC({ navItems }: NavTOCProps) {
  const [activeId, setActiveId] = useState<string>('')
  const tocRef = useRef<HTMLDivElement>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)
  const isScrollingRef = useRef(false)

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault()
    const element = document.getElementById(id)
    if (element) {
      isScrollingRef.current = true
      
      if (observerRef.current) {
        observerRef.current.disconnect()
      }

      setActiveId(id)

      const rect = element.getBoundingClientRect()
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop
      const elementTop = rect.top + scrollTop
      const offset = 80

      const handleScrollEnd = () => {
        isScrollingRef.current = false
        initializeObserver()
        window.removeEventListener('scrollend', handleScrollEnd)
      }
      
      window.addEventListener('scrollend', handleScrollEnd)

      window.scrollTo({
        top: elementTop - offset,
        behavior: 'smooth'
      })
    }
  }

  const initializeObserver = useCallback(() => {
    if (isScrollingRef.current) {
      return false
    }

    if (observerRef.current) {
      observerRef.current.disconnect()
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (isScrollingRef.current) return

        const visibleSections = entries.filter(entry => {
          const rect = entry.boundingClientRect
          return entry.isIntersecting && rect.top <= 100 && entry.intersectionRatio > 0
        })

        if (visibleSections.length > 0) {
          const topSection = visibleSections.reduce((prev, curr) => {
            return Math.abs(prev.boundingClientRect.top) < Math.abs(curr.boundingClientRect.top) 
              ? prev 
              : curr
          })

          setActiveId(topSection.target.id)
        }
      },
      {
        rootMargin: '-80px 0px -50% 0px',
        threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0]
      }
    )

    const sections = document.querySelectorAll('section[id]')
    sections.forEach(section => {
      observerRef.current?.observe(section)
    })

    return true
  }, [])

  useEffect(() => {
    let retryCount = 0
    const maxRetries = 5
    const retryInterval = 200

    const tryInitialize = () => {
      if (retryCount >= maxRetries) {
        console.log('Max retries reached')
        return
      }

      if (!initializeObserver()) {
        retryCount++
        setTimeout(tryInitialize, retryInterval)
      }
    }

    const initialTimer = setTimeout(() => {
      tryInitialize()
    }, 500)

    return () => {
      clearTimeout(initialTimer)
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [initializeObserver, navItems])

    useEffect(() => {
      const handleRouteChange = () => {
        initializeObserver()
      }

      window.addEventListener('popstate', handleRouteChange)
      return () => window.removeEventListener('popstate', handleRouteChange)
    }, [initializeObserver])

    useEffect(() => {
      const handleScroll = debounce(() => {
        if (!initializeObserver()) {
          initializeObserver()
        }
      }, 100)

      window.addEventListener('scroll', handleScroll, { passive: true })
      return () => window.removeEventListener('scroll', handleScroll)
    }, [initializeObserver])

    useEffect(() => {
      if (activeId && tocRef.current) {
        const activeElement = tocRef.current.querySelector(`[data-section="${activeId}"]`) as HTMLElement
        if (activeElement) {
          const container = tocRef.current
          const containerRect = container.getBoundingClientRect()
          const elementRect = activeElement.getBoundingClientRect()

          if (elementRect.top < containerRect.top || elementRect.bottom > containerRect.bottom) {
            activeElement.scrollIntoView({
              behavior: 'smooth',
              block: 'center'
            })
          }
        }
      }
    }, [activeId])

    return (
      <div 
        ref={tocRef} 
        className="h-[calc(100vh-8rem)] overflow-y-auto space-y-4 pr-4 
          [&::-webkit-scrollbar]:w-1.5
          [&::-webkit-scrollbar-track]:bg-transparent
          [&::-webkit-scrollbar-thumb]:bg-gray-200
          [&::-webkit-scrollbar-thumb]:rounded-full
          [&::-webkit-scrollbar-thumb]:border-2
          [&::-webkit-scrollbar-thumb]:border-transparent
          hover:[&::-webkit-scrollbar-thumb]:bg-gray-300
          dark:[&::-webkit-scrollbar-thumb]:bg-gray-800
          dark:hover:[&::-webkit-scrollbar-thumb]:bg-gray-700
          [@supports(scrollbar-width:thin)]:scrollbar-thin
          [@supports(scrollbar-color:auto)]:scrollbar-color-gray-200"
      >
        {navItems.map(category => (
          <div key={category.title} className="space-y-2">
            <h3 className="text-lg font-bold tracking-tight
              text-slate-800 dark:text-slate-200">
              {category.title}
            </h3>
            {category.nav?.map(section => {
              const sectionId = generateUniqueId(category.title, section.title)
              return (
                <div key={section.title} data-section={sectionId} className="pl-0">
                  <a
                    href={`#${sectionId}`}
                    onClick={(e) => handleClick(e, sectionId)}
                    className={`block text-[15px] font-medium transition-colors my-2 duration-200 ${
                      activeId === sectionId
                        ? 'text-indigo-500 dark:text-indigo-400'
                        : 'text-slate-700 dark:text-slate-300 hover:text-indigo-500 dark:hover:text-indigo-400'
                    }`}
                  >
                    {section.title}
                  </a>
                  {section.nav?.map(subSection => {
                    const subSectionId = generateUniqueId(category.title, section.title, subSection.title)
                    return (
                      <div key={subSection.title} data-section={subSectionId} className="pl-2 mt-1">
                        <a
                          href={`#${subSectionId}`}
                          onClick={(e) => handleClick(e, subSectionId)}
                          className={`block text-[13px] leading-relaxed transition-colors duration-200 ${
                            activeId === subSectionId
                              ? 'text-indigo-500 dark:text-indigo-400 font-bold'
                              : 'text-slate-600 dark:text-slate-400 hover:text-indigo-500 dark:hover:text-indigo-400'
                          }`}
                        >
                          - {subSection.title}
                          {(subSection.itemNav?.length ?? 0) > 0 && (
                            <span className="ml-2 text-[11px] text-slate-400 dark:text-slate-500">
                              × {subSection.itemNav?.length}
                            </span>
                          )}
                        </a>
                      </div>
                    )
                  })}
                </div>
              )
            })}
          </div>
        ))}
      </div>
    )
  }

  function debounce(fn: Function, delay: number) {
    let timeoutId: NodeJS.Timeout
    return function (...args: any[]) {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => fn(...args), delay)
    }
  } 