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

      window.scrollTo({
        top: elementTop - offset - 10,
        behavior: 'auto'
      })

      requestAnimationFrame(() => {
        window.scrollTo({
          top: elementTop - offset,
          behavior: 'smooth'
        })
      })

      const handleScrollEnd = () => {
        setTimeout(() => {
          isScrollingRef.current = false
          initializeObserver()
        }, 100)
      }

      const scrollListener = debounce(() => {
        if (isScrollingRef.current) {
          handleScrollEnd()
        }
      }, 150)

      window.addEventListener('scroll', scrollListener, { once: true })
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
      <div ref={tocRef} className="h-[calc(100vh-8rem)] overflow-y-auto space-y-4 pr-4 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700 scrollbar-track-transparent">
        {navItems.map(category => (
          <div key={category.title} className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {category.title}
            </h3>
            {category.nav?.map(navGroup => {
              const navGroupId = generateUniqueId(...[
                category.title,
                navGroup.title,
                navGroup.createdAt || ''
              ])
              return (
                <div key={navGroup.title} data-section={navGroupId} className="pl-2">
                  <a
                    href={`#${navGroupId}`}
                    onClick={(e) => handleClick(e, navGroupId)}
                    className={`block text-sm transition-colors duration-200 ${
                      activeId === navGroupId
                        ? 'text-blue-500 font-medium'
                        : 'text-gray-600 dark:text-gray-400 hover:text-blue-500'
                    }`}
                  >
                    {navGroup.title}
                    {navGroup.nav?.length > 0 && (
                      <span className="ml-2 text-xs text-gray-400">
                        × {navGroup.nav.length}
                      </span>
                    )}
                  </a>
                  {navGroup.nav?.map(section => {
                    const sectionId = generateUniqueId(...[
                      category.title,
                      navGroup.title,
                      section.title,
                      section.createdAt || ''
                    ])
                    return (
                      <div key={section.title} data-section={sectionId} className="pl-4 mt-1">
                        <a
                          href={`#${sectionId}`}
                          onClick={(e) => handleClick(e, sectionId)}
                          className={`block text-sm transition-colors duration-200 ${
                            activeId === sectionId
                              ? 'text-blue-500 font-medium'
                              : 'text-gray-600 dark:text-gray-400 hover:text-blue-500'
                          }`}
                        >
                          {section.title}
                          {section.itemNav?.length > 0 && (
                            <span className="ml-2 text-xs text-gray-400">
                              × {section.itemNav.length}
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