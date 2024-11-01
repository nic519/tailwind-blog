import { type NavData } from '@/types/nav'
import NavLayout from '@/layouts/NavLayout'
import navData from '@/data/nav/db.json'

// 使用相同的 generateUniqueId 函数
const generateUniqueId = (category: string, title: string) => {
  return `nav-${category.toLowerCase().replace(/\s+/g, '-')}-${title.toLowerCase().replace(/\s+/g, '-')}`
}

export default function Nav() {
  return (
    <>
      <NavLayout navItems={navData as NavData} />
    </>
  )
} 