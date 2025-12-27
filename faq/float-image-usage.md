# FloatImage 组件使用说明

`FloatImage` 是一个灵活的图片组件，支持多种布局方式。

## 技术实现

该组件使用**内联样式 + CSS 类**的混合方式实现浮动效果：

- **内联样式**：提供基础样式（宽度、圆角、边距等），确保样式不被覆盖
- **CSS 类 + 媒体查询**：在 `css/post.css` 中定义响应式浮动
  - 使用 `.float-image-left` 和 `.float-image-right` 类
  - 通过 `.prose` 选择器确保优先级高于 Typography 插件
  - 移动端（< 768px）：图片不浮动
  - 桌面端（≥ 768px）：图片浮动，文字环绕

这种方式避免了 Tailwind 的 `@tailwindcss/typography` 插件（prose 类）覆盖浮动样式的问题。

## 基本用法

### 1. 浮动布局（文字环绕）

**右侧浮动：**
```mdx
<FloatImage 
  src="https://example.com/image.jpg" 
  alt="图片描述" 
  align="right" 
  maxWidth={300}
/>

这是一段文字，图片会浮动在右侧，文字会自动环绕图片...
```

**左侧浮动：**
```mdx
<FloatImage 
  src="https://example.com/image.jpg" 
  alt="图片描述" 
  align="left" 
  maxWidth={250}
/>

这是一段文字，图片会浮动在左侧，文字会自动环绕图片...
```

### 2. 单独一行布局

**居中显示：**
```mdx
<FloatImage 
  src="https://example.com/image.jpg" 
  alt="图片描述" 
  align="center" 
  maxWidth={600}
/>
```

**靠左显示（不浮动）：**
```mdx
<FloatImage 
  src="https://example.com/image.jpg" 
  alt="图片描述" 
  align="block-left" 
  maxWidth={500}
/>
```

**靠右显示（不浮动）：**
```mdx
<FloatImage 
  src="https://example.com/image.jpg" 
  alt="图片描述" 
  align="block-right" 
  maxWidth={500}
/>
```

## 参数说明

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `src` | string | *必填* | 图片 URL |
| `alt` | string | *必填* | 图片描述 |
| `align` | string | `'right'` | 布局方式，见下表 |
| `maxWidth` | number | `400` | 最大宽度（px） |
| `keepMobileLayout` | boolean | `false` | 移动端是否保持布局 |

### align 参数详解

| 值 | 效果 | 桌面端 | 移动端（默认） |
|----|------|--------|----------------|
| `left` | 左浮动，文字环绕 | 浮动在左侧 | 图片与文字会在同一行 |
| `right` | 右浮动，文字环绕 | 浮动在右侧 | 图片与文字会在同一行 |
| `center` | 居中，单独一行 | 居中显示 | 居中显示 |
| `block-left` | 靠左，单独一行 | 靠左显示 | 靠左显示 |
| `block-right` | 靠右，单独一行 | 靠右显示 | 靠右显示 |

## 响应式设计

默认情况下（`keepMobileLayout={false}`）：
- **桌面端（≥ md）**：按 `align` 参数显示
- **移动端（< md）**：浮动布局（`left`/`right`）会自动变为单独一行

如果设置 `keepMobileLayout={true}`，则移动端也会保持指定的布局。

## 使用技巧

### 1. 文章配图（浮动）
适合在文章中插入小图，让文字环绕：

```mdx
<FloatImage 
  src="/images/example.jpg" 
  alt="示例图片" 
  align="right" 
  maxWidth={250}
/>

这里是正文内容，图片会浮动在右侧...
```

### 2. 重要图片（居中）
适合展示重要的大图：

```mdx
<FloatImage 
  src="/images/important.jpg" 
  alt="重要示意图" 
  align="center" 
  maxWidth={800}
/>
```

### 3. 对比图片
可以使用 `block-left` 和 `block-right` 实现左右对比：

```mdx
<FloatImage 
  src="/images/before.jpg" 
  alt="修改前" 
  align="block-left" 
  maxWidth={400}
/>

<FloatImage 
  src="/images/after.jpg" 
  alt="修改后" 
  align="block-right" 
  maxWidth={400}
/>
```

## 注意事项

1. **浮动布局后需要清除浮动**：在浮动图片后如果需要新的段落不受影响，可以添加空行或使用标题
2. **maxWidth 控制**：建议浮动图片使用较小的 `maxWidth`（200-400px），单独一行的图片可以使用更大的值
3. **移动端优化**：默认在移动端会自动取消浮动，确保更好的阅读体验
4. **alt 文本**：务必提供有意义的 alt 文本，提升可访问性

## 完整示例

```mdx
## 我的文章标题

<FloatImage 
  src="https://example.com/portrait.jpg" 
  alt="人物肖像" 
  align="right" 
  maxWidth={200}
/>

这是文章的开头，我插入了一张右侧浮动的肖像图。文字会自动环绕图片，
创造出杂志排版般的效果。

这是第二段文字，依然会环绕图片...

## 下一个小节

<FloatImage 
  src="https://example.com/diagram.jpg" 
  alt="系统架构图" 
  align="center" 
  maxWidth={700}
/>

这里我插入了一张居中的大图，用来展示系统架构...
```

