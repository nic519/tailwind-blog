'use client'

import { createReadingGate } from '@/lib/readingGate.mjs'
import { FormEvent, ReactNode, useEffect, useMemo, useState } from 'react'

interface ReadingGateProps {
  password: string
  children: ReactNode
}

export default function ReadingGate({ password, children }: ReadingGateProps) {
  const gate = useMemo(() => createReadingGate(password), [password])
  const [attempt, setAttempt] = useState('')
  const [error, setError] = useState('')
  const [isUnlocked, setIsUnlocked] = useState(false)

  useEffect(() => {
    const result = gate.readUrl(window.location.href)
    if (!result.unlocked) return

    setIsUnlocked(true)
    if (result.cleanUrl) {
      window.history.replaceState(window.history.state, '', result.cleanUrl)
    }
  }, [gate])

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const result = gate.attempt(attempt)
    setError(result.error ?? '')
    setIsUnlocked(result.unlocked)
  }

  if (isUnlocked) return <>{children}</>

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="w-full max-w-md space-y-6 rounded-2xl bg-white/80 p-8 shadow-lg backdrop-blur-md dark:bg-gray-800/80 dark:shadow-gray-900/20">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900/30">
            <svg
              className="h-8 w-8 text-primary-600 dark:text-primary-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            此文章设置了阅读遮罩
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">请输入密码继续阅读</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="reading-gate-password"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              密码
            </label>
            <input
              id="reading-gate-password"
              type="password"
              value={attempt}
              onChange={(event) => {
                setAttempt(event.target.value)
                setError('')
              }}
              className="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:focus:border-primary-400 dark:focus:ring-primary-400"
              placeholder="请输入密码"
              autoComplete="off"
            />
          </div>

          {error && (
            <div
              role="alert"
              className="rounded-lg bg-red-50 p-3 text-sm text-red-800 dark:bg-red-900/20 dark:text-red-400"
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full rounded-lg bg-primary-600 px-4 py-2 font-medium text-white transition-colors hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:bg-primary-500 dark:hover:bg-primary-600"
          >
            继续阅读
          </button>
        </form>

        <p className="text-center text-xs text-gray-500 dark:text-gray-400">
          阅读遮罩用于避免无意访问，不会加密浏览器收到的正文。
        </p>
      </div>
    </div>
  )
}
