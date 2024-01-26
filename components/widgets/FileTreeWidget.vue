<script setup lang="ts">
import type { TextFile } from '@/lib/types/editor'

defineProps({
  activeFile: {
    type: Object as PropType<TextFile>,
    required: false,
  },
})

const emit = defineEmits(['set-active-file'])
const { $editor } = useNuxtApp()

const onRemoveFile = (file: TextFile) => {
  const fileIndex = $editor.files.findIndex((file_) => file_.id === file.id)
  $editor.removeFile(file)

  const count = $editor.files.length
  emit('set-active-file', $editor.files[(count + fileIndex) % count])

  if ($editor.files.length === 0) {
    $editor.addFile()
  }
}
</script>

<template>
  <ul class="flex flex-col">
    <li
      v-for="file in $editor.files"
      :key="file.id"
      class="group/item flex cursor-pointer items-center gap-2.5 rounded px-2 py-1.5"
      :class="{ 'bg-orange-gray-900/5': activeFile === file }"
      @click="$emit('set-active-file', file)"
    >
      <TextIcon class="h-4 w-4 shrink-0 opacity-60" />
      <span class="mt-[0.188rem] line-clamp-3 block grow text-sm leading-none">
        <span class="line-clamp-2">
          {{ file.data.title }}
        </span>
      </span>

      <button
        class="flex h-4 w-4 items-center justify-center rounded-md transition-colors duration-150 hover:bg-orange-gray-900/5"
        @click.stop="onRemoveFile(file as TextFile)"
      >
        <CloseIcon
          class="h-[0.45rem] w-[0.45rem] opacity-0 transition-opacity delay-75 duration-150 group-hover/item:opacity-100"
        />
      </button>
    </li>

    <button
      class="mt-3 rounded border border-black/15 py-2 text-center text-sm font-medium leading-none"
      @click="$editor.addFile"
    >
      New file
    </button>
  </ul>
</template>
