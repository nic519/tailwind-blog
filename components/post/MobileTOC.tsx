import { useState } from 'react'
import TableOfContents from '@/components/post/TableOfContents'

interface MobileTOCProps {
  source: Array<{
    value: string
    url: string
    depth: number
  }>,
  buttonPosition?: {
    bottom?: string
    right?: string
  }
  panelPosition?: {
    bottom?: string
    right?: string
  }
  maxHeight?: string
  width?: string
}

export default function MobileTOC({ 
  source,
  buttonPosition = { bottom: '5rem', right: '2rem' },
  panelPosition = { bottom: '9rem', right: '1rem' },
  maxHeight = '60vh',
  width = '18rem'
}: MobileTOCProps) {
  const [showMobileToc, setShowMobileToc] = useState(false)

  return (
    <div className="fixed z-50 lg:hidden" style={{ 
      bottom: buttonPosition.bottom, 
      right: buttonPosition.right 
    }}>
      {/* 统一按钮样式 */}
      <button 
        onClick={() => setShowMobileToc(prev => !prev)}
        className={`p-3.5 
          bg-gradient-to-r from-white/80 to-white/60
          dark:from-gray-800/80 dark:to-gray-800/60
          text-slate-600 dark:text-slate-200 
          rounded-full shadow-lg backdrop-blur-md 
          ring-1 ring-black/5 dark:ring-white/5
          hover:shadow-indigo-500/20 hover:ring-indigo-500/50
          active:scale-95 transform transition-all duration-200
          ${showMobileToc ? 'rotate-90' : 'rotate-0'}`}
        aria-label="目录"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-5 w-5" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M4 6h16M4 12h16M4 18h7" 
          />
        </svg>
      </button>
      
      {/* 统一面板样式 */}
      {showMobileToc && (
        <>
          <div 
            className="fixed inset-0 bg-black/20 dark:bg-black/50 backdrop-blur-sm z-40" 
            onClick={() => setShowMobileToc(false)} 
          />
          <div 
            className="fixed z-50 backdrop-blur-md bg-white/70 dark:bg-gray-950/20 
              rounded-lg shadow-lg ring-1 ring-black/5 dark:ring-white/5 
              overflow-hidden"
            style={{ 
              bottom: panelPosition.bottom,
              right: panelPosition.right,
              maxHeight,
              width
            }}
          >
            <div className="p-4 overflow-y-auto [&::-webkit-scrollbar]:w-1.5
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
              <TableOfContents source={source} isMobile={true} />
            </div>
          </div>
        </>
      )}
    </div>
  )
} 
