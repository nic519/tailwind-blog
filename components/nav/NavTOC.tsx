'use client'

import { useEffect, useRef } from 'react'
import { type NavData } from './types/nav'

interface NavTOCProps {
  navItems: NavData
  activeId: string
  navigate: (id: string) => void
}

export default function NavTOC({ navItems, activeId, navigate }: NavTOCProps) {
  const tocRef = useRef<HTMLDivElement>(null)

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault()
    navigate(id)
  }

  useEffect(() => {
    if (activeId && tocRef.current) {
      const activeElement = tocRef.current.querySelector(
        `[data-section="${activeId}"]`
      ) as HTMLElement
      if (activeElement) {
        const container = tocRef.current
        if (!container.offsetParent) return
        const containerRect = container.getBoundingClientRect()
        const elementRect = activeElement.getBoundingClientRect()

        if (elementRect.top < containerRect.top || elementRect.bottom > containerRect.bottom) {
          activeElement.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
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
      {navItems.map((category) => (
        <div key={category.title} className="space-y-2">
          <h3
            className="text-lg font-bold tracking-tight
              text-slate-800 dark:text-slate-200"
          >
            {category.title}
          </h3>
          {category.nav?.map((section) => {
            return (
              <div key={section.id} data-section={section.id} className="pl-0">
                <a
                  href={`#${section.id}`}
                  onClick={(e) => handleClick(e, section.id)}
                  className={`block text-[15px] font-medium transition-colors my-2 duration-200 ${
                    activeId === section.id
                      ? 'text-indigo-500 dark:text-indigo-400'
                      : 'text-slate-700 dark:text-slate-300 hover:text-indigo-500 dark:hover:text-indigo-400'
                  }`}
                >
                  {section.title}
                </a>
                {section.nav?.map((subSection) => {
                  return (
                    <div key={subSection.id} data-section={subSection.id} className="pl-2 mt-1">
                      <a
                        href={`#${subSection.id}`}
                        onClick={(e) => handleClick(e, subSection.id)}
                        className={`block text-[13px] leading-relaxed transition-colors duration-200 ${
                          activeId === subSection.id
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
