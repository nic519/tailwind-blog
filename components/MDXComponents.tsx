import TOCInline from 'pliny/ui/TOCInline'
import BlogNewsletterForm from 'pliny/ui/BlogNewsletterForm'
import type { MDXComponents } from 'mdx/types'
import Image from './Image'
import CustomLink from './Link'
import TableWrapper from './TableWrapper'
import CustomPre from './CustomPre'
import FloatImage from './FloatImage'

export const components: MDXComponents = {
  Image,
  FloatImage,
  TOCInline,
  a: CustomLink,
  pre: CustomPre,
  table: TableWrapper,
  BlogNewsletterForm,
}
