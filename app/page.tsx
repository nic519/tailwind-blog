import { allCoreContent } from 'pliny/utils/contentlayer'
import { articleCatalog } from '@/lib/articles/siteCatalog'
import Home2 from './Main2'

export default async function Page() {
  const posts = allCoreContent(articleCatalog.all())
  return <Home2 posts={posts} />
}
