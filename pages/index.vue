<script setup lang="ts">
import { useContextMenuTurn } from '@/componsables/context-menu-turn'
import { Prompt } from '@/lib/types/library'
import { getLastItem } from '@/lib/utils/array'
import { ResponseMode } from '@/lib/types/library'
import { TemplateParser } from '@/lib/utils/template'
import { TextFile } from '@/lib/types/editor'
import { stringToHTMLParagraphs } from '@/lib/utils/string'

const { $editor, $llm } = useNuxtApp()

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

const activeFile = ref<TextFile>()
const setActiveFile = (file: TextFile) => {
  activeFile.value = file
}
const activeEditor = computed(() => activeFile.value?.editor)

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
    provider: prompt.providerId,
    model: prompt.modelId,
  })

  // 3. Prettify response.
  const prettifiedResponse = stringToHTMLParagraphs(response)

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
  activeFile.value = $editor.files[0]
})
</script>

<template>
  <div class="absolute left-0 top-0 h-full w-full" @contextmenu="closeAll">
    <TheNavigation class="fixed left-0 top-0 z-20 w-full" />

    <div
      class="fixed left-0 top-0.5 z-10 h-sticky-widget w-full shrink-0 bg-white"
    />

    <main class="mt-sticky-widget flex min-h-full justify-center">
      <FileTreeWidget
        :active-file="activeFile"
        @set-active-file="setActiveFile"
      />

      <div>
        <template v-for="file in $editor.files" :key="file.id">
          <FileEditorWidget
            v-show="activeFile === file"
            :data="file.data"
            class="h-full w-page"
            @instantiated="(editor) => (file.editor = editor)"
            @active="(editor) => (activeEditor = editor)"
          />
        </template>

        <StatusBarWidget v-if="activeEditor" :active-editor="activeEditor" />
      </div>

      <ActionPanelWidget
        class="sticky top-sticky-widget h-fit w-action-panel"
        @run-prompt="onRunPrompt"
      />
    </main>
  </div>
</template>
