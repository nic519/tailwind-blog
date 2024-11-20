'use client'
import { ReactNode, useState } from 'react'
import { CoreContent } from 'pliny/utils/contentlayer'
import type { Blog, Authors } from 'contentlayer/generated'
import Comments from '@/components/Comments'
import Link from '@/components/Link'
import PageTitle from '@/components/post/PageTitle'
import SectionContainer from '@/components/SectionContainer'
import Tag from '@/components/post/Tag'
import siteMetadata from '@/data/siteMetadata'
import TableOfContents from '@/components/post/TableOfContents'
import Image from 'next/image'
import 'css/post.css'
import MobileTOC from '@/components/post/MobileTOC'
import GradientBackground from '@/components/GradientBackground'
import { ShowIcon } from '@/components/post/ShowIcon'

const editUrl = (path) => `${siteMetadata.siteRepo}/blob/main/data/${path}`
const discussUrl = (path) =>
  `https://mobile.twitter.com/search?q=${encodeURIComponent(`${siteMetadata.siteUrl}/${path}`)}`

const postDateTemplate: Intl.DateTimeFormatOptions = {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
}

interface LayoutProps {
  content: CoreContent<Blog>
  authorDetails: CoreContent<Authors>[]
  next?: { path: string; title: string }
  prev?: { path: string; title: string }
  children: ReactNode
}

