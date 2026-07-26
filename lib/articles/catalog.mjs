import { slug } from 'github-slugger'

const byNewestDate = (left, right) => Date.parse(right.date) - Date.parse(left.date)

const assertUnique = (articles, field) => {
  const values = new Set()

  for (const article of articles) {
    if (values.has(article[field])) {
      throw new Error(`Duplicate article ${field}: ${article[field]}`)
    }
    values.add(article[field])
  }
}

export function createArticleCatalog(documents, { pageSize = 20 } = {}) {
  const published = documents.filter(({ draft }) => draft !== true).sort(byNewestDate)
  assertUnique(published, 'slug')
  assertUnique(published, 'path')
  const totalPages = Math.ceil(published.length / pageSize)
  const postsByTag = new Map()
  const articlesBySlug = new Map(published.map((article) => [article.slug, article]))

  for (const article of published) {
    for (const tag of article.tags ?? []) {
      const normalizedTag = slug(tag)
      const taggedPosts = postsByTag.get(normalizedTag) ?? []
      taggedPosts.push(article)
      postsByTag.set(normalizedTag, taggedPosts)
    }
  }

  return {
    all() {
      return published.slice()
    },
    page(pageNumber) {
      const start = pageSize * (pageNumber - 1)

      return {
        items: published.slice(start, start + pageSize),
        pagination: {
          currentPage: pageNumber,
          totalPages,
        },
      }
    },
    pageParams() {
      return Array.from({ length: Math.max(totalPages, 1) }, (_, index) => ({
        page: String(index + 1),
      }))
    },
    tagged(tag) {
      return (postsByTag.get(slug(tag)) ?? []).slice()
    },
    tagCounts() {
      return Object.fromEntries(Array.from(postsByTag, ([tag, articles]) => [tag, articles.length]))
    },
    find(articleSlug) {
      return articlesBySlug.get(articleSlug)
    },
    neighbors(articleSlug) {
      const index = published.findIndex(({ slug: candidate }) => candidate === articleSlug)

      if (index === -1) return { previous: undefined, next: undefined }

      return {
        previous: published[index + 1],
        next: published[index - 1],
      }
    },
    articleParams() {
      return published.map(({ slug: articleSlug }) => ({
        slug: articleSlug.split('/'),
      }))
    },
  }
}
