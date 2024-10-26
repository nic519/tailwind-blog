export function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')  // 移除非单词字符（除了空格和连字符）
    .replace(/[\s_-]+/g, '-')  // 将空格、下划线和连字符替换为单个连字符
    .replace(/^-+|-+$/g, '');  // 移除开头和结尾的连字符
}
