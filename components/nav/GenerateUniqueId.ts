export const generateUniqueId = (category: string, title: string) => {
    return `nav-${category.toLowerCase().replace(/\s+/g, '-')}-${title.toLowerCase().replace(/\s+/g, '-')}`
  }