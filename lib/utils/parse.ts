import { marked } from 'marked'
import TurndownService from 'turndown'

const turndownService = new TurndownService()

export function htmlToMarkdown(html: string) {
  return turndownService.turndown(html.replaceAll(/<p>\s*?<\/p>/g, '<br/>'))
}

export async function markdownToHtml(markdown: string) {
  return marked.parse(markdown.replace(/\n\s\s(?=\n)/g, '<p></p>'))
}
