'use client'

interface GradientBackgroundProps {
  children: React.ReactNode
  enableGrid?: boolean
  className?: string
}

const GradientBackground = ({ 
  children, 
  enableGrid = true,
  className = ''
}: GradientBackgroundProps) => {
  return (
    <div className={`relative ${className}`}>
      {/* 背景容器 */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        {/* 漸變光暈效果 */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-300 dark:bg-purple-900/30 rounded-full mix-blend-multiply dark:mix-blend-soft-light blur-3xl animate-blob" />
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-yellow-200 dark:bg-yellow-900/30 rounded-full mix-blend-multiply dark:mix-blend-soft-light blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-pink-200 dark:bg-pink-900/30 rounded-full mix-blend-multiply dark:mix-blend-soft-light blur-3xl animate-blob animation-delay-4000" />
        
        {/* 網格背景 (可選) */}
        {enableGrid && (
          <div className="absolute inset-0 bg-grid-slate-800 dark:bg-grid-slate-200 bg-[size:40px_40px] dark:bg-[size:30px_30px] opacity-5" />
        )}
      </div>

      {/* 內容 */}
      {children}
    </div>
  )
}

export default GradientBackground 