"use client";

import { ReactNode, isValidElement } from "react";
import Pre from "pliny/ui/Pre";
import Mermaid from "./mermaid";

interface CustomPreProps {
  children?: ReactNode;
  className?: string;
  "data-language"?: string;
  "data-theme"?: string;
}

// 递归提取代码内容
const extractCodeContent = (children: ReactNode): string => {
  if (typeof children === "string") {
    return children;
  }

  if (Array.isArray(children)) {
    return children.map(extractCodeContent).join("");
  }

  if (isValidElement(children)) {
    const props = children.props as {
      className?: string;
      children?: ReactNode;
    };
    // 如果是 code 元素，提取其内容
    if (children.type === "code" || props?.className?.includes("language-")) {
      return extractCodeContent(props.children);
    }
    // 递归处理子元素
    if (props?.children) {
      return extractCodeContent(props.children);
    }
  }

  return "";
};

const CustomPre = (props: CustomPreProps) => {
  // 从 className 中提取语言（格式：language-mermaid）
  const className = props.className || "";
  let language = props["data-language"];
  let codeContent = "";

  // 检查 children 中的 code 元素
  if (isValidElement(props.children)) {
    const codeProps = (
      props.children as { props?: { className?: string; children?: ReactNode } }
    ).props;
    if (codeProps?.className) {
      const langMatch = codeProps.className.match(/language-(\w+)/);
      if (langMatch) {
        language = langMatch[1];
      }
      codeContent = extractCodeContent(props.children);
    } else {
      // 如果没有 className，也尝试提取内容
      codeContent = extractCodeContent(props.children);
    }
  } else if (Array.isArray(props.children)) {
    // 处理数组类型的 children
    codeContent = extractCodeContent(props.children);
  } else if (typeof props.children === "string") {
    codeContent = props.children;
  }

  // 如果没有从 children 中找到，尝试从 className 中提取
  if (!language) {
    const languageMatch = className.match(/language-(\w+)/);
    language = languageMatch ? languageMatch[1] : undefined;
  }

  // 如果没有代码内容，尝试从 props.children 提取
  if (!codeContent) {
    codeContent = extractCodeContent(props.children);
  }

  const theme = props["data-theme"] || "default";

  // 调试信息（开发环境）
  if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
    if (language === "mermaid") {
      console.log("CustomPre: Detected mermaid code block", {
        language,
        codeContentLength: codeContent.length,
        codeContentPreview: codeContent.substring(0, 100),
        hasChildren: !!props.children,
        childrenType: typeof props.children,
        className,
      });
    }
  }

  // 如果是 mermaid 代码块，使用 Mermaid 组件渲染
  if (language === "mermaid" && codeContent.trim()) {
    return <Mermaid chart={codeContent.trim()} config={{ theme }} />;
  }

  // 其他代码块使用原来的 Pre 组件
  return <Pre>{props.children}</Pre>;
};

export default CustomPre;
