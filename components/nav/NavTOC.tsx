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

  useEffect(() => {
    const timer = setTimeout(() => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }

      observerRef.current = new IntersectionObserver(
        (entries) => {
          const visibleEntries = entries.filter(entry => entry.isIntersecting)
          
          if (visibleEntries.length > 0) {
            const topEntry = visibleEntries.reduce((prev, curr) => {
              return prev.boundingClientRect.y < curr.boundingClientRect.y ? prev : curr
            })
            
            setActiveId(topEntry.target.id)
          }
        },
        {
          rootMargin: '-10% 0px -80% 0px',
          threshold: [0, 0.1, 0.5, 1]
        }
      )

      document.querySelectorAll('section[id]').forEach((section) => {
        observerRef.current?.observe(section)
      })
    }, 100)

    return () => {
      clearTimeout(timer)
      observerRef.current?.disconnect()
    }
  }, [navItems])

  useEffect(() => {
    if (activeId && tocRef.current) {
      const activeElement = tocRef.current.querySelector(`[data-section="${activeId}"]`) as HTMLElement
      if (activeElement) {
        const container = tocRef.current
        const containerRect = container.getBoundingClientRect()
        const elementRect = activeElement.getBoundingClientRect()

        const isInView = (
          elementRect.top >= containerRect.top &&
          elementRect.bottom <= containerRect.bottom
        )

        if (!isInView) {
          const containerCenter = container.offsetHeight / 2
          const elementCenter = activeElement.offsetHeight / 2
          const scrollTo = activeElement.offsetTop - containerCenter + elementCenter

          container.scrollTo({
            top: scrollTo,
            behavior: 'smooth'
          })
        }
      }
    }
  }, [activeId])

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
      setActiveId(id)
    }
  }

  return (
    <div ref={tocRef} className="h-full overflow-y-auto
      [&::-webkit-scrollbar]:w-1.5
      [&::-webkit-scrollbar-track]:bg-transparent
      [&::-webkit-scrollbar-thumb]:bg-gray-300/50
      [&::-webkit-scrollbar-thumb]:rounded-full
      [&::-webkit-scrollbar-thumb]:border-4
      [&::-webkit-scrollbar-thumb]:border-solid
      [&::-webkit-scrollbar-thumb]:border-transparent
      [&::-webkit-scrollbar-thumb]:bg-clip-padding
      hover:[&::-webkit-scrollbar-thumb]:bg-gray-300
      dark:[&::-webkit-scrollbar-thumb]:bg-gray-700/50
      dark:hover:[&::-webkit-scrollbar-thumb]:bg-gray-700">
      <div className="mb-8">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">发现导航</h1>
      </div>
      
      {navItems.map(category => (
        <div key={category.title} className="space-y-2">
          <h2 className="text-sm font-bold text-primary-400 dark:text-primary-500 my-4">
            {category.title}
          </h2>
          {category.nav.flatMap(navGroup => 
            navGroup.nav.map(section => {
              const sectionId = generateUniqueId(category.title, section.title, section.createdAt || '')
              return (
                <button
                  key={sectionId}
                  data-section={sectionId}
                  onClick={() => scrollToSection(sectionId)}
                  className={`flex w-full items-center px-3 py-2 rounded-lg text-left text-sm
                    transition-colors duration-200 ${
                      activeId === sectionId 
                        ? 'bg-primary-500/10 text-primary-500' 
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/50'
                    }`}
                >
                  <span>{section.title}</span>
                  {section.itemNav && (
                    <span className={`ml-auto text-xs ${
                      activeId === sectionId
                        ? 'text-primary-500/70'
                        : 'text-gray-400 dark:text-gray-500'
                    }`}>
                      × {section.itemNav.length}
                    </span>
                  )}
                </button>
              )
            })
          )}
        </div>
      ))}
    </div>
  )
} 