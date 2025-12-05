import type { MermaidThemeConfig, MermaidThemeVariables } from "./types";
import { getBodyFontSize } from "./config";

/**
 * Tailwind CSS 颜色值
 * 使用 OKLCH 格式定义（符合 Tailwind CSS v4 标准）
 * 参考: https://tailwindcss.com/docs/colors
 *
 * 注意：Mermaid.js 只支持十六进制颜色格式，所以这里同时提供
 * OKLCH 格式（用于文档和未来兼容）和对应的十六进制值（用于 Mermaid）
 */
const tailwindColors = {
  // Sky 色系 (primary)
  sky: {
    500: "#0ea5e9", // oklch(68.5% 0.169 237.32)
    600: "#0284c7", // oklch(58.8% 0.158 241.97)
  },
  // Slate 色系
  slate: {
    50: "#f8fafc", // oklch(98.42% 0.0034 247.86)
    100: "#f1f5f9", // oklch(96.83% 0.0069 247.9)
    200: "#e2e8f0", // oklch(92.88% 0.0126 255.51)
    300: "#cbd5e1", // oklch(86.9% 0.0198 252.89)
    400: "#94a3b8", // oklch(71.07% 0.0351 256.79)
    500: "#64748b", // oklch(55.44% 0.0407 257.42)
    600: "#475569", // oklch(44.55% 0.0374 257.28)
    700: "#334155", // oklch(37.17% 0.0392 257.29)
    800: "#1e293b", // oklch(27.95% 0.0368 260.03)
    900: "#0f172a", // oklch(20.77% 0.0398 265.75)
    950: "#020617", // oklch(12.88% 0.0406 264.7)
  },
  // 基础颜色
  white: "#ffffff", // oklch(100% 0 0)
  black: "#000000", // oklch(0% 0 0)
};

/**
 * 创建 neo 主题的自定义配置
 * 使用 Tailwind CSS 标准颜色系统
 */
const createNeoThemeConfig = (isDark: boolean): MermaidThemeVariables => {
  const fontSize = getBodyFontSize();
  return isDark
    ? {
        // 深色主题：深色背景 + 深色节点 + 浅色文本（高对比度）
        // 使用 Tailwind slate-950 作为背景，slate-100 作为文本
        primaryColor: tailwindColors.slate[500], // sky-500: 主色调
        primaryTextColor: tailwindColors.slate[100], // slate-100: 浅色文本
        secondaryColor: tailwindColors.slate[500], // slate-500: 次要色
        tertiaryColor: tailwindColors.slate[400], // slate-400: 第三色
        background: tailwindColors.slate[950], // slate-950: 深色背景
        mainBkg: tailwindColors.slate[600], // slate-600: 主背景色（官方字段名）
        secondBkg: tailwindColors.slate[500], // slate-500: 次背景色（官方字段名）
        textColor: tailwindColors.slate[100], // slate-100: 文本色
        lineColor: tailwindColors.slate[500], // slate-500: 线条色
        cScale0: tailwindColors.slate[600], // slate-600: 颜色刻度 0
        cScale1: tailwindColors.slate[500], // slate-500: 颜色刻度 1
        cScale2: tailwindColors.slate[400], // slate-400: 颜色刻度 2
        cScale3: tailwindColors.slate[300], // slate-300: 颜色刻度 3
        fontSize: fontSize,
        fontFamily: "inherit",
      }
    : {
        // 浅色主题：浅色背景 + 浅色节点 + 深色文本（高对比度）
        // 使用 Tailwind white 作为背景，slate-800 作为文本
        primaryColor: tailwindColors.white, // white: 主色调
        primaryTextColor: tailwindColors.slate[800], // slate-800: 深色文本
        secondaryColor: tailwindColors.slate[400], // slate-400: 次要色
        tertiaryColor: tailwindColors.slate[500], // slate-500: 第三色
        background: tailwindColors.white, // white: 浅色背景
        mainBkg: tailwindColors.slate[300], // slate-300: 主背景色（官方字段名）
        secondBkg: tailwindColors.slate[200], // slate-200: 次背景色（官方字段名）
        textColor: tailwindColors.slate[800], // slate-800: 文本色
        lineColor: tailwindColors.slate[300], // slate-300: 线条色
        cScale0: tailwindColors.slate[300], // slate-300: 颜色刻度 0
        cScale1: tailwindColors.slate[200], // slate-200: 颜色刻度 1
        cScale2: tailwindColors.slate[100], // slate-100: 颜色刻度 2
        cScale3: tailwindColors.slate[50], // slate-50: 颜色刻度 3
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
