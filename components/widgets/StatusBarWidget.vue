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
    class="sticky bottom-0 flex h-12 items-center justify-between bg-white text-sm"
  >
    <div class="flex items-center gap-1">
      <template v-if="$llm.running">
        <LoadingIcon class="h-4 text-orange-500" />
        Running model...
      </template>
    </div>

    <button v-if="activeEditor" class="flex items-end">
      {{ countWords(activeEditor.state.doc.content.toJSON()) }}
      words

      <CornerTriangleIcon class="text-orange-500" />
    </button>
  </aside>
</template>
