'use client'
import { useState } from 'react'
import NavTOC from '@/components/nav/NavTOC'
import NavCard from '@/components/nav/NavCard'
import GradientBackground from '@/components/GradientBackground'
import { generateUniqueId } from '@/components/nav/generateUniqueId'

export default function NavLayout({ navItems }: { navItems: NavData }) {
    // 使用 Map 或对象来存储每个 section 的展开状态
    const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({})

    const toggleSection = (sectionId: string) => {
        setExpandedSections(prev => ({
            ...prev,
            [sectionId]: !prev[sectionId]
        }))
    }

    return (
        <GradientBackground enableGrid={true} className="min-h-screen">
            <div className="flex">
                {/* 使用 NavTOC 组件 */}
                <aside className="w-64 backdrop-blur-md bg-white/70 dark:bg-gray-950/20 p-6 space-y-4 rounded-lg
      shadow-lg ring-1 ring-black/5 dark:ring-white/5 h-screen
      hidden lg:block sticky top-20">
                    <NavTOC navItems={navItems} />
                </aside>

                {/* 右侧内容区 */}
                <main className="flex-1 lg:pl-8">
                    <div className="max-w-7xl mx-auto">
                        {navItems.map(category => (
                            category.nav[0].nav.map(section => (
                                <section
                                    key={section.title}
                                    id={generateUniqueId(category.title, section.title)}
                                    className='mb-12'
                                >
                                    <h2 
                                      onClick={() => toggleSection(generateUniqueId(category.title, section.title))}
                                      className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2 cursor-pointer select-none"
                                    >
                                        <span className="flex items-center gap-2">
                                          <svg
                                            className={`w-4 h-4 transition-transform duration-200 
                                              ${(expandedSections[generateUniqueId(category.title, section.title)] ?? true) ? 'rotate-90' : ''}`}
                                            viewBox="0 0 24 24"
                                          >
                                            <path
                                              fill="currentColor"
                                              d="M8.59 16.59L13.17 12L8.59 7.41L10 6l6 6l-6 6l-1.41-1.41z"
                                            />
                                          </svg>
                                          {section.title}
                                        </span>
                                        {section.nav?.length && (
                                            <span className="text-sm text-gray-500 dark:text-gray-400">
                                                × {section.nav.length}
                                            </span>
                                        )}
                                    </h2>
                                    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4
                                      transition-all duration-200 ease-in-out
                                      ${(expandedSections[generateUniqueId(category.title, section.title)] ?? true) 
                                        ? 'opacity-100 max-h-[2000px]'
                                        : 'opacity-0 max-h-0 overflow-hidden'
                                      }`}>
                                        {section.nav.map(item => (
                                            <NavCard
                                                key={item.id}
                                                name={item.name}
                                                desc={item.desc}
                                                url={item.url}
                                                icon={item.icon}
                                                urls={item.urls}
                                            />
                                        ))}
                                    </div>
                                </section>
                            ))
                        ))}
                    </div>
                </main>
            </div>
        </GradientBackground>
    )
} 