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

interface NavGroup {
  title: string
  nav: (NavGroup | NavLink)[]
}

export type NavData = NavGroup[] 