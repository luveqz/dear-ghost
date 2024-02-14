import { useEditorStore } from '@/stores/editor'
import { useLibraryStore } from '@/stores/library'
import { useLLMStore } from '@/stores/llm'
import { useModalStore } from '@/stores/modal'

export default defineNuxtPlugin(() => {
  const editor = useEditorStore()
  const library = useLibraryStore()
  const llm = useLLMStore()
  const modal = useModalStore()

  return {
    provide: {
      editor,
      library,
      llm,
      modal,
    },
  }
})
