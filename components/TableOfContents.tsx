// ref: https://github.com/ekomenyong/kommy-mdx/blob/main/src/components/TOC.tsx
'use client'
import clsx from 'clsx'
import GithubSlugger from 'github-slugger'
import { list } from 'postcss'
// import { useTranslation } from 'next-i18next';
import { useEffect, useRef, useState } from 'react'

// eslint-disable-next-line no-unused-vars
type UseIntersectionObserverType = (setActiveId: (id: string) => void) => void

const useIntersectionObserver: UseIntersectionObserverType = (setActiveId) => {
  const headingElementsRef = useRef<{
    [key: string]: IntersectionObserverEntry
  }>({})

  useEffect(() => {
    const callback = (headings: IntersectionObserverEntry[]) => {
      headingElementsRef.current = headings.reduce((map, headingElement) => {
        map[headingElement.target.id] = headingElement
        return map
      }, headingElementsRef.current)

      const visibleHeadings: IntersectionObserverEntry[] = []
      console.log('headingElementsRef.current=', headingElementsRef.current)
      Object.keys(headingElementsRef.current).forEach((key) => {
        const headingElement = headingElementsRef.current[key]
        if (headingElement.isIntersecting) visibleHeadings.push(headingElement)
      })

      const getIndexFromId = (id: string) =>
        headingElements.findIndex((heading) => heading.id === id)

      if (visibleHeadings.length === 1) {
        setActiveId(visibleHeadings[0].target.id)
      } else if (visibleHeadings.length > 1) {
        const sortedVisibleHeadings = visibleHeadings.sort(
          (a, b) => getIndexFromId(b.target.id) - getIndexFromId(a.target.id)
        )

        setActiveId(sortedVisibleHeadings[0].target.id)
      }
    }

    const observer = new IntersectionObserver(callback, {
      rootMargin: '0px 0px -70% 0px',
    })

    const headingElements = Array.from(
      document.querySelectorAll('article h2,h3,h4')
    )

    headingElements.forEach((element) => observer.observe(element))

    return () => observer.disconnect()
  }, [setActiveId])
}

interface TOCProps {
  source: Array<{
    value: string
    url: string
    depth: number
  }>
  isMobile?: boolean
}

export default function TableOfContents({ source, isMobile = false }: TOCProps) {
  const slugger = new GithubSlugger()
  console.log('source=', source)
  const headings = source.map((item) => {
    return {
      text: item.value,
      level: item.depth,
      id: slugger.slug(item.value), // 使用 rehype-slug 的 slug 函数
    }
  })

  const [activeId, setActiveId] = useState<string>()

  useIntersectionObserver(setActiveId)

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>, id: string) => {
    // 这行代码阻止了按钮的默认行为（如果有的话）
    // 在这种情况下，它主要是为了确保点击按钮不会导致页面刷新或其他意外行为
    e.preventDefault()
    // 使用传入的id来查找对应的DOM元素
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest',
      })
    }
  }

  return (
    <div className={clsx(
      'text-sm', 
      isMobile ? 'max-h-[50vh] overflow-auto' : ''
    )}>
      <p className="mb-5 text-lg font-semibold text-gray-900 transition-colors dark:text-gray-100">
        目录
      </p>
      <div className="flex flex-col items-start justify-start">
        {headings.map((heading, index) => {
          return (
            <button
              key={index}
              type="button"
              className={clsx(
                heading.id === activeId
                  ? 'font-semibold text-primary-500 hover:text-primary-600 dark:hover:text-primary-400'
                  : 'font-normal text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200',
                'mb-3 text-left text-sm transition-colors hover:underline'
              )}
              style={{ paddingLeft: `${(heading.level - 2) * 1}rem` }}
              onClick={(e) => handleClick(e, heading.id)}
            >
              {heading.text}
            </button>
          )
        })}
      </div>
    </div>
  )
}
