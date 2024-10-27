import { visit } from 'unist-util-visit'

export default function remarkNumberedHeadings() {
  return (tree) => {
    visit(tree, 'heading', (node) => {
      if (node.children && node.children[0].type === 'text') {
        const text = node.children[0].value
        const match = text.match(/^(\d+\.\s)(.*)/)
        if (match) {
          node.children = [
            {
              type: 'mdxJsxFlowElement',
              name: 'span',
              attributes: [
                { type: 'mdxJsxAttribute', name: 'className', value: 'text-primary-500 font-bold' }
              ],
              children: [{ type: 'text', value: match[1] }]
            },
            { type: 'text', value: match[2] }
          ]
        }
      }
    })
  }
}
