import { existsSync, mkdirSync, readdirSync, rmSync, writeFileSync } from 'fs'
import path from 'path'
import { escape } from 'pliny/utils/htmlEscaper.js'
import siteMetadata from '../data/siteMetadata.js'
import { allBlogs } from '../.contentlayer/generated/index.mjs'
import { createArticleCatalog } from '../lib/articles/catalog.mjs'

const outputFolder = process.env.EXPORT ? 'out' : 'public'

const generateRssItem = (config, post) => `
  <item>
    <guid>${config.siteUrl}/${post.path}</guid>
    <title>${escape(post.title)}</title>
    <link>${config.siteUrl}/${post.path}</link>
    ${post.summary && `<description>${escape(post.summary)}</description>`}
    <pubDate>${new Date(post.date).toUTCString()}</pubDate>
    <author>${config.email} (${config.author})</author>
    ${post.tags && post.tags.map((t) => `<category>${t}</category>`).join('')}
  </item>
`

const generateRss = (config, posts, page = 'feed.xml') => `
  <rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
    <channel>
      <title>${escape(config.title)}</title>
      <link>${config.siteUrl}/blog</link>
      <description>${escape(config.description)}</description>
      <language>${config.language}</language>
      <managingEditor>${config.email} (${config.author})</managingEditor>
      <webMaster>${config.email} (${config.author})</webMaster>
      <lastBuildDate>${new Date(posts[0].date).toUTCString()}</lastBuildDate>
      <atom:link href="${config.siteUrl}/${page}" rel="self" type="application/rss+xml"/>
      ${posts.map((post) => generateRssItem(config, post)).join('')}
    </channel>
  </rss>
`

const removeStaleTagFeeds = (folder, currentTags, page) => {
  const tagsFolder = path.join(folder, 'tags')
  if (!existsSync(tagsFolder)) return

  for (const entry of readdirSync(tagsFolder, { withFileTypes: true })) {
    if (!entry.isDirectory() || currentTags.has(entry.name)) continue

    const staleFeed = path.join(tagsFolder, entry.name, page)
    if (existsSync(staleFeed)) rmSync(staleFeed)
  }
}

export function generateRSS(config, catalog, folder = outputFolder, page = 'feed.xml') {
  const publishPosts = catalog.all()
  const tags = Object.keys(catalog.tagCounts())
  removeStaleTagFeeds(folder, new Set(tags), page)

  // RSS for blog post
  if (publishPosts.length > 0) {
    const rss = generateRss(config, publishPosts)
    writeFileSync(path.join(folder, page), rss)
  }

  if (publishPosts.length > 0) {
    for (const tag of tags) {
      const filteredPosts = catalog.tagged(tag)
      const rss = generateRss(config, filteredPosts, `tags/${tag}/${page}`)
      const rssPath = path.join(folder, 'tags', tag)
      mkdirSync(rssPath, { recursive: true })
      writeFileSync(path.join(rssPath, page), rss)
    }
  }
}

const rss = () => {
  generateRSS(siteMetadata, createArticleCatalog(allBlogs))
  console.log('RSS feed generated...')
}
export default rss
