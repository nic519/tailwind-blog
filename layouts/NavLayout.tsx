'use client'
import { useState, useEffect } from 'react'
import NavTOC from '@/components/nav/NavTOC'
import NavCard from '@/components/nav/NavCard'
import GradientBackground from '@/components/GradientBackground'
import { generateUniqueId } from '@/components/nav/GenerateUniqueId'
import { type NavData } from '@/components/nav/types/nav'
import { Suspense } from 'react'
import LoadingSection from '@/components/nav/LoadingSection'

export default function NavLayout({ navItems }: { navItems: NavData }) {
  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({})
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
    }, 500)
  }, [navItems])

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }))
  }

  return (
    <GradientBackground enableGrid={true} className="min-h-screen">
      <div className="flex">
        <aside className="w-64 backdrop-blur-md bg-white/70 dark:bg-gray-950/20 p-6 space-y-4 rounded-lg shadow-lg ring-1 ring-black/5 dark:ring-white/5 h-screen hidden lg:block sticky top-20">
          <NavTOC navItems={navItems} />
        </aside>

        <main className="flex-1 lg:pl-8">
          <div className="max-w-7xl mx-auto">
            <Suspense fallback={<LoadingSection />}>
              {isLoading ? (
                <div className="space-y-12">
                  {[1, 2, 3].map((i) => (
                    <LoadingSection key={i} />
                  ))}
                </div>
              ) : (
                navItems.map(category => (
                  <div key={category.title}>
                    {category.nav.map(navGroup => (
                      <div key={navGroup.title}>
                        {navGroup.nav.map(section => {
                          const categoryTitle = category.title;
                          const sectionTitle = section.title;
                          const uniqueId = generateUniqueId(categoryTitle, sectionTitle, section.createdAt || '')
                          return (
                            <section key={sectionTitle} id={uniqueId} className='mb-12'>
                              <h2 onClick={() => toggleSection(uniqueId)} className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2 cursor-pointer select-none">
                                <span className="flex items-center gap-2">
                                  <svg className={`w-4 h-4 transition-transform duration-200 ${(expandedSections[uniqueId] ?? true) ? 'rotate-90' : ''}`} viewBox="0 0 24 24">
                                    <path fill="currentColor" d="M8.59 16.59L13.17 12L8.59 7.41L10 6l6 6l-6 6l-1.41-1.41z" />
                                  </svg>
                                  {section.title}
                                </span>
                                {section.itemNav?.length && (
                                  <span className="text-sm text-gray-500 dark:text-gray-400">
                                    × {section.itemNav.length}
                                  </span>
                                )}
                              </h2>
                              <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 transition-all duration-200 ease-in-out ${(expandedSections[uniqueId] ?? true) ? 'opacity-100 max-h-[2000px]' : 'opacity-0 max-h-0 overflow-hidden'}`}>
                                {section.itemNav?.length > 0 && section.itemNav.map(item => (
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
                          );
                        })}
                      </div>
                    ))}
                  </div>
                ))
              )}
            </Suspense>
          </div>
        </main>
      </div>
    </GradientBackground>
  )
} 