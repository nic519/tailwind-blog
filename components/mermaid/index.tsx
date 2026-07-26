'use client'

import { useEffect, useRef, useState } from 'react'
import { useTheme } from 'next-themes'
import { createMermaidLifecycle } from './lifecycle.mjs'
import { postProcessSvg } from './postProcess'
import { createMermaidThemeConfig } from './theme'
import type { MermaidProps } from './types'

const mermaidLifecycle = createMermaidLifecycle({
  loadMermaid: async () => (await import('mermaid')).default,
  createThemeConfig: createMermaidThemeConfig,
})

const createRenderId = () => `mermaid-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`

const Mermaid = ({ chart, config }: MermaidProps) => {
  const mermaidRef = useRef<HTMLDivElement>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [rendered, setRendered] = useState<{
    svg: string
    theme: string
  } | null>(null)
  const { resolvedTheme } = useTheme()
  const configTheme = config?.theme

  useEffect(() => {
    if (!chart) {
      setIsLoading(false)
      setRendered(null)
      return
    }

    const controller = new AbortController()

    setIsLoading(true)
    setError(null)
    setRendered(null)

    mermaidLifecycle
      .render({
        id: createRenderId(),
        chart,
        resolvedTheme,
        configTheme,
        signal: controller.signal,
      })
      .then(({ svg, theme }) => {
        setRendered({ svg, theme })
        setIsLoading(false)
      })
      .catch((renderError: unknown) => {
        if (renderError instanceof Error && renderError.name === 'AbortError') {
          return
        }

        console.error('Mermaid render error:', renderError)
        setError(renderError instanceof Error ? renderError.message : 'Failed to render diagram')
        setIsLoading(false)
      })

    return () => controller.abort()
  }, [chart, configTheme, resolvedTheme])

  useEffect(() => {
    if (!rendered || !mermaidRef.current) return

    const svgElement = mermaidRef.current.querySelector('svg')
    if (!svgElement) return

    postProcessSvg(svgElement as SVGElement, mermaidRef.current, rendered.theme, resolvedTheme)
  }, [rendered, resolvedTheme])

  if (error) {
    return (
      <div className="my-4 rounded border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
        <p className="text-red-600 dark:text-red-400">Mermaid 渲染错误: {error}</p>
        <pre className="mt-2 overflow-auto text-xs text-red-500 dark:text-red-400">{chart}</pre>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="my-4 flex items-center justify-center py-8">
        <div className="text-sm text-gray-500 dark:text-gray-400">正在加载图表...</div>
      </div>
    )
  }

  if (!rendered) return null

  return (
    <div
      ref={mermaidRef}
      className="mermaid-container my-4 flex w-full items-center justify-center overflow-x-auto"
      style={{ isolation: 'isolate' }}
      dangerouslySetInnerHTML={{ __html: rendered.svg }}
    />
  )
}

export default Mermaid
