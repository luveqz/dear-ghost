<script setup lang="ts">
import { VueDraggable } from 'vue-draggable-plus'
import type { TextFile } from '@/lib/types/editor'

defineProps({
  activeFile: {
    type: Object as PropType<TextFile>,
    required: false,
  },
})

const emit = defineEmits(['set-active-file'])
const { $editor, $modal } = useNuxtApp()

const onRemoveFile = (file: TextFile) => {
  const fileIndex = $editor.files.findIndex((file_) => file_.id === file.id)
  $editor.removeFile(file)

  const count = $editor.files.length
  emit('set-active-file', $editor.files[(count + fileIndex) % count])

  if ($editor.files.length === 0) {
    $editor.addFile()
  }
}

const onClose = (file: TextFile) => {
  if (file.isSaved) {
    onRemoveFile(file)
  } else {
    $modal.open('confirm-close-file', () => onRemoveFile(file))
  }
}

const fileListRef = ref<HTMLElement>()
</script>

<template>
  <ul ref="fileListRef" class="flex flex-col">
    <VueDraggable
      ref="el"
      v-model="$editor.files"
      :clone="toRaw"
      @sort="$editor.saveFileTreeOrder"
    >
      <li
        v-for="file in $editor.files"
        :key="file.id"
        class="group/item flex cursor-pointer items-center gap-2.5 rounded px-2 py-1.5"
        :class="{ 'bg-orange-gray-900/5': activeFile === file }"
        @click="$emit('set-active-file', file)"
      >
        <TextIcon class="file-handle h-4 w-4 shrink-0 cursor-move opacity-60" />
        <span
          class="mt-[0.188rem] line-clamp-3 block grow text-sm leading-none"
        >
          <span class="line-clamp-2">
            {{ file.data.title }}
          </span>
        </span>

        <button
          class="relative flex h-4 w-4 items-center justify-center rounded-md transition-colors duration-150 hover:bg-orange-gray-900/5"
          @click.stop="onClose(file as TextFile)"
        >
          <div
            v-if="!file.isSaved"
            class="absolute h-2 w-2 rounded-full bg-black/40 transition-opacity delay-75 duration-150 group-hover/item:opacity-0"
          />
          <CloseIcon
            class="h-[0.45rem] w-[0.45rem] opacity-0 transition-opacity delay-75 duration-150 group-hover/item:opacity-100"
          />
        </button>
      </li>
    </VueDraggable>

    <button
      class="mt-3 rounded border border-black/15 py-2 text-center text-sm font-medium leading-none"
      @click="$editor.addFile"
    >
      New file
    </button>
  </ul>
</template>
