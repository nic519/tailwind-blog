import 'css/prism.css'
import 'katex/dist/katex.css'

import ReadingGate from '@/components/ReadingGate'
import { components } from '@/components/MDXComponents'
import { articleCatalog, articleDelivery } from '@/lib/articles/siteCatalog'
import PostLayout from '@/layouts/PostLayout'
import { MDXLayoutRenderer } from 'pliny/mdx-components'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'

export async function generateMetadata({
  params,
}: {
  params: { slug: string[] }
}): Promise<Metadata | undefined> {
  const slug = decodeURI(params.slug.join('/'))
  return articleDelivery.prepare(slug)?.metadata
}

export const generateStaticParams = async () => articleCatalog.articleParams()

export default async function Page({ params }: { params: { slug: string[] } }) {
  const slug = decodeURI(params.slug.join('/'))
  const prepared = articleDelivery.prepare(slug)

  if (!prepared) return notFound()

  const { post, content, authorDetails, previous, next, structuredData } = prepared
  const postContent = (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <PostLayout content={content} authorDetails={authorDetails} next={next} prev={previous}>
        <MDXLayoutRenderer code={post.body.code} components={components} toc={post.toc} />
      </PostLayout>
    </>
  )

  if (post.password) {
    return <ReadingGate password={post.password}>{postContent}</ReadingGate>
  }

  return postContent
}
