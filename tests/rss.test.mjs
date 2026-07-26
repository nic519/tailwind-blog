import assert from 'node:assert/strict'
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import test from 'node:test'

import { createArticleCatalog } from '../lib/articles/catalog.mjs'
import { generateRSS } from '../scripts/rss.mjs'

test('RSS generation removes tag feeds that are no longer published', (t) => {
  const output = mkdtempSync(join(tmpdir(), 'rss-output-'))
  const staleDirectory = join(output, 'tags', 'draft-only')
  mkdirSync(staleDirectory, { recursive: true })
  writeFileSync(join(staleDirectory, 'feed.xml'), '<rss>draft content</rss>')
  t.after(() => rmSync(output, { recursive: true }))

  const catalog = createArticleCatalog([
    {
      slug: 'published',
      path: 'blog/published',
      date: '2025-01-01',
      title: 'Published',
      summary: 'Public article',
      tags: ['Current'],
    },
  ])

  generateRSS(
    {
      author: 'Nicholas',
      description: 'Example feed',
      email: 'nicholas@example.test',
      language: 'zh-CN',
      siteUrl: 'https://example.test',
      title: 'Example',
    },
    catalog,
    output
  )

  assert.equal(existsSync(join(staleDirectory, 'feed.xml')), false)
  assert.match(readFileSync(join(output, 'tags', 'current', 'feed.xml'), 'utf8'), /Published/)
})
