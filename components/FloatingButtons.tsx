'use client'
import { useState, useEffect } from 'react'
import { HiOutlineMenuAlt2 } from 'react-icons/hi'

export default function FloatingButtons({ 
  showTOC = true,
  onTOCClick,
  showScrollTop = true,
  onScrollTopClick,
  showComment = false,
  onCommentClick
}) {
  const [show, setShow] = useState(false)

  // 滚动监听逻辑
  useEffect(() => {
    const handleScroll = () => {
      setShow(window.scrollY > 300)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="fixed right-6 bottom-6 flex flex-col gap-3 z-50">
      {/* TOC 按钮 */}
      {showTOC && (
        <button
          onClick={onTOCClick}
          className="p-3.5 bg-gradient-to-r from-white/80 to-white/60
            dark:from-gray-800/80 dark:to-gray-800/60 ... (其他样式)"
        >
          <HiOutlineMenuAlt2 className="w-5 h-5" />
        </button>
      )}

      {/* 回到顶部按钮 */}
      {showScrollTop && show && (
        <button
          onClick={onScrollTopClick}
          className="p-3.5 bg-gradient-to-r ... (其他样式)"
        >
          {/* 回到顶部图标 */}
        </button>
      )}

      {/* 评论按钮 */}
      {showComment && (
        <button
          onClick={onCommentClick}
          className="p-3.5 bg-gradient-to-r ... (其他样式)"
        >
          {/* 评论图标 */}
        </button>
      )}
    </div>
  )
} 