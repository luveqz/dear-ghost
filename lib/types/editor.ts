import { Editor } from '@tiptap/vue-3'

export type TextFileData = {
  title: string
  content: string
}

export type TextFile = {
  id: number
  editor?: Editor
  data: TextFileData
}
