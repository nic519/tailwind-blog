interface NavItem {
  title: string
  nav?: NavItem[]      // 用于嵌套导航组
  itemNav?: NavLink[]  // 用于最终的链接列表
  createdAt: string
}

interface NavLink {
  name: string
  desc: string
  url: string 
  createdAt: string 
  icon?: string
}

export type NavData = NavItem[] 