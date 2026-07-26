export interface ArticleRecord {
  slug: string
  path: string
  date: string
  tags?: string[]
  draft?: boolean
}

export interface ArticlePage<T> {
  items: T[]
  pagination: {
    currentPage: number
    totalPages: number
  }
}

export interface ArticleCatalog<T extends ArticleRecord> {
  all(): T[]
  page(pageNumber: number): ArticlePage<T>
  pageParams(): Array<{ page: string }>
  tagged(tag: string): T[]
  tagCounts(): Record<string, number>
  find(slug: string): T | undefined
  neighbors(slug: string): { previous?: T; next?: T }
  articleParams(): Array<{ slug: string[] }>
}

export function createArticleCatalog<T extends ArticleRecord>(
  documents: T[],
  options?: { pageSize?: number }
): ArticleCatalog<T>
