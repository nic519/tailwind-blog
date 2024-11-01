import Link from 'next/link'
import { type NavData, type NavLink, type NavGroup } from '@/types/nav'
import NavCard from '@/components/NavCard'
import GradientBackground from '@/components/GradientBackground'

function isNavLink(item: NavGroup | NavLink): item is NavLink {
  return 'url' in item
}

export default function NavLayout({ navItems }: { navItems: NavData }) {
  return (
    <GradientBackground enableGrid={true} className="min-h-screen">
      <div className="flex">
        {/* 左侧导航 */}
        <aside className="w-64 backdrop-blur-md bg-white/70 dark:bg-gray-950/20 p-6 space-y-4 
          shadow-lg ring-1 ring-black/5 dark:ring-white/5 min-h-screen sticky top-0">
          <div className="mb-8">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">发现导航</h1>
          </div>
          
          {navItems.map(category => (
            <div key={category.title} className="space-y-2">
              <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400 px-3">
                {category.title}
              </h2>
              {category.nav[0].nav.map(section => (
                <a
                  key={section.title}
                  href={`#${section.title}`}
                  className="flex items-center text-gray-700 dark:text-gray-300 
                    hover:bg-gray-100 dark:hover:bg-gray-800/50 
                    px-3 py-2 rounded-lg transition-colors"
                >
                  <span>{section.title}</span>
                  {section.nav?.length && (
                    <span className="ml-auto text-xs text-gray-400 dark:text-gray-500">
                      × {section.nav.length}
                    </span>
                  )}
                </a>
              ))}
            </div>
          ))}
        </aside>

        {/* 右侧内容区 */}
        <main className="flex-1 p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {navItems.map(category => (
              category.nav[0].nav.map(section => (
                <section key={section.title} id={section.title} className="mb-12">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                    {section.title}
                    {section.nav?.length && (
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        × {section.nav.length}
                      </span>
                    )}
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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