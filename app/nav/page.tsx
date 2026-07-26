import { type NavData } from '@/components/nav/types/nav'
import NavLayout from '@/layouts/NavLayout'
import path from 'path'
import { loadNavigationCatalog } from '@/lib/navigation/catalog.mjs'

export default async function Nav() {
  const navData: NavData = loadNavigationCatalog(path.join(process.cwd(), 'data/nav'))

  return (
    <>
      <NavLayout navItems={navData} />
    </>
  )
}
