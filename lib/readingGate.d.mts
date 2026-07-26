export interface ReadingGateResult {
  unlocked: boolean
  error?: string
  cleanUrl?: string
}

export interface ReadingGate {
  attempt(password: string): ReadingGateResult
  readUrl(url: string): ReadingGateResult
}

export function createReadingGate(expectedPassword: string): ReadingGate
