import { allAuthors, allBlogs } from 'contentlayer/generated'
import siteMetadata from '@/data/siteMetadata'
import { createArticleCatalog } from './catalog.mjs'
import { createArticleDelivery } from './delivery.mjs'

export const POSTS_PER_PAGE = 20

export const articleCatalog = createArticleCatalog(allBlogs, {
  pageSize: POSTS_PER_PAGE,
})

export const articleDelivery = createArticleDelivery({
  catalog: articleCatalog,
  authors: allAuthors,
  site: siteMetadata,
})
