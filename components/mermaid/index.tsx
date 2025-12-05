"use client";

import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";
import type { MermaidProps } from "./types";
import { parseMermaidConfig } from "./config";
import { determineTheme, createMermaidThemeConfig } from "./theme";
import { postProcessSvg } from "./postProcess";

// 全局 mermaid 模块缓存和当前主题
let mermaidModule: typeof import("mermaid") | null = null;
let currentTheme: string | null = null;

const Mermaid = ({ chart, config }: MermaidProps) => {
  const mermaidRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [svg, setSvg] = useState<string | null>(null);
  const { resolvedTheme } = useTheme();
  const idRef = useRef(
    `mermaid-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
  );

  // 当主题变化时，清空 SVG 和重置 currentTheme 以强制重新渲染
  useEffect(() => {
    setSvg(null);
    setIsLoading(true);
    idRef.current = `mermaid-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    currentTheme = null;
  }, [resolvedTheme]);

  useEffect(() => {
    if (!chart) {
      setIsLoading(false);
      return;
    }

    let isMounted = true;

    const renderMermaid = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // 解析代码中的配置
        const { chart: cleanChart, theme: chartTheme } =
          parseMermaidConfig(chart);

        // 确定最终使用的主题
        const theme = determineTheme(chartTheme, resolvedTheme, config?.theme);

        // 动态导入 mermaid（延迟加载）
        if (!mermaidModule) {
          mermaidModule = await import("mermaid");
        }

        const mermaid = mermaidModule.default;

        // 只在主题变化时重新初始化
        if (currentTheme !== theme) {
          const themeConfig = createMermaidThemeConfig(theme, resolvedTheme);

          try {
            mermaid.initialize(themeConfig);
            currentTheme = theme;
          } catch (err) {
            console.error("Mermaid 主题初始化失败:", err);
            // 如果主题不支持，回退到 default
            if (theme !== "default") {
              console.warn(`主题 "${theme}" 可能不支持，尝试使用 default 主题`);
              mermaid.initialize({
                startOnLoad: false,
                theme: "default",
                securityLevel: "loose",
              });
              currentTheme = "default";
            }
          }
        }

        const id = idRef.current;

        // 使用清理后的图表代码渲染
        const result = await mermaid.render(id, cleanChart);

        if (isMounted) {
          setSvg(result.svg);
          setIsLoading(false);
        }
      } catch (err: unknown) {
        console.error("Mermaid render error:", err);
        if (isMounted) {
          const errorMessage =
            err instanceof Error ? err.message : "Failed to render diagram";
          setError(errorMessage);
          setIsLoading(false);
        }
      }
    };

    renderMermaid();

    return () => {
      isMounted = false;
    };
  }, [chart, config, resolvedTheme]);

  // 在 SVG 渲染后调整尺寸，确保响应式显示
  useEffect(() => {
    if (!svg || !mermaidRef.current || !currentTheme) return;

    const adjustSvg = () => {
      const container = mermaidRef.current;
      if (!container) return;

      const svgElement = container.querySelector("svg");
      if (!svgElement) {
        setTimeout(adjustSvg, 50);
        return;
      }

      postProcessSvg(
        svgElement as SVGElement,
        container,
        currentTheme!,
        resolvedTheme,
      );
    };

    adjustSvg();
  }, [svg, resolvedTheme]);

  if (error) {
    return (
      <div className="my-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded">
        <p className="text-red-600 dark:text-red-400">
          Mermaid 渲染错误: {error}
        </p>
        <pre className="mt-2 text-xs text-red-500 dark:text-red-400 overflow-auto">
          {chart}
        </pre>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="my-4 flex justify-center items-center py-8">
        <div className="text-gray-500 dark:text-gray-400 text-sm">
          正在加载图表...
        </div>
      </div>
    );
  }

  if (!svg) {
    return null;
  }

  return (
    <div
      ref={mermaidRef}
      className="mermaid-container my-4 flex justify-center items-center w-full overflow-x-auto"
      style={{
        isolation: "isolate",
      }}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
};

export default Mermaid;
