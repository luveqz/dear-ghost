<script setup lang="ts">
import { Editor } from '@tiptap/core'
import { countWords } from '@/lib/utils/string'

defineProps({
  activeEditor: {
    type: Object as PropType<Editor>,
    required: true,
  },
})
</script>

<template>
  <aside
    class="sticky bottom-0 flex h-12 items-center justify-end bg-white text-sm"
  >
    <button v-if="activeEditor" class="flex items-end">
      {{ countWords(activeEditor.state.doc.content.toJSON()) }}
      words

      <CornerTriangleIcon class="text-orange-500" />
    </button>
  </aside>
</template>
