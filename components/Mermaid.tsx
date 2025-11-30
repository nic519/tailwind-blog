'use client'

import { useEffect, useRef, useState } from 'react'
import { useTheme } from 'next-themes'

interface MermaidProps {
  chart: string
  config?: {
    theme?: string
  }
}

// 全局 mermaid 模块缓存和当前主题
let mermaidModule: typeof import('mermaid') | null = null
let currentTheme: string | null = null

// 解析 Mermaid 代码中的配置块
const parseMermaidConfig = (chart: string): { chart: string; theme?: string } => {
  // 匹配 Mermaid 配置块：---\nconfig:\n  theme: xxx\n---
  const configMatch = chart.match(/^---\s*\nconfig:\s*\n\s*theme:\s*(\w+)\s*\n---\s*\n([\s\S]*)$/)

  if (configMatch) {
    return {
      chart: configMatch[2].trim(),
      theme: configMatch[1],
    }
  }

  // 也支持单行格式：---config: theme: xxx---
  const singleLineMatch = chart.match(/^---\s*config:\s*theme:\s*(\w+)\s*---\s*\n([\s\S]*)$/)
  if (singleLineMatch) {
    return {
      chart: singleLineMatch[2].trim(),
      theme: singleLineMatch[1],
    }
  }

  return { chart: chart.trim() }
}

