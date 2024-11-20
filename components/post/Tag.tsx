import Link from 'next/link'
import { slug } from 'github-slugger'

interface Props {
  text: string
}



// 同时导出颜色数组以便外部使用
export const colors = [
  // 原有的浅色系
  '#FECACA', // 浅红
  '#BFDBFE', // 浅蓝
  '#BBF7D0', // 浅绿
  '#FEF08A', // 浅黄
  '#E9D5FF', // 浅紫
  '#FBCFE8', // 浅粉
  // 原有的深色系
  '#202022',  // 深灰黑
  '#0F263D',  // 深海蓝
  '#572A34',  // 深酒红
  '#572106',  // 深赭石
  '#5E3D16',  // 深棕褐
  '#575241',  // 深橄榄
  '#3A4A57',  // 深青灰
  '#294D30',  // 深森绿
  '#30165C',  // 深紫罗兰
  '#421637',  // 深莓红
  '#043642',  // 深青蓝
  '#4B4661',  // 深灰紫
  '#614C45',  // 深赭棕
  '#213947',  // 深靛青
  '#345759',  // 深青绿
  // 新增的深色系
  '#2C3E50', // 深蓝灰
  '#34495E', // 深青灰
  '#7B241C', // 深红褐
  '#1B4F72', // 深蓝 
  '#4A235A', // 深紫
  '#512E5F', // 深紫红
  '#154360', // 深靛蓝
  '#641E16', // 深红
  '#78281F', // 深红棕
  '#4A235A', // 深紫
  '#1B2631', // 深灰蓝
  '#17202A', // 近黑蓝
  '#7E5109', // 深褐
  '#784212', // 深棕
  // 新增的中间色
  '#5D6D7E', // 中灰蓝
  '#566573', // 中灰
  '#5499C7', // 中蓝
  '#48C9B0', // 青绿
  '#52BE80', // 中绿
  '#E74C3C', // 鲜红
  '#EB984E', // 橙色
  '#F4D03F', // 金黄 
  '#CD6155', // 红褐
  '#45B39D', // 青色
  '#AF7AC5', // 淡紫
  '#EC7063', // 珊瑚红
  '#A04000'  // 赤褐
]

/**
 * 确定性：相同的输入总是产生相同的输出
 * 分布性：不同的输入会产生分散的输出
 * 高效性：计算速度快
 * 可预测性：便于调试和维护
 * @param tagText 
 * @returns 
 */ 
export const getRandomColor = (text: string) => {
  const limitChars = text.slice(-7)
  const hash = limitChars.split('').reduce((acc, char) => {
    return char.charCodeAt(0) + ((acc << 5) - acc)
  }, 0)
  
  const color = colors[Math.abs(hash) % colors.length]
  return color
}

const Tag = ({ text }: Props) => {
  return (
    <Link
      href={`/tags/${slug(text)}`}
      className={`mr-3 text-sm font-medium uppercase px-2 py-1 rounded-lg hover:opacity-80`}
      style={{ 
        backgroundColor: getRandomColor(text),
        color: colors.indexOf(getRandomColor(text)) < 6 ? '#1F2937' : '#FFFFFF' // 浅色背景用深色文字，深色背景用浅色文字
      }}
    >
      # {text.split(' ').join('-')}
    </Link>
  )
}

export default Tag
