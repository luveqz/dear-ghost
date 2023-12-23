<script setup lang="ts">
import { TextFile } from '@/lib/types/editor'

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
  emit('set-active-file', $editor.files[fileIndex - 1])
  $editor.removeFile(file)
}
</script>

<template>
  <ul class="sticky top-sticky-widget mr-16 flex h-fit w-36 flex-col gap-y-3">
    <li
      v-for="file in $editor.files"
      :key="file.id"
      class="group/item flex cursor-pointer items-center gap-2.5"
      @click="$emit('set-active-file', file)"
    >
      <TextIcon class="h-3.5 w-3.5 shrink-0 opacity-60" />
      <span
        class="mt-[0.188rem] line-clamp-3 block grow text-sm leading-none"
        :class="activeFile === file ? 'font-bold' : 'font-medium'"
      >
        <span class="line-clamp-2">
          {{ file.data.title }}
        </span>
      </span>

      <button
        class="flex h-4 w-4 items-center justify-center rounded-md transition-colors duration-150 hover:bg-orange-gray-900/5"
        @click.stop="onRemoveFile(file)"
      >
        <CloseIcon
          class="h-[0.45rem] w-[0.45rem] opacity-0 transition-opacity delay-75 duration-150 group-hover/item:opacity-100"
        />
      </button>
    </li>

    <button
      class="rounded-md bg-orange-gray-900/5 py-2 text-center text-sm font-medium leading-none"
      @click="$editor.addFile"
    >
      New file
    </button>
  </ul>
</template>
