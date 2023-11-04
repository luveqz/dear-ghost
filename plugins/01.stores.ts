import { useEditorStore } from '@/stores/editor'
import { useLibraryStore } from '@/stores/library'

export default defineNuxtPlugin(() => {
  const editor = useEditorStore()
  const library = useLibraryStore()

  return {
    provide: {
      editor,
      library,
    },
  }
})
