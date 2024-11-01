interface NavLink {
  name: string
  desc: string
  url: string
  icon: string
  urls?: Record<string, string>
  rate?: number
  createdAt?: string
  top?: boolean
  breadcrumb?: string[]
  ownVisible?: boolean
  id: number
}

interface NavSubGroup {
  title: string
  itemNav: NavLink[]
  createdAt?: string
}

interface NavGroup {
  title: string
  nav: NavSubGroup[]
  createdAt?: string
}

export type NavData = {
  title: string
  nav: NavGroup[]
  createdAt?: string
}[] 