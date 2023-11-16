export function countWords(nodes: any[]) {
  let string = ''

  const paragraphs = nodes.filter((node) => node.type === 'paragraph')
  paragraphs.forEach((paragraph) => {
    paragraph.content?.forEach((child: any) => {
      if (child.type === 'text') {
        string += ` ${child.text}`
      }
    })
  })

  string = string.trim()

  if (string === '') {
    return 0
  }

  return string.split(/\s+/).length
}