const Mermaid = ({ chart, config }: MermaidProps) => {
  const mermaidRef = useRef<HTMLDivElement>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [svg, setSvg] = useState<string | null>(null)
  const { resolvedTheme } = useTheme()
  // 使用更稳定的 ID 生成方式，主题变化时重新生成以确保重新渲染
  const idRef = useRef(`mermaid-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`)

  // 当主题变化时，清空 SVG 和重置 currentTheme 以强制重新渲染
  useEffect(() => {
    setSvg(null)
    setIsLoading(true)
    idRef.current = `mermaid-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
    // 重置全局主题缓存，确保重新初始化
    currentTheme = null
  }, [resolvedTheme])

  useEffect(() => {
    if (!chart) {
      setIsLoading(false)
      return
    }

    let isMounted = true

    const renderMermaid = async () => {
      try {
        setIsLoading(true)
        setError(null)

        // 解析代码中的配置
        const { chart: cleanChart, theme: chartTheme } = parseMermaidConfig(chart)

        // 主题选择逻辑：
        // 1. 优先使用代码中指定的主题
        // 2. 如果没有指定，根据系统主题自动选择（dark 模式用 dark，light 模式用 default）
        // 3. 最后使用传入的 config 或默认值
        let theme: string
        if (chartTheme) {
          theme = chartTheme
        } else if (resolvedTheme === 'dark') {
          theme = config?.theme || 'dark'
        } else {
          theme = config?.theme || 'default'
        }

        // 调试：检查解析的主题
        if (process.env.NODE_ENV === 'development') {
          console.log('Mermaid 主题解析:', {
            chartTheme,
            resolvedTheme,
            finalTheme: theme,
            cleanChartPreview: cleanChart.substring(0, 100)
          })
        }

        // 动态导入 mermaid（延迟加载）
        if (!mermaidModule) {
          if (process.env.NODE_ENV === 'development') {
            console.log('Loading mermaid module...')
          }
          mermaidModule = await import('mermaid')
        }

        const mermaid = mermaidModule.default

        // 只在主题变化时重新初始化
        if (currentTheme !== theme) {
          let themeConfig: any = {
            startOnLoad: false,
            securityLevel: 'loose',
          }

          // 处理 neo 主题 - 使用 base 主题 + 自定义 themeVariables
          if (theme === 'neo') {
            themeConfig.theme = 'base'

            // 根据主题模式选择配色方案
            const isDark = resolvedTheme === 'dark'

            // 重新设计：确保高对比度和可读性
            // 深色主题：深色背景 + 深色节点 + 浅色文本（高对比度）
            // 浅色主题：浅色背景 + 浅色节点 + 深色文本（高对比度）
            themeConfig.themeVariables = isDark
              ? {
                // 深色主题：使用深色节点配浅色文本，确保高对比度
                primaryColor: '#475569', // 中深灰蓝色
                primaryTextColor: '#f1f5f9', // 浅色文本，高对比度
                primaryBorderColor: '#64748b', // 中等亮度的边框

                secondaryColor: '#64748b',
                tertiaryColor: '#94a3b8',

                background: '#030712', // 深色背景
                mainBkgColor: '#475569', // 主节点：深色，与背景有区分但不会太亮
                secondBkgColor: '#64748b', // 次要节点：稍浅但仍为深色
                textColor: '#f1f5f9', // 浅色文本，确保可读性

                lineColor: '#64748b', // 中等亮度的连接线

                // mindmap 节点：深色系渐变，但都配浅色文本
                cScale0: '#475569', // 主节点：深灰蓝
                cScale1: '#64748b', // 二级：稍浅但仍为深色
                cScale2: '#94a3b8', // 三级：中等深度
                cScale3: '#cbd5e1', // 四级：浅色（但文本会自动变深色）
              }
              : {
                // 浅色主题：使用浅色节点配深色文本，确保高对比度
                primaryColor: '#cbd5e1', // 浅灰蓝色
                primaryTextColor: '#1e293b', // 深色文本，高对比度
                primaryBorderColor: '#94a3b8', // 中等深度的边框

                secondaryColor: '#94a3b8',
                tertiaryColor: '#64748b',

                background: '#ffffff', // 白色背景
                mainBkgColor: '#cbd5e1', // 主节点：浅色，与背景有区分
                secondBkgColor: '#e2e8f0', // 次要节点：更浅
                textColor: '#1e293b', // 深色文本，确保可读性

                lineColor: '#cbd5e1', // 浅色连接线

                // mindmap 节点：浅色系渐变，但都配深色文本
                cScale0: '#cbd5e1', // 主节点：浅灰蓝
                cScale1: '#e2e8f0', // 二级：更浅
                cScale2: '#f1f5f9', // 三级：很浅
                cScale3: '#f8fafc', // 四级：最浅（接近白）
              }
          } else {
            // 其他主题使用默认配置
            themeConfig.theme = theme as any
          }

          try {
            mermaid.initialize(themeConfig)
            currentTheme = theme

            if (process.env.NODE_ENV === 'development') {
              console.log('Mermaid 主题初始化:', {
                theme,
                config: themeConfig,
                isNeoCustom: theme === 'neo'
              })
            }
          } catch (err) {
            console.error('Mermaid 主题初始化失败:', err)
            // 如果主题不支持，回退到 default
            if (theme !== 'default') {
              console.warn(`主题 "${theme}" 可能不支持，尝试使用 default 主题`)
              mermaid.initialize({
                startOnLoad: false,
                theme: 'default',
                securityLevel: 'loose',
              })
              currentTheme = 'default'
            }
          }
        }

        const id = idRef.current

        // 使用清理后的图表代码渲染
        const result = await mermaid.render(id, cleanChart)

        if (isMounted) {
          setSvg(result.svg)
          setIsLoading(false)
        }
      } catch (err: any) {
        console.error('Mermaid render error:', err)
        console.error('Chart content:', chart)
        if (isMounted) {
          setError(err.message || 'Failed to render diagram')
          setIsLoading(false)
        }
      }
    }

    renderMermaid()

    return () => {
      isMounted = false
    }
  }, [chart, config, resolvedTheme])

  // 在 SVG 渲染后调整尺寸，确保响应式显示
  useEffect(() => {
    if (!svg || !mermaidRef.current) return

    // 使用 setTimeout 确保 SVG 已经插入到 DOM
    const adjustSvg = () => {
      const container = mermaidRef.current
      if (!container) return

      const svgElement = container.querySelector('svg')
      if (!svgElement) {
        // 如果 SVG 还没插入，再等一会儿
        setTimeout(adjustSvg, 50)
        return
      }

      if (svgElement) {
        // 保存原始的宽高（如果有的话）
        const originalWidth = svgElement.getAttribute('width')
        const originalHeight = svgElement.getAttribute('height')

        // 如果 SVG 有 viewBox，保留它；如果没有但有宽高，创建 viewBox
        if (!svgElement.getAttribute('viewBox')) {
          if (originalWidth && originalHeight) {
            // 移除单位（如 "800px" -> "800"）
            const width = parseFloat(originalWidth)
            const height = parseFloat(originalHeight)
            if (!isNaN(width) && !isNaN(height)) {
              svgElement.setAttribute('viewBox', `0 0 ${width} ${height}`)
            }
          }
        }

        // 移除固定的宽高属性，让 SVG 响应式（但保留 viewBox）
        svgElement.removeAttribute('width')
        svgElement.removeAttribute('height')

        // 确保 SVG 样式正确，使用内联样式提高优先级
        // 设置最大宽度为 800px，防止在大屏幕上过大
        svgElement.setAttribute('style', `
        max-width: 800px !important;
        width: 100% !important;
        height: auto !important;
        display: block !important;
        margin: 0 auto !important;
      `)

        // 获取正文字体大小（prose 默认是 16px，即 1rem）
        const getBodyFontSize = () => {
          // 强制使用 11px
          return 14
        }

        const bodyFontSize = getBodyFontSize()

        // 统一调整所有文本元素为正文字体大小
        const textElements = svgElement.querySelectorAll('text')
        textElements.forEach((textEl) => {
          // 统一设置为正文字体大小
          textEl.setAttribute('font-size', bodyFontSize.toString())
          textEl.style.setProperty('font-size', `${bodyFontSize}px`, 'important')

          // 也调整所有 tspan 子元素（包括嵌套的）
          const tspans = textEl.querySelectorAll('tspan')
          tspans.forEach((tspan) => {
            tspan.setAttribute('font-size', bodyFontSize.toString())
            tspan.style.setProperty('font-size', `${bodyFontSize}px`, 'important')
          })
        })

        // 确保所有 tspan 元素都设置了字体大小（包括不在 text 内的）
        const allTspans = svgElement.querySelectorAll('tspan')
        allTspans.forEach((tspan) => {
          tspan.setAttribute('font-size', bodyFontSize.toString())
          tspan.style.setProperty('font-size', `${bodyFontSize}px`, 'important')
        })

        // 修复文本颜色和字体大小 - 直接设置 foreignObject 内所有元素的样式
        const foreignObjects = svgElement.querySelectorAll('foreignObject')
        foreignObjects.forEach((fo) => {
          const p = fo.querySelector('p') as HTMLParagraphElement | null
          if (!p) return

          // 设置字体大小为正文大小，确保与正文完全一致
          p.style.setProperty('font-size', `${bodyFontSize}px`, 'important')
          p.style.setProperty('line-height', '1.5', 'important') // 与 prose 行高一致
          p.style.setProperty('font-weight', '400', 'important') // 与 prose 字重一致

          // 确保 p 元素内的所有子元素（如 span、strong 等）也使用相同字体大小
          // 特别注意 nodeLabel 类的 span 元素
          const childElements = p.querySelectorAll('*')
          childElements.forEach((child) => {
            if (child instanceof HTMLElement && child.style) {
              child.style.setProperty('font-size', `${bodyFontSize}px`, 'important')
            }
          })

          // 专门处理 nodeLabel 类的元素（编号文本通常在这里）
          const nodeLabels = p.querySelectorAll('.nodeLabel, [class*="nodeLabel"]')
          nodeLabels.forEach((label) => {
            if (label instanceof HTMLElement && label.style) {
              label.style.setProperty('font-size', `${bodyFontSize}px`, 'important')
            }
          })

          // 查找父节点，判断是否是根节点
          let parent = fo.parentElement
          let isRoot = false
          let depth = 0
          while (parent && depth < 5) {
            let classes = ''
            // 处理 SVG 元素的 className
            if (parent instanceof SVGElement) {
              const className = parent.className
              if (typeof className === 'string') {
                classes = className
              } else if (className && typeof className === 'object' && 'baseVal' in className) {
                classes = (className as SVGAnimatedString).baseVal
              }
            } else if (parent.classList) {
              classes = Array.from(parent.classList).join(' ')
            }

            if (classes.includes('section-root')) {
              isRoot = true
              break
            }
            parent = parent.parentElement
            depth++
          }

          // 根据节点类型和主题设置文本颜色，确保高对比度
          if (isRoot) {
            // 根节点：深色主题用浅色文本，浅色主题用深色文本
            p.style.setProperty('color', resolvedTheme === 'dark' ? '#f1f5f9' : '#1e293b', 'important')
          } else {
            // 普通节点：深色主题用浅色文本，浅色主题用深色文本
            p.style.setProperty('color', resolvedTheme === 'dark' ? '#f1f5f9' : '#1e293b', 'important')
          }
        })

        // 如果是 neo 主题，添加优雅的边框并移除所有圆角
        if (currentTheme === 'neo') {
          // 处理 rect 元素
          const rects = svgElement.querySelectorAll('[class*="section-"] rect')
          rects.forEach((rect) => {
            const svgRect = rect as SVGElement
            svgRect.setAttribute('rx', '0')
            svgRect.setAttribute('ry', '0')
            svgRect.style.setProperty('rx', '0', 'important')
            svgRect.style.setProperty('ry', '0', 'important')
          })

          // 处理 path 元素（mindmap 使用 path 绘制节点，包含圆角）
          // Mermaid mindmap 的 path 格式通常是：
          // M x y v dy q0,-r r,-r h dx qr,0 r,r v dy q0,r -r,r h-dx q-r,0 -r,-r Z
          const nodePaths = svgElement.querySelectorAll('path[class*="node-bkg"], path[class*="node-"][id^="node-"]')
          nodePaths.forEach((path) => {
            let d = path.getAttribute('d')
            if (!d) return

            // 解析 path 命令，提取所有坐标点
            const commands = d.trim().split(/\s+(?=[MvhqlZ])/i)
            let currentX = 0
            let currentY = 0
            const points: Array<[number, number]> = []

            // 解析路径，收集所有关键点
            commands.forEach((cmd) => {
              const type = cmd[0].toUpperCase()
              const coords = cmd.substring(1).trim().split(/[\s,]+/).map(parseFloat).filter(n => !isNaN(n))

              if (type === 'M') {
                currentX = coords[0]
                currentY = coords[1]
                points.push([currentX, currentY])
              } else if (type === 'V') {
                currentY += coords[0]
                points.push([currentX, currentY])
              } else if (type === 'H') {
                currentX += coords[0]
                points.push([currentX, currentY])
              } else if (type === 'Q') {
                // 二次贝塞尔曲线：q x1,y1 x2,y2
                // 我们只关心终点
                if (coords.length >= 4) {
                  currentX += coords[2]
                  currentY += coords[3]
                  points.push([currentX, currentY])
                }
              } else if (type === 'Z') {
                // 闭合路径
              }
            })

            // 如果成功解析出至少4个点，重建为无圆角的矩形
            if (points.length >= 4) {
              // 找到边界框
              const xs = points.map(p => p[0])
              const ys = points.map(p => p[1])
              const minX = Math.min(...xs)
              const maxX = Math.max(...xs)
              const minY = Math.min(...ys)
              const maxY = Math.max(...ys)

              // 重建为无圆角的矩形路径（从左上角开始，顺时针）
              d = `M ${minX} ${minY} L ${maxX} ${minY} L ${maxX} ${maxY} L ${minX} ${maxY} Z`
            } else {
              // 如果解析失败，使用简单的替换策略：将所有 q 命令替换为 l 命令
              d = d.replace(/\s*q\s+(-?\d+\.?\d*)\s*,\s*(-?\d+\.?\d*)\s+(-?\d+\.?\d*)\s*,\s*(-?\d+\.?\d*)/gi, (match, x1, y1, x2, y2) => {
                return ` l ${x2} ${y2}`
              })
            }

            path.setAttribute('d', d)
          })

          // 为所有节点形状添加边框，根据主题选择边框颜色
          const borderColor = resolvedTheme === 'dark' ? '#cbd5e1' : '#64748b' // 深色主题用浅色边框，浅色主题用深色边框
          const allShapes = svgElement.querySelectorAll('[class*="section-"] rect, [class*="section-"] path[class*="node-"]')
          allShapes.forEach((shape) => {
            const svgShape = shape as SVGElement
            const currentStroke = svgShape.getAttribute('stroke')
            const computedStroke = window.getComputedStyle(svgShape).stroke
            if (!currentStroke || currentStroke === 'none' || computedStroke === 'none' || computedStroke === 'rgb(0, 0, 0)') {
              svgShape.setAttribute('stroke', borderColor)
              svgShape.setAttribute('stroke-width', '1.5')
              svgShape.style.setProperty('stroke', borderColor, 'important')
              svgShape.style.setProperty('stroke-width', '1.5px', 'important')
            }
          })
        }

        // 调试信息（开发环境）- 检查主题样式
        if (process.env.NODE_ENV === 'development') {
          const sampleText = textElements[0]
          const sampleNode = svgElement.querySelector('.node, g[class*="node"]')
          const samplePath = svgElement.querySelector('path')

          console.log('Mermaid 渲染信息:', {
            theme: currentTheme,
            textElementsCount: textElements.length,
            foreignObjectsCount: foreignObjects.length,
            svgTransform: window.getComputedStyle(svgElement).transform,
            svgMaxWidth: window.getComputedStyle(svgElement).maxWidth,
            sampleText: sampleText ? {
              fontSize: window.getComputedStyle(sampleText).fontSize,
              fill: window.getComputedStyle(sampleText).fill,
              color: window.getComputedStyle(sampleText).color
            } : null,
            sampleNode: sampleNode ? {
              fill: window.getComputedStyle(sampleNode).fill,
              stroke: window.getComputedStyle(sampleNode).stroke
            } : null,
            samplePath: samplePath ? {
              fill: samplePath.getAttribute('fill'),
              stroke: samplePath.getAttribute('stroke'),
              style: samplePath.getAttribute('style')
            } : null
          })
        }
      }
    }

    // 立即执行一次，如果 SVG 还没插入则延迟执行
    adjustSvg()
  }, [svg])

  if (error) {
    return (
      <div className="my-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded">
        <p className="text-red-600 dark:text-red-400">Mermaid 渲染错误: {error}</p>
        <pre className="mt-2 text-xs text-red-500 dark:text-red-400 overflow-auto">{chart}</pre>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="my-4 flex justify-center items-center py-8">
        <div className="text-gray-500 dark:text-gray-400 text-sm">正在加载图表...</div>
      </div>
    )
  }

  if (!svg) {
    return null
  }

  return (
    <div
      ref={mermaidRef}
      className="mermaid-container my-4 flex justify-center items-center w-full overflow-x-auto"
      style={{
        // 提高样式优先级，防止被覆盖
        isolation: 'isolate',
      }}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  )
}

export default Mermaid


