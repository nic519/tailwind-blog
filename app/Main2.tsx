'use client'

import Link from '@/components/Link'
import siteMetadata from '@/data/siteMetadata'
import NewsletterForm from 'pliny/ui/NewsletterForm'
import { useState, useEffect, useCallback } from 'react'
import PostCard from '@/components/post/PostCard'
import GradientBackground from '@/components/GradientBackground'

const MAX_DISPLAY = 50

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
    <GradientBackground>
      <div className="space-y-2 pb-8 pt-6 md:space-y-5">
        <p className="text-lg leading-7 text-gray-500 dark:text-gray-400 bg-transparent">
          {displayText}
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {!posts.length && 'No posts found.'}
        {posts.slice(0, MAX_DISPLAY).map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
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
    </GradientBackground>
  )
}
