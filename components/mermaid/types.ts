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
  primaryBorderColor?: string;
  secondaryColor?: string;
  tertiaryColor?: string;
  background?: string;
  mainBkgColor?: string;
  secondBkgColor?: string;
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
