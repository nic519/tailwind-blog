import Link from 'next/link'
import { slug } from 'github-slugger'

interface Props {
  text: string
}

const Tag = ({ text }: Props) => {
  const getColorForTag = (tagText: string) => {
    const colors = ['bg-red-200', 'bg-blue-200', 'bg-green-200', 'bg-yellow-200', 'bg-purple-200', 'bg-pink-200'];
    const hash = tagText.split('').reduce((acc, char) => {
      return char.charCodeAt(0) + ((acc << 5) - acc);
    }, 0);
    return colors[Math.abs(hash) % colors.length];
  }

  return (
    <Link
      href={`/tags/${slug(text)}`}
      className={`mr-3 text-sm font-medium uppercase text-primary-800 hover:text-primary-900 
        dark:text-primary-800 dark:hover:text-primary-900 px-2 py-1 rounded-lg ${getColorForTag(text)}`}
    >
      # {text.split(' ').join('-')}
    </Link>
  )
}

export default Tag
