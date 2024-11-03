'use client'
import { useState, useEffect } from 'react'
import NavTOC from '@/components/nav/NavTOC'
import NavCard from '@/components/nav/NavCard'
import GradientBackground from '@/components/GradientBackground'
import { generateUniqueId } from '@/components/nav/GenerateUniqueId'
import { type NavData } from '@/components/nav/types/nav'
import { Suspense } from 'react'
import LoadingSection from '@/components/nav/LoadingSection'
import 'css/post.css'
import SearchBar from '@/components/nav/SearchEngineBar'
import MobileNavTOC from '@/components/nav/MobileNavTOC'

export default function NavLayout({ navItems }: { navItems: NavData }) {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (navItems) {
      setIsLoading(false)
    }
  }, [navItems])

  if (!navItems) {
    return (
      <GradientBackground enableGrid={true} className="min-h-screen">
        <div className="space-y-12">
          {[1, 2, 3].map((i) => (
            <LoadingSection key={i} />
          ))}
        </div>
      </GradientBackground>
    )
  }

  return (
    <GradientBackground enableGrid={true} className="min-h-screen">
      <div className="flex">
        <aside className="w-52 backdrop-blur-md bg-white/70 dark:bg-gray-950/20 
        pl-4 pr-1 py-6 space-y-4 rounded-lg shadow-lg 
        ring-1 ring-black/5 dark:ring-white/5 h-screen hidden lg:block sticky top-20">
          <NavTOC navItems={navItems} />
        </aside>

        <main className="flex-1 lg:pl-8">
          <div className="flex justify-end w-full">
            <div className="w-full lg:w-auto">
              <SearchBar />
            </div>
          </div>
          <div className="max-w-7xl mx-auto w-full">

            <Suspense fallback={<LoadingSection />}>
              {isLoading ? (
                <div className="space-y-12">
                  {[1, 2, 3].map((i) => (
                    <LoadingSection key={i} />
                  ))}
                </div>
              ) : (
                navItems.map(category => (
                  <div key={category.title} className="mb-16">
                    <h2 className="text-2xl font-bold mb-8 text-gray-900 dark:text-white gradient-line-after line-sm">
                      {category.title}
                    </h2>
                    {category.nav?.map(section => {
                      const sectionId = generateUniqueId(category.title, section.title)
                      return (
                        <section key={section.title} id={sectionId} className="mb-12">
                          <h3 className="text-xl font-bold mb-6 text-gray-800 dark:text-gray-200 gradient-line-after line-xm">
                            {section.title}
                          </h3>
                          {section.itemNav ? (
                            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                              {section.itemNav.map(item => (
                                <NavCard
                                  key={`${item.name}-${item.url}`}
                                  name={item.name}
                                  desc={item.desc}
                                  url={item.url}
                                  icon={item.icon}
                                />
                              ))}
                            </div>
                          ) : (
                            <div className="space-y-8">
                              {section.nav?.map(subSection => {
                                const subSectionId = generateUniqueId(category.title, section.title, subSection.title)
                                return (
                                  <section key={subSection.title} id={subSectionId} className="mb-8">
                                    <h4 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-300">
                                      {subSection.title}
                                    </h4>
                                    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                      {subSection.itemNav?.map(item => (
                                        <NavCard
                                          key={`${item.name}-${item.url}`}
                                          name={item.name}
                                          desc={item.desc}
                                          url={item.url}
                                          icon={item.icon}
                                        />
                                      ))}
                                    </div>
                                  </section>
                                )
                              })}
                            </div>
                          )}
                        </section>
                      )
                    })}
                  </div>
                ))
              )}
            </Suspense>
          </div>
        </main>

        <div className="lg:hidden">
          <MobileNavTOC 
            navItems={navItems}
            buttonPosition={{ bottom: '6rem', right: '1rem' }}
            panelPosition={{ bottom: '6rem', right: '5rem' }}
            maxHeight="70vh"
            width="14rem"
          />
        </div>
 
      </div>
    </GradientBackground>
  )
} 