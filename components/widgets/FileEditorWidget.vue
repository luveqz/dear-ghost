<script setup lang="ts">
import { useEditor, EditorContent } from '@tiptap/vue-3'
import Document from '@tiptap/extension-document'
import Paragraph from '@tiptap/extension-paragraph'
import Text from '@tiptap/extension-text'
import History from '@tiptap/extension-history'
import Placeholder from '@tiptap/extension-placeholder'
import Typography from '@tiptap/extension-typography'
import Bold from '@tiptap/extension-bold'
import Underline from '@tiptap/extension-underline'
import Strike from '@tiptap/extension-strike'
import Italic from '@tiptap/extension-italic'

import type { TextFileData } from '@/lib/types/editor'

const props = defineProps({
  data: {
    type: Object as PropType<TextFileData>,
    required: true,
  },
})

const emit = defineEmits(['instantiated', 'active'])

const { $editor } = useNuxtApp()

const editor = useEditor({
  content: props.data.content,
  extensions: [
    Document,
    Paragraph,
    Text,
    History,
    Typography,
    Bold.configure({
      HTMLAttributes: {
        class: 'font-bold',
      },
    }),
    Underline.configure({
      HTMLAttributes: {
        class: 'underline',
      },
    }),
    Italic.configure({
      HTMLAttributes: {
        class: 'italic',
      },
    }),
    Strike.configure({
      HTMLAttributes: {
        class: 'line-through',
      },
    }),
    Placeholder.configure({
      placeholder: 'A gripping opening line...',
    }),
  ],
  editorProps: {
    attributes: {
      class: 'h-full bg-white focus:outline-none rounded-md grow flex flex-col',
    },
  },
  onUpdate() {
    if (!editor.value) return
    props.data.content = editor.value.getHTML()
    $editor.save()
  },
  onFocus() {
    emit('active', editor.value)
  },
})

watch(
  () => props.data.content,
  (value) => {
    if (!editor.value) return

    const isSame = editor.value.getHTML() === value

    if (isSame) {
      return
    }

    editor.value.commands.setContent(value, false)
  },
)

onMounted(() => {
  if (editor.value) {
    emit('instantiated', editor.value)
  }
})

onBeforeUnmount(() => {
  editor.value?.destroy()
})
</script>

<template>
  <div class="relative grow pb-9">
    <div v-if="$llm.running" class="absolute z-50 h-full w-full" />
    <FileEditorTitleField
      class="top-0 px-5 pt-sticky-widget"
      :class="{ sticky: $editor.config.view.stickyTitle }"
      v-model="data.title"
    />

    <section class="grow px-5 pt-4">
      <editor-content
        :editor="editor"
        class="flex flex-col font-medium"
        :class="{ 'indentation-toggle': $editor.config.view.indent }"
      />
    </section>
  </div>
</template>
