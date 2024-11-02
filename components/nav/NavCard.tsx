'use client'

import Image from 'next/image'

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
      className="group backdrop-blur-md bg-white/60 dark:bg-gray-950/20 
        rounded-lg p-4 shadow-sm ring-1 ring-black/5 dark:ring-white/5
        hover:shadow-md transition-all duration-300"
    >
      <div className="flex items-center gap-3 mb-2">
        {icon && (
          <Image 
            src={icon} 
            alt=""
            width={32}
            height={32} 
            className="rounded object-contain"
            loading="lazy"
            onError={(e) => {
              // 移除错误的图片元素
              e.currentTarget.style.display = 'none'
            }}
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
       
    </a>
  )
} 