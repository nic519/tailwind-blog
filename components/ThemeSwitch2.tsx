'use client'

import { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'

const Sun = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    className="h-4 w-4 text-yellow-500"
  >
    <path
      fillRule="evenodd"
      d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
      clipRule="evenodd"
    />
  </svg>
)

const Moon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    className="h-4 w-4 text-indigo-200"
  >
    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
  </svg>
)

const ThemeSwitch2 = () => {
  const [mounted, setMounted] = useState(false)
  const { resolvedTheme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
    if (!localStorage.getItem('theme')) {
      setTheme('dark')
    }
  }, [])

  const toggleTheme = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
  }

  if (!mounted) {
    return (
      <button
        aria-label="切换深色模式"
        type="button"
        className="relative inline-flex h-5 w-9 items-center rounded-full bg-gray-200 transition-colors"
      >
        <span className="sr-only">切换主题</span>
        <span className="inline-flex h-6 w-6 transform items-center justify-center rounded-full bg-white shadow-md" />
      </button>
    )
  }

  return (
    <button
      aria-label="切换深色模式"
      type="button"
      onClick={toggleTheme}
      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
        resolvedTheme === 'dark' ? 'bg-indigo-400' : 'bg-yellow-200'
      }`}
      data-dia="light-switch"
    >
      <span className="sr-only">切换主题</span>
      <span
        className={`inline-flex h-6 w-6 transform items-center justify-center rounded-full bg-white shadow-md transition-transform ${
          resolvedTheme === 'dark' ? 'translate-x-4' : '-translate-x-1'
        }`}
      >
        {mounted && (resolvedTheme === 'dark' ? <Moon /> : <Sun />)}
      </span>
    </button>
  )
}

export default ThemeSwitch2
