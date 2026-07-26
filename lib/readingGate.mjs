export function createReadingGate(expectedPassword) {
  return {
    attempt(password) {
      const unlocked = password === expectedPassword
      return {
        unlocked,
        error: unlocked ? '' : '密码错误，请重试',
      }
    },
    readUrl(value) {
      const url = new URL(value)
      const unlocked = url.searchParams.get('password') === expectedPassword

      if (!unlocked) return { unlocked: false }

      url.searchParams.delete('password')
      return {
        unlocked: true,
        cleanUrl: `${url.pathname}${url.search}${url.hash}`,
      }
    },
  }
}
