export const gradients = {
    sunset: 'bg-gradient-to-r from-orange-300 via-amber-400 to-yellow-500',
    ocean: 'bg-gradient-to-r from-green-300 via-blue-500 to-purple-600',
    berry: 'bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-400',
    mint: 'bg-gradient-to-r from-lime-200 via-teal-300 to-cyan-400',
    rose: 'bg-gradient-to-r from-red-200 via-red-300 to-yellow-200',
  } as const;
  
  export function getGradientByIcon(icon: string): keyof typeof gradients {
    const gradientNames = Object.keys(gradients);
    // 使用图标名称生成哈希来确定性地选择背景
    const hash = Array.from(icon).reduce((acc, char) => char.charCodeAt(0) + acc, 0);
    return gradientNames[hash % gradientNames.length] as keyof typeof gradients;
  }