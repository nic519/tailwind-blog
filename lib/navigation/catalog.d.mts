export interface NavigationLink {
  name: string
  desc?: string
  url: string
  createdAt?: string
  icon?: string
}

export interface NavigationItem {
  id: string
  title: string
  nav?: NavigationItem[]
  itemNav?: NavigationLink[]
  createdAt?: string
}

export function loadNavigationCatalog(directory: string): NavigationItem[]
