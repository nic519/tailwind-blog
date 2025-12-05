import { getBodyFontSize } from "./config";

/**
 * 调整 SVG 响应式样式
 */
export const adjustSvgResponsiveStyle = (svgElement: SVGElement): void => {
  const existingStyle = svgElement.getAttribute("style") || "";
  const appendedStyle = `
    display: block !important;
    margin: 0 auto !important;
    max-width: 100% !important;
    height: auto !important;
  `;
  svgElement.setAttribute("style", `${existingStyle};${appendedStyle}`);
};

/**
 * 移除 mindmap 节点底部的装饰横线
 */
export const removeBottomDecorLines = (svgElement: SVGElement): void => {
  const bottomDecorLines = svgElement.querySelectorAll(".node-line-");
  bottomDecorLines.forEach((line) => {
    const el = line as SVGElement;
    el.style.setProperty("display", "none", "important");
    el.setAttribute("opacity", "0");
  });
};

/**
 * 修复文本样式（颜色、字体大小等）
 */
export const fixTextStyles = (
  svgElement: SVGElement,
  container: HTMLElement,
  resolvedTheme: string | undefined,
): void => {
  const foreignObjects = svgElement.querySelectorAll("foreignObject");
  const proseFontSize = getBodyFontSize();
  const textColor = resolvedTheme === "dark" ? "#f1f5f9" : "#1e293b";

  foreignObjects.forEach((fo) => {
    const p = fo.querySelector("p") as HTMLParagraphElement | null;
    if (!p) return;

    // 设置基础样式
    p.style.setProperty("line-height", "1.5", "important");
    p.style.setProperty("font-weight", "400", "important");
    p.style.setProperty("font-size", proseFontSize, "important");
    p.style.setProperty("font-size-adjust", "none", "important");
    p.style.setProperty("white-space", "normal", "important");
    p.style.setProperty("word-wrap", "break-word", "important");
    p.style.setProperty("overflow-wrap", "break-word", "important");
    p.style.setProperty("color", textColor, "important");

    // 调整 foreignObject 宽度（如果需要）
    const foWidth = fo.getAttribute("width");
    if (foWidth) {
      const widthNum = parseFloat(foWidth);
      if (widthNum < 100) {
        const textLength = p.textContent?.length || 0;
        const estimatedWidth = Math.max(widthNum, textLength * 8 + 20);
        fo.setAttribute("width", String(estimatedWidth));
      }
    }
  });
};

/**
 * 移除所有圆角（用于 neo 主题）
 */
export const removeAllRoundCorners = (svgElement: SVGElement): void => {
  // 处理 rect 元素
  const rects = svgElement.querySelectorAll('[class*="section-"] rect');
  rects.forEach((rect) => {
    const svgRect = rect as SVGElement;
    svgRect.setAttribute("rx", "0");
    svgRect.setAttribute("ry", "0");
    svgRect.style.setProperty("rx", "0", "important");
    svgRect.style.setProperty("ry", "0", "important");
  });

  // 处理 path 元素（mindmap 使用 path 绘制节点）
  const nodePaths = svgElement.querySelectorAll(
    'path[class*="node-bkg"], path[class*="node-"][id^="node-"]',
  );
  nodePaths.forEach((path) => {
    let d = path.getAttribute("d");
    if (!d) return;

    // 解析路径命令
    const commands = d.trim().split(/\s+(?=[MvhqlZ])/i);
    let currentX = 0;
    let currentY = 0;
    const points: Array<[number, number]> = [];

    commands.forEach((cmd) => {
      const type = cmd[0].toUpperCase();
      const coords = cmd
        .substring(1)
        .trim()
        .split(/[\s,]+/)
        .map(parseFloat)
        .filter((n) => !isNaN(n));

      if (type === "M") {
        currentX = coords[0];
        currentY = coords[1];
        points.push([currentX, currentY]);
      } else if (type === "V") {
        currentY += coords[0];
        points.push([currentX, currentY]);
      } else if (type === "H") {
        currentX += coords[0];
        points.push([currentX, currentY]);
      } else if (type === "Q") {
        if (coords.length >= 4) {
          currentX += coords[2];
          currentY += coords[3];
          points.push([currentX, currentY]);
        }
      }
    });

    // 重建为无圆角的矩形路径
    if (points.length >= 4) {
      const xs = points.map((p) => p[0]);
      const ys = points.map((p) => p[1]);
      const minX = Math.min(...xs);
      const maxX = Math.max(...xs);
      const minY = Math.min(...ys);
      const maxY = Math.max(...ys);
      d = `M ${minX} ${minY} L ${maxX} ${minY} L ${maxX} ${maxY} L ${minX} ${maxY} Z`;
    } else {
      // 简单替换策略：将所有 q 命令替换为 l 命令
      d = d.replace(
        /\s*q\s+(-?\d+\.?\d*)\s*,\s*(-?\d+\.?\d*)\s+(-?\d+\.?\d*)\s*,\s*(-?\d+\.?\d*)/gi,
        (match, x1, y1, x2, y2) => {
          return ` l ${x2} ${y2}`;
        },
      );
    }

    path.setAttribute("d", d);
  });
};

