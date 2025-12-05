export interface MermaidProps {
  chart: string;
  config?: {
    theme?: string;
  };
}

export interface ParsedMermaidConfig {
  chart: string;
  theme?: string;
}

export interface MermaidThemeVariables {
  primaryColor?: string;
  primaryTextColor?: string;
  // primaryBorderColor 是自动派生的，设置无效
  // primaryBorderColor?: string;
  secondaryColor?: string;
  tertiaryColor?: string;
  background?: string;
  mainBkg?: string; // 官方字段名，不是 mainBkgColor
  secondBkg?: string; // 官方字段名，不是 secondBkgColor
  textColor?: string;
  lineColor?: string;
  cScale0?: string;
  cScale1?: string;
  cScale2?: string;
  cScale3?: string;
  fontSize?: string;
  fontFamily?: string;
  [key: string]: string | undefined;
}

export interface MermaidThemeConfig {
  startOnLoad: boolean;
  securityLevel: string;
  theme: string;
  themeVariables?: MermaidThemeVariables;
}
