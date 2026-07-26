import ListLayout from '@/layouts/ListLayoutWithTags'
import { allCoreContent } from 'pliny/utils/contentlayer'
import { articleCatalog } from '@/lib/articles/siteCatalog'
import { notFound } from 'next/navigation'

export const generateStaticParams = async () => {
  return articleCatalog.pageParams()
}

export default function Page({ params }: { params: { page: string } }) {
  const pageNumber = Number.parseInt(params.page, 10)
  const page = articleCatalog.page(pageNumber)

  if (
    !Number.isInteger(pageNumber) ||
    pageNumber < 1 ||
    (pageNumber > 1 && page.items.length === 0)
  ) {
    return notFound()
  }

  return (
    <ListLayout
      posts={allCoreContent(articleCatalog.all())}
      initialDisplayPosts={allCoreContent(page.items)}
      pagination={page.pagination}
      tagCounts={articleCatalog.tagCounts()}
      title="All Posts"
    />
  )
}
