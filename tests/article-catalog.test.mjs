import assert from 'node:assert/strict'
import test from 'node:test'

import { createArticleCatalog } from '../lib/articles/catalog.mjs'

test('the published article catalog excludes drafts and sorts without mutating its source', () => {
  const source = [
    { slug: 'older', path: 'blog/older', date: '2024-01-01', tags: ['Notes'] },
    {
      slug: 'draft',
      path: 'blog/draft',
      date: '2026-01-01',
      tags: ['Notes'],
      draft: true,
    },
    { slug: 'newer', path: 'blog/newer', date: '2025-01-01', tags: ['Notes'] },
  ]

  const catalog = createArticleCatalog(source)

  assert.deepEqual(
    catalog.all().map(({ slug }) => slug),
    ['newer', 'older']
  )
  assert.deepEqual(
    source.map(({ slug }) => slug),
    ['older', 'draft', 'newer']
  )
})

test('the published article catalog owns pagination and public page parameters', () => {
  const source = Array.from({ length: 5 }, (_, index) => ({
    slug: `post-${index + 1}`,
    path: `blog/post-${index + 1}`,
    date: `2025-01-0${index + 1}`,
    tags: [],
  }))

  const catalog = createArticleCatalog(source, { pageSize: 2 })

  assert.deepEqual(
    catalog.page(2).items.map(({ slug }) => slug),
    ['post-3', 'post-2']
  )
  assert.deepEqual(catalog.page(2).pagination, {
    currentPage: 2,
    totalPages: 3,
  })
  assert.deepEqual(catalog.pageParams(), [{ page: '1' }, { page: '2' }, { page: '3' }])
  assert.deepEqual(createArticleCatalog([]).pageParams(), [{ page: '1' }])
})

test('the published article catalog normalizes tags once for counts and filtered views', () => {
  const source = [
    {
      slug: 'newer',
      path: 'blog/newer',
      date: '2025-01-02',
      tags: ['AI Practice', 'Notes'],
    },
    {
      slug: 'older',
      path: 'blog/older',
      date: '2025-01-01',
      tags: ['AI Practice'],
    },
    {
      slug: 'draft',
      path: 'blog/draft',
      date: '2025-01-03',
      tags: ['AI Practice'],
      draft: true,
    },
  ]

  const catalog = createArticleCatalog(source)

  assert.deepEqual(catalog.tagCounts(), { 'ai-practice': 2, notes: 1 })
  assert.deepEqual(
    catalog.tagged('ai-practice').map(({ slug }) => slug),
    ['newer', 'older']
  )
})

test('the published article catalog owns lookup, neighbors, and route parameters', () => {
  const source = [
    {
      slug: 'newer/nested',
      path: 'blog/newer/nested',
      date: '2025-01-03',
      tags: [],
    },
    { slug: 'current', path: 'blog/current', date: '2025-01-02', tags: [] },
    { slug: 'older', path: 'blog/older', date: '2025-01-01', tags: [] },
  ]

  const catalog = createArticleCatalog(source)

  assert.equal(catalog.find('current')?.path, 'blog/current')
  assert.deepEqual(catalog.neighbors('current'), {
    previous: source[2],
    next: source[0],
  })
  assert.deepEqual(catalog.articleParams(), [
    { slug: ['newer', 'nested'] },
    { slug: ['current'] },
    { slug: ['older'] },
  ])
})

test('the published article catalog rejects duplicate public identities', () => {
  const article = { slug: 'same', path: 'blog/same', date: '2025-01-01', tags: [] }

  assert.throws(
    () => createArticleCatalog([article, { ...article, path: 'blog/other' }]),
    /Duplicate article slug: same/
  )
  assert.throws(
    () => createArticleCatalog([article, { ...article, slug: 'other' }]),
    /Duplicate article path: blog\/same/
  )
})
