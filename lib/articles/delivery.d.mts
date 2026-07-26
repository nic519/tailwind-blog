import type { Metadata } from 'next'
import type { CoreContent, MDXDocument } from 'pliny/utils/contentlayer.js'
import type { ArticleCatalog, ArticleRecord } from './catalog.mjs'

export interface DeliverableArticle extends ArticleRecord, MDXDocument {
  title: string
  summary?: string
  authors?: string[]
  images?: string | string[]
  lastmod?: string
  structuredData: Record<string, unknown>
}

export interface ArticleAuthor extends MDXDocument {
  slug: string
  name: string
}

export interface ArticleDeliverySite {
  author: string
  siteUrl: string
  title: string
  socialBanner: string
}

export interface PreparedArticle<TArticle, TAuthor> {
  post: TArticle
  content: CoreContent<TArticle & MDXDocument>
  authorDetails: Array<CoreContent<TAuthor & MDXDocument>>
  previous?: TArticle
  next?: TArticle
  structuredData: Record<string, unknown>
  metadata: Metadata
}

export interface ArticleDelivery<TArticle, TAuthor> {
  prepare(slug: string): PreparedArticle<TArticle, TAuthor> | undefined
}

export function createArticleDelivery<
  TArticle extends DeliverableArticle,
  TAuthor extends ArticleAuthor,
>(options: {
  catalog: ArticleCatalog<TArticle>
  authors: TAuthor[]
  site: ArticleDeliverySite
}): ArticleDelivery<TArticle, TAuthor>