/**
 * 添加节点边框（用于 neo 主题）
 */
export const addNodeBorders = (
  svgElement: SVGElement,
  resolvedTheme: string | undefined,
): void => {
  const borderColor = resolvedTheme === "dark" ? "#cbd5e1" : "#64748b";
  const allShapes = svgElement.querySelectorAll(
    '[class*="section-"] rect, [class*="section-"] path[class*="node-"]',
  );

  allShapes.forEach((shape) => {
    const svgShape = shape as SVGElement;
    const currentStroke = svgShape.getAttribute("stroke");
    const computedStroke = window.getComputedStyle(svgShape).stroke;

    if (
      !currentStroke ||
      currentStroke === "none" ||
      computedStroke === "none" ||
      computedStroke === "rgb(0, 0, 0)"
    ) {
      svgShape.setAttribute("stroke", borderColor);
      svgShape.setAttribute("stroke-width", "1");
      svgShape.style.setProperty("stroke", borderColor, "important");
      svgShape.style.setProperty("stroke-width", "1px", "important");
    }
  });
};

/**
 * 统一连接线风格（用于 neo 主题）
 */
export const styleEdges = (
  svgElement: SVGElement,
  resolvedTheme: string | undefined,
): void => {
  const edgeColor = "#94a3b8";
  const edges = svgElement.querySelectorAll("path.edge");

  edges.forEach((edge) => {
    const svgEdge = edge as SVGElement;
    svgEdge.style.setProperty("stroke", edgeColor, "important");
    svgEdge.style.setProperty("stroke-width", "1.2px", "important");
    svgEdge.style.setProperty("stroke-opacity", "0.9", "important");
    svgEdge.style.setProperty("fill", "none", "important");
    svgEdge.style.setProperty(
      "shape-rendering",
      "geometricPrecision",
      "important",
    );
    svgEdge.setAttribute("marker-end", "");
    svgEdge.setAttribute("marker-start", "");
  });
};

/**
 * 应用 neo 主题的特殊样式
 */
export const applyNeoThemeStyles = (
  svgElement: SVGElement,
  resolvedTheme: string | undefined,
): void => {
  removeAllRoundCorners(svgElement);
  addNodeBorders(svgElement, resolvedTheme);
  styleEdges(svgElement, resolvedTheme);
};

/**
 * 执行所有 SVG 后处理
 */
export const postProcessSvg = (
  svgElement: SVGElement,
  container: HTMLElement,
  currentTheme: string,
  resolvedTheme: string | undefined,
): void => {
  adjustSvgResponsiveStyle(svgElement);
  removeBottomDecorLines(svgElement);
  fixTextStyles(svgElement, container, resolvedTheme);

  if (currentTheme === "neo") {
    applyNeoThemeStyles(svgElement, resolvedTheme);
  }
};
