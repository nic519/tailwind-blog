export interface MermaidRenderRequest {
  id: string
  chart: string
  resolvedTheme?: string
  configTheme?: string
  signal?: AbortSignal
}

export interface MermaidAdapterRenderResult {
  svg: string
  bindFunctions?: (element: Element) => void
}

export interface MermaidRenderResult extends MermaidAdapterRenderResult {
  theme: string
}

export interface MermaidAdapter {
  initialize(config: unknown): void
  render(id: string, chart: string): Promise<MermaidAdapterRenderResult>
}

export function createMermaidLifecycle(options: {
  loadMermaid: () => Promise<MermaidAdapter>
  createThemeConfig: (theme: string, resolvedTheme?: string) => unknown
}): {
  render(request: MermaidRenderRequest): Promise<MermaidRenderResult>
}
