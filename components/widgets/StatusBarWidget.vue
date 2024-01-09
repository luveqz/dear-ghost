<script setup lang="ts">
import { Editor } from '@tiptap/core'
import { countWords } from '@/lib/utils/string'

defineProps({
  activeEditor: {
    type: Object as PropType<Editor>,
    required: true,
  },
})

defineEmits(['stop-generation'])
</script>

<template>
  <aside class="flex h-[2.6rem] items-center justify-between bg-white text-sm">
    <div class="flex items-center gap-1">
      <template v-if="$llm.running">
        <LoadingIcon class="h-4 text-orange-500" />
        Running model...
        <button
          class="rounded border border-black/15 px-2 text-xs"
          @click="$emit('stop-generation')"
          >Stop</button
        >
      </template>
    </div>

    <button v-if="activeEditor" class="flex items-end">
      {{ countWords(activeEditor.state.doc.content.toJSON()) }}
      words

      <CornerTriangleIcon class="text-orange-500" />
    </button>
  </aside>
</template>
