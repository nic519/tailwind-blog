const parseChart = (chart) => {
  const multiline = chart.match(/^---\s*\nconfig:\s*\n\s*theme:\s*(\w+)\s*\n---\s*\n([\s\S]*)$/)
  if (multiline) return { chart: multiline[2].trim(), theme: multiline[1] }

  const singleLine = chart.match(/^---\s*config:\s*theme:\s*(\w+)\s*---\s*\n([\s\S]*)$/)
  if (singleLine) return { chart: singleLine[2].trim(), theme: singleLine[1] }

  return { chart: chart.trim(), theme: undefined }
}

const resolveTheme = ({ chartTheme, resolvedTheme, configTheme }) =>
  chartTheme ?? configTheme ?? (resolvedTheme === 'dark' ? 'dark' : 'default')

const throwIfAborted = (signal) => {
  if (!signal?.aborted) return
  const error = new Error('Mermaid render aborted')
  error.name = 'AbortError'
  throw error
}

export function createMermaidLifecycle({ loadMermaid, createThemeConfig }) {
  let mermaidPromise
  let queue = Promise.resolve()

  const enqueue = (work) => {
    const result = queue.then(work, work)
    queue = result.then(
      () => undefined,
      () => undefined
    )
    return result
  }

  return {
    render({ id, chart, resolvedTheme, configTheme, signal }) {
      return enqueue(async () => {
        throwIfAborted(signal)
        const parsed = parseChart(chart)
        const theme = resolveTheme({
          chartTheme: parsed.theme,
          resolvedTheme,
          configTheme,
        })

        mermaidPromise ??= loadMermaid()
        const mermaid = await mermaidPromise
        throwIfAborted(signal)
        mermaid.initialize(createThemeConfig(theme, resolvedTheme))
        const rendered = await mermaid.render(id, parsed.chart)
        throwIfAborted(signal)
        return { ...rendered, theme }
      })
    },
  }
}
