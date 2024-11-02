interface NavLink {
  name: string
  desc: string
  url: string 
  createdAt?: string 
  icon?: string
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