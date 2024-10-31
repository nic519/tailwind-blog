import { useState, useEffect } from 'react'
import TableOfContents from './TableOfContents'

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
  buttonPosition = { bottom: '5rem', right: '1rem' },
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
      <button 
        onClick={() => setShowMobileToc(prev => !prev)}
        className="flex h-12 w-12 items-center justify-center rounded-full 
        text-gray-700 dark:text-white transition-all duration-300
        backdrop-blur-[8px] 
        shadow-[0_4px_12px_rgba(0,0,0,0.15),inset_0_1px_2px_rgba(255,255,255,0.4)]
        hover:shadow-[0_6px_16px_rgba(0,0,0,0.2),inset_0_1px_2px_rgba(255,255,255,0.5)]
        hover:transform hover:scale-105 active:scale-95
        border border-white/10 dark:border-white/5
        bg-gradient-to-br from-white/95 to-white/85
        dark:from-white/10 dark:to-white/5"
        aria-label="目录"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-6 w-6" 
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
      
      {/* 移动端 TOC 弹出层 */}
      {showMobileToc && (
        <>
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50" 
            onClick={() => setShowMobileToc(false)} 
          />
          <div className={`
            fixed transform overflow-auto rounded-lg bg-white p-4 
            shadow-xl transition-all duration-200 dark:bg-gray-900
          `}
          style={{ 
            bottom: panelPosition.bottom,
            right: panelPosition.right,
            maxHeight,
            width
          }}>
            <TableOfContents source={source} isMobile={true} />
          </div>
        </>
      )}
    </div>
  )
} 
