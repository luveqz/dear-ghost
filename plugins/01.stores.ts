import { useEditorStore } from '@/stores/editor'

export default defineNuxtPlugin(() => {
  const editor = useEditorStore()

  return {
    provide: {
      editor,
    },
  }
})
