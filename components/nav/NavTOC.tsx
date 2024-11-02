'use client'

import { useEffect, useState, useRef } from 'react'
import { type NavData } from './types/nav'
import { generateUniqueId } from './GenerateUniqueId'

interface NavTOCProps {
  navItems: NavData
}

export default function NavTOC({ navItems }: NavTOCProps) {
  const [activeId, setActiveId] = useState<string>('')
  const tocRef = useRef<HTMLDivElement>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault()
    const element = document.getElementById(id)
    if (element) {
      const offset = 80 // 顶部偏移量
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset
      window.scrollTo({
        top: elementPosition - offset,
        behavior: 'smooth'
      })
      setActiveId(id)
    }
  }

  useEffect(() => {
    const setupObserver = () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }

      observerRef.current = new IntersectionObserver(
        (entries) => {
          // 获取所有可见的部分
          const visibleSections = entries.filter(entry => {
            const rect = entry.boundingClientRect
            const ratio = entry.intersectionRatio
            
            // 调试信息
            console.log(`Section ${entry.target.id}:`, {
              ratio,
              top: rect.top,
              isIntersecting: entry.isIntersecting
            })
            
            // 判断元素是否在视口中且足够可见
            return entry.isIntersecting && rect.top <= 100 && ratio > 0
          })

          if (visibleSections.length > 0) {
            // 找到最靠近顶部的可见部分
            const activeSection = visibleSections.reduce((prev, curr) => {
              const prevTop = Math.abs(prev.boundingClientRect.top)
              const currTop = Math.abs(curr.boundingClientRect.top)
              return prevTop < currTop ? prev : curr
            })

            const newActiveId = activeSection.target.id
            if (newActiveId !== activeId) {
              console.log('Setting new active ID:', newActiveId)
              setActiveId(newActiveId)
            }
          }
        },
        {
          // 调整观察区域
          rootMargin: '-80px 0px -50% 0px',
          threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0]
        }
      )

      // 观察所有 section 元素
      const sections = document.querySelectorAll('section[id]')
      console.log('Found sections:', sections.length)
      
      sections.forEach(section => {
        observerRef.current?.observe(section)
        console.log('Started observing:', section.id)
      })
    }

    // 确保在 DOM 完全加载后设置观察器
    if (document.readyState === 'complete') {
      setupObserver()
    } else {
      const handleLoad = () => {
        setupObserver()
        window.removeEventListener('load', handleLoad)
      }
      window.addEventListener('load', handleLoad)
      return () => window.removeEventListener('load', handleLoad)
    }

    // 组件卸载时清理
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [navItems, activeId]) // 依赖项中添加 activeId

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
            const navGroupId = generateUniqueId(category.title, navGroup.title, navGroup.createdAt || '')
            return (
              <div
                key={navGroup.title}
                data-section={navGroupId}
                className="pl-2"
              >
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
                  const sectionId = generateUniqueId(category.title, section.title, section.createdAt || '')
                  return (
                    <div
                      key={section.title}
                      data-section={sectionId}
                      className="pl-4 mt-1"
                    >
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