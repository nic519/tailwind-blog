'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import PasswordProtection from './PasswordProtection'

interface ProtectedPostProps {
  password: string
  children: React.ReactNode
}

export default function ProtectedPost({
  password,
  children,
}: ProtectedPostProps) {
  const [isUnlocked, setIsUnlocked] = useState(false)
  const searchParams = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    // 检查 URL 参数中的密码
    const urlPassword = searchParams.get('password')
    if (urlPassword === password) {
      setIsUnlocked(true)
      // 移除 URL 参数
      const newSearchParams = new URLSearchParams(searchParams.toString())
      newSearchParams.delete('password')
      const newUrl = newSearchParams.toString()
        ? `${window.location.pathname}?${newSearchParams.toString()}`
        : window.location.pathname
      router.replace(newUrl)
    }
  }, [password, searchParams, router])

  const handleUnlock = () => {
    setIsUnlocked(true)
  }

  if (!isUnlocked) {
    return (
      <PasswordProtection
        correctPassword={password}
        onSuccess={handleUnlock}
      />
    )
  }

  return <>{children}</>
}
