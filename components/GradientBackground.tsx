'use client'

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
    </div>
  )
}

export default GradientBackground 