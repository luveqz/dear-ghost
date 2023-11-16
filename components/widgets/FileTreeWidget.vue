<script setup lang="ts">
import { TextFile } from '@/lib/types/editor'

defineProps({
  activeFile: {
    type: Object as PropType<TextFile>,
    required: false,
  },
})

defineEmits(['set-active-file'])
</script>

<template>
  <ul class="sticky top-sticky-widget mr-16 flex h-fit w-36 flex-col gap-y-3">
    <li
      v-for="file in $editor.files"
      :key="file.id"
      class="flex cursor-pointer items-center gap-2.5"
      @click="$emit('set-active-file', file)"
    >
      <TextIcon class="h-3.5 w-3.5 opacity-60" />
      <span
        class="mt-[0.188rem] block text-sm leading-none"
        :class="activeFile === file ? 'font-bold' : 'font-medium'"
      >
        {{ file.data.title }}
      </span>
    </li>
  </ul>
</template>
