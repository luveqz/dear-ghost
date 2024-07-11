import { Editor } from '@tiptap/core'
import type { defaultConfig } from '@/lib/constants'

export type UserConfig = typeof defaultConfig

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
