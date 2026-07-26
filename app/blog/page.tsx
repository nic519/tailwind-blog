import ListLayout from '@/layouts/ListLayoutWithTags'
import { allCoreContent } from 'pliny/utils/contentlayer'
import { articleCatalog } from '@/lib/articles/siteCatalog'
import { genPageMetadata } from 'app/seo'

export const metadata = genPageMetadata({ title: 'Blog' })

export default function BlogPage() {
  const posts = allCoreContent(articleCatalog.all())
  const page = articleCatalog.page(1)

  return (
    <ListLayout
      posts={posts}
      initialDisplayPosts={allCoreContent(page.items)}
      pagination={page.pagination}
      tagCounts={articleCatalog.tagCounts()}
      title="All Posts"
    />
  )
}
