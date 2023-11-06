<script setup lang="ts">
import { useEditor, EditorContent } from '@tiptap/vue-3'
import Document from '@tiptap/extension-document'
import Paragraph from '@tiptap/extension-paragraph'
import Text from '@tiptap/extension-text'
import Placeholder from '@tiptap/extension-placeholder'
import Typography from '@tiptap/extension-typography'
import Bold from '@tiptap/extension-bold'
import Underline from '@tiptap/extension-underline'
import Strike from '@tiptap/extension-strike'
import Italic from '@tiptap/extension-italic'

import { PageObject } from '@/lib/types/editor'

const props = defineProps({
  page: {
    type: Object as PropType<PageObject>,
    required: true,
  },
})

const editor = useEditor({
  content: props.page.content,
  extensions: [
    Document,
    Paragraph,
    Text,
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
    props.page.content = editor.value.getHTML()
    $editor.save()
  },
})

const { $editor } = useNuxtApp()

watch(() => props.page.title, $editor.save)
watch(
  () => props.page.content,
  (value) => {
    if (!editor.value) return

    const isSame = editor.value.getHTML() === value

    if (isSame) {
      return
    }

    editor.value.commands.setContent(value, false)
  },
)
</script>

<template>
  <div class="relative px-5 pb-9">
    <h2
      class="sticky top-sticky-widget z-10 flex items-center gap-2 bg-white pb-1 pt-2 text-xl font-bold leading-none"
    >
      <span class="block h-[1.125rem] w-2 rounded-sm bg-orange-500" />
      <input class="w-fit bg-white" v-model="page.title" />
    </h2>

    <section class="pt-4 indent-5">
      <editor-content
        :editor="editor"
        class="flex h-full grow flex-col indent-0 font-medium"
      />
    </section>
  </div>
</template>
