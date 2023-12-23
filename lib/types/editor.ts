import { Editor } from '@tiptap/core'

export type TextFileData = {
  title: string
  content: string
}

export type TextFile = {
  id: number
  editor?: Editor
  data: TextFileData
}
