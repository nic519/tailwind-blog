export function generateUniqueId(...args: string[]): string {
  // 过滤掉空值并拼接所有参数
  const path = args
    .filter(arg => arg && typeof arg === 'string')
    .join('/')
    .toLowerCase()
    
  // 使用路径生成唯一ID
  return path
    .normalize('NFD')                      // 分解音标符号
    .replace(/[\u0300-\u036f]/g, '')      // 移除变音符号
    .replace(/[^a-z0-9\u4e00-\u9fa5/\s-]/g, '')  // 保留中文、字母、数字、斜杠
    .trim()                               // 移除首尾空格
    .replace(/\s+/g, '-')                 // 空格替换为连字符
    .replace(/-+/g, '-')                  // 多个连字符替换为单个
}
