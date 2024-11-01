'use client'

interface NavCardProps {
  name: string
  desc?: string
  url: string
  icon?: string
  urls?: Record<string, string>
}

export default function NavCard({ name, desc, url, icon, urls }: NavCardProps) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="group backdrop-blur-md bg-white/70 dark:bg-gray-950/20 
        rounded-xl p-4 shadow-lg ring-1 ring-black/5 dark:ring-white/5
        hover:shadow-xl transition-all duration-300"
    >
      <div className="flex items-center gap-3 mb-2">
        {icon && (
          <img 
            src={icon} 
            alt="" 
            className="w-8 h-8 rounded-lg"
            loading="lazy"
          />
        )}
        <h3 className="font-medium text-gray-900 dark:text-white group-hover:text-primary-500">
          {name}
        </h3>
      </div>
      {desc && (
        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
          {desc}
        </p>
      )}
      <div className="flex justify-between items-center mt-4">
        <div className="flex gap-2">
          {urls && Object.keys(urls).length > 0 && (
            <span className="px-2 py-1 text-xs bg-primary-500/10 text-primary-500 
              rounded-full font-medium">
              相关链接
            </span>
          )}
        </div>
        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button 
            onClick={(e) => {
              e.preventDefault()
              navigator.clipboard.writeText(url)
            }}
            className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
          >
            <span className="sr-only">复制</span>
            {/* 添加复制图标 */}
          </button>
        </div>
      </div>
    </a>
  )
} 