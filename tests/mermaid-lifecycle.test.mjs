import assert from 'node:assert/strict'
import test from 'node:test'

import { createMermaidLifecycle } from '../components/mermaid/lifecycle.mjs'

test('the Mermaid lifecycle serializes global initialization across differently themed diagrams', async () => {
  const events = []
  let activeTheme
  const mermaid = {
    initialize({ theme }) {
      activeTheme = theme
      events.push(`initialize:${theme}`)
    },
    async render(id) {
      events.push(`render:${id}:${activeTheme}`)
      await Promise.resolve()
      return { svg: `<svg data-theme="${activeTheme}"></svg>` }
    },
  }
  const lifecycle = createMermaidLifecycle({
    loadMermaid: async () => mermaid,
    createThemeConfig: (theme) => ({ theme }),
  })

  const [dark, light] = await Promise.all([
    lifecycle.render({ id: 'dark', chart: 'graph TD', resolvedTheme: 'dark' }),
    lifecycle.render({
      id: 'light',
      chart: 'graph LR',
      resolvedTheme: 'light',
    }),
  ])

  assert.match(dark.svg, /data-theme="dark"/)
  assert.match(light.svg, /data-theme="default"/)
  assert.deepEqual(events, [
    'initialize:dark',
    'render:dark:dark',
    'initialize:default',
    'render:light:default',
  ])
})

test('the Mermaid lifecycle owns chart config precedence and strips config before rendering', async () => {
  const calls = []
  const lifecycle = createMermaidLifecycle({
    loadMermaid: async () => ({
      initialize(config) {
        calls.push(['initialize', config])
      },
      async render(id, chart) {
        calls.push(['render', id, chart])
        return { svg: '<svg></svg>' }
      },
    }),
    createThemeConfig: (theme) => ({ theme }),
  })

  await lifecycle.render({
    id: 'configured',
    chart: '---\nconfig:\n  theme: forest\n---\ngraph TD',
    resolvedTheme: 'dark',
    configTheme: 'neutral',
  })

  assert.deepEqual(calls, [
    ['initialize', { theme: 'forest' }],
    ['render', 'configured', 'graph TD'],
  ])
})
