import Link from '@/components/Link'
import Tag from '@/components/post/Tag'
import siteMetadata from '@/data/siteMetadata'
import { formatDate } from 'pliny/utils/formatDate'
import Image from 'next/image'

const DEFAULT_COVER = '/static/images/default-cover.jpg'

export type Post = {
  slug: string
  date: string
  title: string
  summary: string
  tags: string[]
  cover?: string
}

export default function PostCard({ post }: { post: Post }) {
  const { slug, date, title, summary, tags, cover } = post

  return (
    <article className="group relative overflow-hidden rounded-3xl shadow-lg hover:shadow-xl 
      transition-all duration-300 
      backdrop-blur-md bg-white/80 dark:bg-gray-700/20 
      border border-white/20 dark:border-gray-700/20
      hover:bg-white/90 dark:hover:bg-gray-600/20">
      <Link href={`/blog/${slug}`} className="block">
        <div className="overflow-hidden relative h-64 w-full ">
          <Image
            src={cover || DEFAULT_COVER}
            alt={title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-white/90 dark:from-gray-800/90 from-0% via-transparent via-60%"></div>
        </div>

        <div className="relative p-6 -mt-16 z-1">
          <div className="flex flex-wrap gap-2 mb-3">
            {tags.map((tag) => (
              <Tag key={tag} text={tag} />
            ))}
          </div>

          <h2 className="text-xl font-bold pt-4 mb-3 text-gray-900 dark:text-gray-100 line-clamp-2">
            {title}
          </h2>

          <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">
            {summary}
          </p>

          <div className="flex justify-between items-center text-sm">
            <time className="text-primary-500 dark:text-primary-400">
              {formatDate(date, siteMetadata.locale)}
            </time>
          </div>
        </div>
      </Link>
    </article>
  )
} 