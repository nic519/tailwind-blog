'use client'
import { useState } from 'react'
import TableOfContents from './TableOfContents'

interface MobileTOCProps {
  source: string
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
        bg-primary-500 text-white shadow-lg transition-all hover:bg-primary-600"
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
            <TableOfContents source={source} />
          </div>
        </>
      )}
    </div>
  )
} 
