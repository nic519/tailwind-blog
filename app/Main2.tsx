"use client"

import Link from '@/components/Link'
import Tag from '@/components/Tag'
import siteMetadata from '@/data/siteMetadata'
import { formatDate } from 'pliny/utils/formatDate'
import NewsletterForm from 'pliny/ui/NewsletterForm'
import Image from 'next/image'
import { useState, useEffect } from 'react'

const MAX_DISPLAY = 50
const DEFAULT_COVER = '/static/images/default-cover.jpg' // 添加默认封面图片路径

export default function Home2({ posts }) {
  const [displayText, setDisplayText] = useState('')
  const fullText = siteMetadata.description
  
  useEffect(() => {
    let index = 0
    const timer = setInterval(() => {
      if (index < fullText.length) {
        setDisplayText(fullText.slice(0, index + 1)) // 修改这一行
        index++
      } else {
        clearInterval(timer)
      }
    }, 50)

    return () => clearInterval(timer)
  }, [])

  return (
    <>
      <div >
        <div className="space-y-2 pb-8 pt-6 md:space-y-5">
          {/* <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
            Latestq
          </h1> */}
          <p className="text-lg leading-7 text-gray-500 dark:text-gray-400">
            {displayText}
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {!posts.length && 'No posts found.'}
          {posts.slice(0, MAX_DISPLAY).map((post) => {
            const { slug, date, title, summary, tags, cover } = post
            
            return (
              <article key={slug} className="group relative overflow-hidden rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 bg-white dark:bg-gray-800">
                <Link href={`/blog/${slug}`} className="block">
                  {/* 图片容器 */}
                  <div className="overflow-hidden relative h-64 w-full">
                    <Image
                      src={cover || DEFAULT_COVER}
                      alt={title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-white/90 dark:from-gray-800/90 from-0% via-transparent via-60%"></div>
                  </div>
                  
                  {/* 内容区域 */}
                  <div className="relative p-6 -mt-16 z-10"> 
                    <div className="flex flex-wrap gap-2 mb-3">
                      {tags.map((tag) => (
                        <Tag key={tag} text={tag} />
                      ))}
                    </div>
                    
                    <h2 className="text-xl font-bold pt-2 mb-3 text-gray-900 dark:text-gray-100 line-clamp-2">
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
          })}
        </div>
      </div>
      {posts.length > MAX_DISPLAY && (
        <div className="flex justify-end text-base font-medium leading-6">
          <Link
            href="/blog"
            className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
            aria-label="All posts"
          >
            All Posts &rarr;
          </Link>
        </div>
      )}
      {siteMetadata.newsletter?.provider && (
        <div className="flex items-center justify-center pt-4">
          <NewsletterForm />
        </div>
      )}
    </>
  )
}
