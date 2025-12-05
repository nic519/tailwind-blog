import type { MermaidThemeConfig, MermaidThemeVariables } from "./types";
import { getBodyFontSize } from "./config";

/**
 * 创建 neo 主题的自定义配置
 */
const createNeoThemeConfig = (isDark: boolean): MermaidThemeVariables => {
  const fontSize = getBodyFontSize();

  return isDark
    ? {
        // 深色主题：深色背景 + 深色节点 + 浅色文本（高对比度）
        primaryColor: "#1E90FF",
        primaryTextColor: "#f1f5f9",
        primaryBorderColor: "#64748b",
        secondaryColor: "#64748b",
        tertiaryColor: "#94a3b8",
        background: "#030712",
        mainBkgColor: "#475569",
        secondBkgColor: "#64748b",
        textColor: "#f1f5f9",
        lineColor: "#64748b",
        cScale0: "#475569",
        cScale1: "#64748b",
        cScale2: "#94a3b8",
        cScale3: "#cbd5e1",
        fontSize: fontSize,
        fontFamily: "inherit",
      }
    : {
        // 浅色主题：浅色背景 + 浅色节点 + 深色文本（高对比度）
        primaryColor: "#ffffff",
        primaryTextColor: "#1e293b",
        primaryBorderColor: "#94a3b8",
        secondaryColor: "#94a3b8",
        tertiaryColor: "#64748b",
        background: "#ffffff",
        mainBkgColor: "#cbd5e1",
        secondBkgColor: "#e2e8f0",
        textColor: "#1e293b",
        lineColor: "#cbd5e1",
        cScale0: "#cbd5e1",
        cScale1: "#e2e8f0",
        cScale2: "#f1f5f9",
        cScale3: "#f8fafc",
        fontSize: fontSize,
        fontFamily: "inherit",
      };
};

/**
 * 创建 Mermaid 主题配置
 */
export const createMermaidThemeConfig = (
  theme: string,
  resolvedTheme: string | undefined,
): MermaidThemeConfig => {
  const fontSize = getBodyFontSize();
  const isDark = resolvedTheme === "dark";

  const baseConfig: MermaidThemeConfig = {
    startOnLoad: false,
    securityLevel: "loose",
    theme: theme === "neo" ? "base" : theme,
  };

  if (theme === "neo") {
    baseConfig.themeVariables = createNeoThemeConfig(isDark);
  } else {
    baseConfig.themeVariables = {
      fontSize: fontSize,
      fontFamily: "inherit",
    };
  }

  return baseConfig;
};

/**
 * 确定最终使用的主题
 */
export const determineTheme = (
  chartTheme: string | undefined,
  resolvedTheme: string | undefined,
  configTheme?: string,
): string => {
  // 1. 优先使用代码中指定的主题
  if (chartTheme) {
    return chartTheme;
  }

  // 2. 根据系统主题自动选择
  if (resolvedTheme === "dark") {
    return configTheme || "dark";
  }

  // 3. 使用传入的 config 或默认值
  return configTheme || "default";
};
