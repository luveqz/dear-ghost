import { Editor } from '@tiptap/core'

export type TextFileData = {
  title: string
  content: string
}

export type TextFile = {
  id: string
  editor?: Editor
  handle?: FileSystemFileHandle
  data: TextFileData
  isSaved?: boolean
}
