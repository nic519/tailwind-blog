'use client'
import { useState } from 'react'
import { HiOutlineMenuAlt2 } from 'react-icons/hi'
import { type NavData } from './types/nav'
import NavTOC from './NavTOC'

interface MobileNavTOCProps {
  navItems: NavData
  buttonPosition: { bottom: string; right: string }
  panelPosition: { bottom: string; right: string }
  maxHeight: string
  width: string
}

export default function MobileNavTOC({
  navItems,
  buttonPosition,
  panelPosition,
  maxHeight,
  width
}: MobileNavTOCProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* 悬浮按钮 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed z-50 p-3 text-gray-600 bg-white/70 dark:bg-gray-800/70 
          dark:text-gray-200 rounded-full shadow-lg backdrop-blur-md 
          ring-1 ring-black/5 dark:ring-white/5 lg:hidden
          hover:bg-gray-100 dark:hover:bg-gray-700/70 transition-colors`}
        style={{
          bottom: buttonPosition.bottom,
          right: buttonPosition.right
        }}
      >
        <HiOutlineMenuAlt2 className="w-6 h-6" />
      </button>

      {/* 导航面板 */}
      {isOpen && (
        <>
          {/* 背景遮罩 */}
          <div
            className="fixed inset-0 bg-black/20 dark:bg-black/50 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setIsOpen(false)}
          />
          
          {/* TOC 面板 */}
          <div
            className="fixed z-50 lg:hidden"
            style={{
              bottom: panelPosition.bottom,
              right: panelPosition.right,
              maxHeight: maxHeight,
              width: width
            }}
          >
            <div className="backdrop-blur-md bg-white/70 dark:bg-gray-950/20 
              rounded-lg shadow-lg ring-1 ring-black/5 dark:ring-white/5 
              overflow-hidden"
            >
              <div className="p-4 overflow-y-auto" style={{ maxHeight }}>
                <NavTOC navItems={navItems} />
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
} 