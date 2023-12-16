import { useEditorStore } from '@/stores/editor'
import { useLibraryStore } from '@/stores/library'
import { useLLMStore } from '@/stores/llm'

export default defineNuxtPlugin(() => {
  const editor = useEditorStore()
  const library = useLibraryStore()
  const llm = useLLMStore()

  return {
    provide: {
      editor,
      library,
      llm,
    },
  }
})
