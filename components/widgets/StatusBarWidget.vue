<script setup lang="ts">
import { Editor } from '@tiptap/core'
import { countWords } from '@/lib/utils/string'
import { useStatusBarMessage } from '@/componsables/status-bar'

defineProps({
  activeEditor: {
    type: Object as PropType<Editor>,
    required: true,
  },
})

const { message } = useStatusBarMessage()

defineEmits(['stop-generation'])
</script>

<template>
  <aside class="flex h-[2.6rem] items-center justify-between bg-white text-sm">
    <div class="flex items-center gap-1">
      <template v-if="message">
        <LoadingIcon v-if="$llm.running" class="h-4 text-orange-500" />

        {{ message }}

        <button
          v-if="$llm.running"
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
