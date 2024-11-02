'use client'

import siteMetadata from '@/data/siteMetadata'
import { useEffect, useState } from 'react'

export default function ScrollTopAndComment() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const handleWindowScroll = () => {
      if (window.scrollY > 50) setShow(true)
      else setShow(false)
    }

    window.addEventListener('scroll', handleWindowScroll)
    return () => window.removeEventListener('scroll', handleWindowScroll)
  }, [])

  const handleScrollTop = () => {
    window.scrollTo({ top: 0 })
  }
  const handleScrollToComment = () => {
    document.getElementById('comment')?.scrollIntoView()
  }
  return (
    <div 
      className="fixed flex-col gap-3 flex" 
      style={{ 
        right: '1.5rem', 
        bottom: '1.5rem',
        '@media (max-width: 768px)': {
          bottom: '12rem'  // 确保在 MobileNavTOC 按钮之上
        }
      }}
    >
      {/* 回到顶部按钮 - 美化版本 */}
      <button
        aria-label="Scroll To Top"
        onClick={handleScrollTop}
        className={`p-3.5 
          bg-gradient-to-r from-white/80 to-white/60
          dark:from-gray-800/80 dark:to-gray-800/60
          text-slate-600 dark:text-slate-200 
          rounded-full shadow-lg backdrop-blur-md 
          ring-1 ring-black/5 dark:ring-white/5
          hover:shadow-indigo-500/20 hover:ring-indigo-500/50
          active:scale-95 transform transition-all duration-200
          ${show ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
        `}
      >
        <svg
          className="w-5 h-5"
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M5 10l5-5 5 5M5 15l5-5 5 5"
          />
        </svg>
      </button>

      {/* 评论按钮 - 如果有的话，使用相同样式 */}
      {siteMetadata.comments?.provider && (
        <button
          aria-label="Scroll To Comment"
          onClick={handleScrollToComment}
          className={`p-3.5 
            bg-gradient-to-r from-white/80 to-white/60
            dark:from-gray-800/80 dark:to-gray-800/60
            text-slate-600 dark:text-slate-200 
            rounded-full shadow-lg backdrop-blur-md 
            ring-1 ring-black/5 dark:ring-white/5
            hover:shadow-indigo-500/20 hover:ring-indigo-500/50
            active:scale-95 transform transition-all duration-200`}
        >
          <svg
            className="w-5 h-5"
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M17 8h2M17 12h2M17 16h2M5 8h2M5 12h2M5 16h2"
            />
          </svg>
        </button>
      )}
    </div>
  )
}
