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
  <div
    class="absolute left-0 top-0 flex h-full w-full flex-col"
    @contextmenu="closeAll"
  >
    <TheNavigation class="sticky top-0 w-full shrink-0" />

    <main class="flex grow items-start justify-center overflow-y-scroll">
      <FileTreeWidget
        :active-file="activeFile"
        @set-active-file="setActiveFile"
      />

      <div class="flex flex-col">
        <template v-for="file in $editor.files" :key="file.id">
          <FileEditorWidget
            v-show="activeFile === file"
            :data="file.data"
            class="w-page grow"
            @instantiated="(editor) => (file.editor = editor)"
            @active="setActiveFile(file as TextFile)"
          />
        </template>
      </div>

      <ActionPanelWidget
        class="sticky top-sticky-widget h-fit w-action-panel"
        @run-prompt="onRunPrompt"
      />
    </main>

    <div class="flex shrink-0 justify-center overflow-y-scroll">
      <StatusBarWidget
        class="ml-52 mr-80 w-page shrink-0 px-5"
        v-if="activeEditor"
        :active-editor="activeEditor"
      />
    </div>
  </div>
</template>
