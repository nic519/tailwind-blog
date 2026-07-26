import assert from 'node:assert/strict'
import test from 'node:test'

import { createReadingGate } from '../lib/readingGate.mjs'

test('the reading gate unlocks matching URLs and removes only the password parameter', () => {
  const gate = createReadingGate('ja')

  assert.deepEqual(
    gate.readUrl('https://example.test/myblog/blog/post?utm_source=feed&password=ja#notes'),
    {
      unlocked: true,
      cleanUrl: '/myblog/blog/post?utm_source=feed#notes',
    }
  )
})

test('the reading gate reports one observable result for form attempts', () => {
  const gate = createReadingGate('ja')

  assert.deepEqual(gate.attempt('wrong'), {
    unlocked: false,
    error: '密码错误，请重试',
  })
  assert.deepEqual(gate.attempt('ja'), { unlocked: true, error: '' })
})
