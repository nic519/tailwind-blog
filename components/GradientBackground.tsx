'use client'
import { useState, useEffect } from 'react'

interface GradientBackgroundProps {
  children: React.ReactNode
  enableGrid?: boolean
  className?: string
}

const LightGradient = () => (
  <>
    <div className="absolute top-[10vh] left-[20%] w-[30vw] h-[30vw] max-w-[400px] max-h-[400px] bg-purple-100/30 rounded-full mix-blend-multiply blur-3xl animate-blob" />
    <div className="absolute top-[30vh] right-[20%] w-[30vw] h-[30vw] max-w-[400px] max-h-[400px] bg-yellow-100/30 rounded-full mix-blend-multiply blur-3xl animate-blob animation-delay-2000" />
    <div className="absolute bottom-[20vh] left-[30%] w-[30vw] h-[30vw] max-w-[400px] max-h-[400px] bg-pink-100/30 rounded-full mix-blend-multiply blur-3xl animate-blob animation-delay-4000" />
  </>
)

const DarkGradient = () => (
  <>
    <div className="absolute top-[10vh] left-[20%] w-[30vw] h-[30vw] max-w-[400px] max-h-[400px] bg-purple-900/30 rounded-full mix-blend-soft-light blur-3xl animate-blob" />
    <div className="absolute top-[30vh] right-[20%] w-[30vw] h-[30vw] max-w-[400px] max-h-[400px] bg-yellow-900/30 rounded-full mix-blend-soft-light blur-3xl animate-blob animation-delay-2000" />
    <div className="absolute bottom-[20vh] left-[30%] w-[30vw] h-[30vw] max-w-[400px] max-h-[400px] bg-pink-900/30 rounded-full mix-blend-soft-light blur-3xl animate-blob animation-delay-4000" />
  </>
)

const GradientBackground = ({ 
  children, 
  enableGrid = true,
  className = ''
}: GradientBackgroundProps) => {
  const [showScrollTop, setShowScrollTop] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className={`relative ${className}`}>
      {/* 背景容器 */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        {/* 漸變光暈效果 */}
        <div className="hidden dark:block">
          <DarkGradient />
        </div>
        <div className="block dark:hidden">
          <LightGradient />
        </div>
        
        {/* 網格背景 (可選) */}
        {enableGrid && (
          <div className="absolute inset-0 bg-grid-slate-800 dark:bg-grid-slate-200 bg-[size:40px_40px] dark:bg-[size:30px_30px] opacity-5" />
        )}
      </div>

      {/* 內容 */}
      {children}

      {/* 火箭按钮 */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-8 right-4 p-3 rounded-full bg-white/70 dark:bg-gray-800/70 
          shadow-lg ring-1 ring-black/5 dark:ring-white/5 backdrop-blur-md
          transition-all duration-300 hover:scale-110 z-50
          ${showScrollTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'}`}
        aria-label="回到顶部"
      >
        <svg 
          className="w-6 h-6 text-gray-600 dark:text-gray-300" 
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M16 11L15.5 19M16 11C16 6.5 14.5 4 11.9999 2C9.5 4 8 6.5 8 11M16 11L18 12.5C19.259 13.4443 20 14.9262 20 16.5V19.4612C20 20.1849 19.2551 20.669 18.5939 20.375L15.5 19M8 11L8.5 19M8 11L6 12.5C4.74097 13.4443 4 14.9262 4 16.5V19.4612C4 20.1849 4.74485 20.669 5.40614 20.375L8.5 19M8.5 19H15.5M12 9V11" />
        </svg>
      </button>
    </div>
  )
}

export default GradientBackground 