import assert from 'node:assert/strict'
import test from 'node:test'

import { allBlogs } from '../.contentlayer/generated/index.mjs'
import { getBlogPath, getBlogSlug } from '../lib/contentRouting.mjs'

test('maps abbrlink to the public blog route when present', () => {
  const source = {
    abbrlink: 'engineer-with-ai-in-2026',
    sourceFileName: '中文文件名.md',
  }

  assert.equal(getBlogSlug(source), 'engineer-with-ai-in-2026')
  assert.equal(getBlogPath(source), 'blog/engineer-with-ai-in-2026')
})

test('maps the source filename to the public blog route when abbrlink is absent', () => {
  const source = { sourceFileName: '中文文件名.mdx' }

  assert.equal(getBlogSlug(source), '中文文件名')
  assert.equal(getBlogPath(source), 'blog/中文文件名')
})

test('maps only the source filename when the post is in a nested directory', () => {
  const source = {
    sourceFileName: '中文文件名.md',
    sourceFilePath: 'blog/category/中文文件名.md',
  }

  assert.equal(getBlogSlug(source), '中文文件名')
})

test('publishes the mapped route through Contentlayer', () => {
  const post = allBlogs.find(({ title }) => title === '什么样的人可以称为伟人？')

  assert.ok(post)
  assert.equal(post.slug, 'great-man')
  assert.equal(post.path, 'blog/great-man')
  assert.match(post.structuredData.url, /\/blog\/great-man$/)
})
