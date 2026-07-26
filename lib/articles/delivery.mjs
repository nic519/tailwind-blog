import { coreContent } from 'pliny/utils/contentlayer.js'

export function createArticleDelivery({ catalog, authors, site }) {
  const authorsBySlug = new Map(authors.map((author) => [author.slug, author]))

  return {
    prepare(slug) {
      const post = catalog.find(slug)
      if (!post) return undefined

      const authorDetails = (post.authors ?? ['default'])
        .map((authorSlug) => authorsBySlug.get(authorSlug))
        .filter(Boolean)
        .map(coreContent)
      const authorNames = authorDetails.map(({ name }) => name)
      const imageList = post.images
        ? typeof post.images === 'string'
          ? [post.images]
          : post.images
        : [site.socialBanner]
      const neighbors = catalog.neighbors(slug)

      return {
        post,
        content: coreContent(post),
        authorDetails,
        previous: neighbors.previous,
        next: neighbors.next,
        structuredData: {
          ...post.structuredData,
          author: authorDetails.map(({ name }) => ({
            '@type': 'Person',
            name,
          })),
        },
        metadata: {
          title: post.title,
          description: post.summary,
          openGraph: {
            title: post.title,
            description: post.summary,
            siteName: site.title,
            locale: 'en_US',
            type: 'article',
            publishedTime: new Date(post.date).toISOString(),
            modifiedTime: new Date(post.lastmod || post.date).toISOString(),
            url: './',
            images: imageList.map((image) => ({
              url: image.includes('http') ? image : site.siteUrl + image,
            })),
            authors: authorNames.length > 0 ? authorNames : [site.author],
          },
          twitter: {
            card: 'summary_large_image',
            title: post.title,
            description: post.summary,
            images: imageList,
          },
        },
      }
    },
  }
}
