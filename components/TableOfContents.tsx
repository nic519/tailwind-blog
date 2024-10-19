"use client"

import { useEffect, useState } from 'react'

const TableOfContents = () => {
  const [headings, setHeadings] = useState<{ id: string; text: string; level: number }[]>([])

  useEffect(() => {
    // 假设文章内容在一个特定的容器内，例如 id 为 "article-content" 的 div
    const articleContainer = document.getElementById('article-content')
    
    if (articleContainer) {
      const elements = Array.from(articleContainer.querySelectorAll('h2, h3, h4'))
      const headingElements = elements.map((element) => ({
        id: element.id,
        text: element.textContent || '',
        level: Number(element.tagName.charAt(1))
      }))
      setHeadings(headingElements)
    }
  }, [])

  return (
    <nav className="toc">
      <h2 className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
        Table of Contents
      </h2>
      <ul className="mt-4 space-y-2">
        {headings.map((heading) => (
          <li key={heading.id} className={`pl-${(heading.level - 2) * 4}`}>
            <a
              href={`#${heading.id}`}
              className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default TableOfContents
