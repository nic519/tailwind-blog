import type { ParsedMermaidConfig } from "./types";

/**
 * 获取统一的字体大小，与正文保持一致（固定大小，不随容器缩放）
 */
export const getBodyFontSize = (): string => {
  return "7px";
};

/**
 * 解析 Mermaid 代码中的配置块
 * 支持格式：
 * 1. 多行格式：---\nconfig:\n  theme: xxx\n---
 * 2. 单行格式：---config: theme: xxx---
 */
export const parseMermaidConfig = (chart: string): ParsedMermaidConfig => {
  // 匹配多行格式：---\nconfig:\n  theme: xxx\n---
  const configMatch = chart.match(
    /^---\s*\nconfig:\s*\n\s*theme:\s*(\w+)\s*\n---\s*\n([\s\S]*)$/,
  );

  if (configMatch) {
    return {
      chart: configMatch[2].trim(),
      theme: configMatch[1],
    };
  }

  // 匹配单行格式：---config: theme: xxx---
  const singleLineMatch = chart.match(
    /^---\s*config:\s*theme:\s*(\w+)\s*---\s*\n([\s\S]*)$/,
  );
  if (singleLineMatch) {
    return {
      chart: singleLineMatch[2].trim(),
      theme: singleLineMatch[1],
    };
  }

  return { chart: chart.trim() };
};
