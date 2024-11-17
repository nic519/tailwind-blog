import { type NavData } from '@/components/nav/types/nav'
import NavLayout from '@/layouts/NavLayout'
import fs from 'fs'
import path from 'path'

// 使用相同的 generateUniqueId 函数
const generateUniqueId = (category: string, title: string) => {
  return `nav-${category.toLowerCase().replace(/\s+/g, '-')}-${title.toLowerCase().replace(/\s+/g, '-')}`
}

// 读取并合并所有导航数据
async function getAllNavData(): Promise<NavData> {
  const navDir = path.join(process.cwd(), 'data/nav')
  const files = fs.readdirSync(navDir).filter(file => file.endsWith('.json'))
  
  const navData: NavData = []
  
  for (const file of files) {
    const filePath = path.join(navDir, file)
    const fileContent = fs.readFileSync(filePath, 'utf-8')
    const categoryData = JSON.parse(fileContent)
    navData.push(categoryData)
  }
  
  return navData
}

export default async function Nav() {
  const navData = await getAllNavData()
  
  return (
    <>
      <NavLayout navItems={navData} />
    </>
  )
} 