export default function PostLayout({
  content,
  authorDetails,
  next,
  prev,
  children,
}: LayoutProps) { 
  const { filePath, path, slug, date, title, tags, toc, icon } = content
  // console.log('toc=', toc)

  return (
    <GradientBackground enableGrid={true} className="min-h-screen">

      <SectionContainer>
        <article>
          <div className="xl:space-y-0">
            {/* 文章头部 */}
            <header className="pt-6">
              <div className="space-y-10">

                <div className="relative flex items-center gap-4">
                  {/* 桌面端图标 */}
                  {icon && (
                    <div className="hidden md:block w-[160px] aspect-square mr-4 flex-shrink-0">
                      <div className={`
                        group 
                        w-full h-full 
                        relative flex items-center justify-center 
                        rounded-xl
                        shadow-sm 
                        p-4 
                        border border-gray-200/80 dark:border-gray-800/50
                        dark:shadow-gray-900/20
                        bg-gray-50/80 dark:bg-gray-800/30
                        backdrop-blur-[2px]
                      `}>
                        <ShowIcon iconName={icon} color='text-gray-800/85 dark:text-gray-100/90' />
                      </div>
                    </div>
                  )}
                  <div className="article-title-wrapper">
                    
                    <PageTitle>{title}</PageTitle>
                    
                    <div className="flex flex-wrap items-center gap-3 pt-4">
                      {tags && tags.map((tag) => <Tag text={tag} key={tag} />)}
                      
                      <time
                        dateTime={date}
                        className="text-base font-medium text-gray-500 dark:text-gray-400"
                      >
                        {new Date(date).toLocaleDateString(siteMetadata.locale, postDateTemplate)}
                      </time>
                    </div>
                  </div>
                </div>
              </div>
            </header>

            {/* 文章主体 */}
            <div className="pb-8 pt-0 lg:grid lg:grid-cols-12 lg:gap-x-8">
              {/* 文章内容区 */}
              <div className="lg:col-span-9">
                <div id="article-content"
                  className="prose max-w-none pb-8 pt-0 
                dark:prose-invert prose-h2:relative prose-h2:pb-3 
                prose-blockquote:border-primary-500
                prose-strong:text-primary-500
                prose-li:marker:text-primary-500
                prose-img:rounded-lg
                w-full"
                >
                  {/* 移动端图标 */}
                  {icon && (
                      <div className="md:hidden w-full  mx-auto my-6">
                        <div className={`
                          group 
                          w-full h-full 
                          relative flex items-center justify-center 
                          rounded-xl
                          shadow-sm 
                          p-4 
                          border border-gray-200/80 dark:border-gray-800/50
                          dark:shadow-gray-900/20
                          bg-gray-50/80 dark:bg-gray-800/30
                          backdrop-blur-[2px]
                        `}>
                        <ShowIcon iconName={icon} color='text-gray-800/85 dark:text-gray-100/90' />
                      </div>
                    </div>
                  )}
                  {children}
                </div>

                {/* 文章导航和评论区 */}
                <div className="border-t border-gray-200/50 dark:border-gray-800/50">
                  {/* 社交链接 */}
                  <div className="py-6 text-sm text-gray-700 dark:text-gray-300">
                    <Link href={discussUrl(path)} rel="nofollow" className="hover:text-primary-500">
                      Discuss on Twitter
                    </Link>
                    {` • `}
                    <Link href={editUrl(filePath)} className="hover:text-primary-500">
                      View on GitHub
                    </Link>
                  </div>

                  {/* 上一篇/下一篇导航 */}
                  {(next || prev) && (
                    <div className="flex justify-between py-4 xl:block xl:space-y-8 xl:py-8">
                      {prev && prev.path && (
                        <div>
                          <h2 className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                            Previous Article
                          </h2>
                          <div className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400">
                            <Link href={`/${prev.path}`}>{prev.title}</Link>
                          </div>
                        </div>
                      )}
                      {next && next.path && (
                        <div>
                          <h2 className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                            Next Article
                          </h2>
                          <div className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400">
                            <Link href={`/${next.path}`}>{next.title}</Link>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* 评论区 */}
                  {siteMetadata.comments && (
                    <div className="border-t border-gray-200/50 dark:border-gray-800/50 py-8" id="comment">
                      <Comments slug={slug} />
                    </div>
                  )}
                </div>
              </div>

              {/* 侧边栏 */}
              <aside className="hidden lg:block lg:col-span-3">

                {/* 作者信息 */}
                <dl className="pb-8 xl:pt-0">
                  <dt className="sr-only">Authors</dt>
                  <dd>
                    <ul className="flex flex-wrap justify-center gap-4 sm:space-x-12 xl:block xl:space-x-0 xl:space-y-8">
                      {authorDetails.map((author) => (
                        <li className="flex items-center space-x-2" key={author.name}>
                          {author.avatar && (
                            <Image
                              src={author.avatar}
                              width={38}
                              height={38}
                              alt="avatar"
                              className="h-10 w-10 rounded-full"
                            />
                          )}
                          <dl className="whitespace-nowrap text-sm font-medium leading-5">
                            <dt className="sr-only">Name</dt>
                            <dd className="text-gray-900 dark:text-gray-100">
                              {author.name}
                            </dd>
                            <dt className="sr-only">Twitter</dt>
                            <dd>
                              {author.twitter && (
                                <Link
                                  href={author.twitter}
                                  className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
                                >
                                  {author.twitter.replace('https://twitter.com/', '@')
                                    .replace('https://x.com/', '@')}
                                </Link>
                              )}
                            </dd>
                          </dl>
                        </li>
                      ))}
                    </ul>
                  </dd>
                </dl>

                {/* 桌面端 TOC */}
                <div className="lg:sticky lg:top-10 rounded-xl backdrop-blur-md
                 bg-white/70 dark:bg-gray-950/20 py-4 px-6 shadow-lg ring-1 ring-black/5 dark:ring-white/5">
                  <TableOfContents source={toc} />
                </div>
              </aside>

              {/* 移动端 TOC */}
              <MobileTOC
                source={toc}
                buttonPosition={{ bottom: '6rem', right: '1rem' }}
                panelPosition={{ bottom: '10rem', right: '1rem' }}
                maxHeight="70vh"
                width="20rem"
              />
            </div>
          </div>
        </article>
      </SectionContainer>
    </GradientBackground>
  )
}
