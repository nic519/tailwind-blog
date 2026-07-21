export const getBlogSlug = ({ abbrlink, sourceFileName }) =>
  abbrlink || sourceFileName.replace(/\.mdx?$/, '')

export const getBlogPath = (source) => `blog/${getBlogSlug(source)}`
