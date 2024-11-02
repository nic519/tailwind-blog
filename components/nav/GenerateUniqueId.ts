import { slug as slugify } from 'github-slugger'

export const generateUniqueId = (category: string, title: string, createdAt: string) => {
  return `nav-${slugify(category+'-'+title)}`
}
