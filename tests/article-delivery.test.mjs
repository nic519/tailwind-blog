import assert from 'node:assert/strict'
import test from 'node:test'

import { createArticleCatalog } from '../lib/articles/catalog.mjs'
import { createArticleDelivery } from '../lib/articles/delivery.mjs'

test('article delivery prepares metadata, authors, neighbors, and structured data without mutation', () => {
  const articles = [
    {
      slug: 'newer',
      path: 'blog/newer',
      date: '2025-01-03',
      title: 'Newer',
      tags: [],
      body: { code: '' },
      structuredData: { '@type': 'BlogPosting' },
    },
    {
      slug: 'current',
      path: 'blog/current',
      date: '2025-01-02',
      title: 'Current',
      summary: 'Summary',
      tags: [],
      authors: ['nicholas'],
      images: ['/cover.jpg'],
      body: { code: '' },
      structuredData: { '@type': 'BlogPosting' },
    },
    {
      slug: 'older',
      path: 'blog/older',
      date: '2025-01-01',
      title: 'Older',
      tags: [],
      body: { code: '' },
      structuredData: { '@type': 'BlogPosting' },
    },
  ]
  const authors = [{ slug: 'nicholas', name: 'Nicholas', body: { code: '' } }]
  const delivery = createArticleDelivery({
    catalog: createArticleCatalog(articles),
    authors,
    site: {
      author: 'Fallback',
      siteUrl: 'https://example.test',
      title: 'Example',
      socialBanner: '/social.jpg',
    },
  })

  const prepared = delivery.prepare('current')

  assert.equal(prepared.metadata.title, 'Current')
  assert.deepEqual(prepared.metadata.openGraph.authors, ['Nicholas'])
  assert.deepEqual(prepared.previous, articles[2])
  assert.deepEqual(prepared.next, articles[0])
  assert.deepEqual(prepared.structuredData.author, [{ '@type': 'Person', name: 'Nicholas' }])
  assert.equal(articles[1].structuredData.author, undefined)
})
