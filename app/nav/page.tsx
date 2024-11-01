import { type NavData } from '@/types/nav'
import NavLayout from '@/layouts/NavLayout'
import navData from '@/data/nav/db.json'

export default function Nav() {
  return (
    <>
      <NavLayout navItems={navData as NavData} />
    </>
  )
} 