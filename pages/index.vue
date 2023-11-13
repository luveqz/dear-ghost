<script setup lang="ts">
import { Editor } from '@tiptap/core'

import { useContextMenuTurn } from '@/componsables/context-menu-turn'
import { Prompt } from '@/lib/types/library'
import { getLastItem } from '@/lib/utils/array'
import { GoogleModel, LLMProvider } from '@/plugins/02.llm'
import { ResponseMode } from '@/lib/types/library'
import { TemplateParser } from '@/lib/utils/template'

const { $editor, $llm } = useNuxtApp()
const activeEditor = ref<Editor | undefined>()

const addPage = () => {
  $editor.widgets.push({
    id: getLastItem($editor.widgets).id + 1,
    component: 'PageWidget',
    data: {
      title: 'Untitled',
      content: '',
    },
    config: {
      classes: 'w-page',
    },
  })
  $editor.save()
}

const removePage = (id: number) => {
  $editor.widgets = $editor.widgets.filter((column) => column.id !== id)
  $editor.save()
}

const { closeAll } = useContextMenuTurn()

const onRunPrompt = async (prompt: Prompt) => {
  if (!activeEditor.value) return

  // 1. Parse template.
  const { selection } = activeEditor.value.state
  const originEditor = activeEditor.value
  const parsedPrompt = new TemplateParser(
    originEditor,
    selection,
  ).parseTemplate(prompt.template)

  // 2. Call LLM provider.
  const response = await $llm.send({
    prompt: parsedPrompt,
    provider: LLMProvider.Google,
    model: GoogleModel.Palm2TextBison,
  })

  // 3. Prettify response.
  const prettifiedResponse = `<p>${response}</p>`

  // 4. Show response.
  if (prompt.responseMode === ResponseMode.InsertBelow) {
    originEditor
      .chain()
      .focus()
      .insertContentAt(selection.to, prettifiedResponse)
      .run()
  }

  if (prompt.responseMode === ResponseMode.ReplaceSelection) {
    originEditor
      .chain()
      .focus()
      .deleteSelection()
      .insertContentAt(selection.from, prettifiedResponse)
      .run()
  }
}

onMounted(() => {
  $editor.load()
})
</script>

<template>
  <div class="absolute left-0 top-0 h-full w-full" @contextmenu="closeAll">
    <TheNavigation class="fixed left-0 top-0 z-20 w-full" />

    <div
      class="fixed left-0 top-0.5 z-10 h-sticky-widget w-full shrink-0 bg-white"
    />

    <main class="mt-sticky-widget flex justify-center">
      <FileEditorWidget
        v-for="file in $editor.files"
        :key="file.id"
        :data="file.data"
        class="h-full w-page"
        @instantiated="(editor) => (file.editor = editor)"
        @active="(editor) => (activeEditor = editor)"
      />

      <ActionPanelWidget
        class="sticky top-sticky-widget h-fit w-action-panel"
        @run-prompt="onRunPrompt"
      />
    </main>
  </div>
</template>
