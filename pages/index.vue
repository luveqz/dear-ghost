<script setup lang="ts">
import { appDataDir } from '@tauri-apps/api/path'
import { Command } from '@tauri-apps/api/shell'

import { useContextMenuTurn } from '@/componsables/context-menu-turn'
import { Prompt } from '@/lib/types/library'
import { ResponseMode } from '@/lib/types/library'
import { TemplateParser } from '@/lib/utils/template'
import { TextFile } from '@/lib/types/editor'
import { LLAMACPP_API_PORT, MISTRAL_7B_FILENAME } from '@/lib/constants'

const { $editor, $llm } = useNuxtApp()

const activeFile = computed(() => $editor.activeFile as TextFile)
const setActiveFile = (file: TextFile) => {
  $editor.activeFile = file
}
const controller = ref<AbortController>()

const { closeAll } = useContextMenuTurn()

const onRunPrompt = async (prompt: Prompt) => {
  if (!activeFile.value?.editor) return

  // 1. Parse template.
  const { selection } = activeFile.value?.editor.state
  const originEditor = activeFile.value?.editor
  const parsedPrompt = new TemplateParser(
    originEditor,
    selection,
  ).parseTemplate(prompt.template)

  // 2. Call LLM provider.
  originEditor.setEditable(false)
  await $llm.send({
    prompt: parsedPrompt,
    provider: prompt.providerId,
    model: prompt.modelId,
    selection: selection,
    controller,
    insertChunk(chunk, cursorIndex) {
      // 4. Show response.
      if (prompt.responseMode === ResponseMode.InsertBelow) {
        originEditor
          .chain()
          .focus()
          .insertContentAt(cursorIndex + (chunk === `\n` ? 1 : 0), chunk)
          .run()
      }

      if (prompt.responseMode === ResponseMode.ReplaceSelection) {
        originEditor
          .chain()
          .focus()
          .deleteSelection()
          .insertContentAt(selection.from, chunk)
          .run()
      }

      // 5. Prettify response.
      if (chunk.includes('\n')) {
        originEditor.commands.setContent(
          originEditor.getHTML().replace('\n', '</p><p>'),
        )
      }

      return {
        newCursorIndex: (cursorIndex +=
          chunk.length + (chunk === `\n` ? 1 : 0)),
      }
    },
  })
  originEditor.setEditable(true)
}

onMounted(async () => {
  $editor.load()
  setActiveFile($editor.files[0] as TextFile)

  const appDataDirPath = await appDataDir()

  const command = Command.sidecar('bin/llama-cpp-server', [
    '-m',
    `${appDataDirPath}models/${MISTRAL_7B_FILENAME}`,
    '-c',
    '4096',
    '--port',
    LLAMACPP_API_PORT,
  ])

  // Run Mistral 7B with LLaMA C++.
  await command.execute()
})
</script>

<template>
  <div
    class="absolute left-0 top-0 flex h-full w-full flex-col items-center"
    @contextmenu="closeAll"
  >
    <TheNavigation class="w-full shrink-0" />

    <main
      class="flex w-full grow items-start justify-center overflow-x-hidden overflow-y-scroll"
    >
      <div
        class="grid-template col-span-3 justify-end"
        style="grid-column-start: file-tree"
      >
        <FileTreeWidget
          class="shrink-0"
          :active-file="activeFile"
          @set-active-file="setActiveFile"
          style="grid-area: file-tree; direction: ltr"
        />

        <div
          class="flex w-page flex-col"
          style="grid-area: editor; direction: ltr"
        >
          <template v-for="file in $editor.files" :key="file.id">
            <FileEditorWidget
              v-show="activeFile?.id === file.id"
              :data="file.data"
              @instantiated="(editor) => (file.editor = editor)"
              @active="setActiveFile(file as TextFile)"
            />
          </template>
        </div>

        <ActionPanelWidget
          class="fixed h-[calc(100vh_-_1.8rem)] w-action-panel"
          style="grid-area: action-panel; direction: ltr"
          @run-prompt="onRunPrompt"
        />
      </div>
    </main>

    <div class="flex shrink-0 justify-center overflow-y-scroll">
      <StatusBarWidget
        class="ml-52 mr-80 w-page shrink-0 px-5"
        v-if="activeFile?.editor"
        :active-editor="activeFile?.editor"
        @stop-generation="controller?.abort()"
      />
    </div>
  </div>
</template>

<style scoped>
.grid-template {
  display: grid;
  grid-template-columns: [action-panel] 20rem [editor] 33.125rem [file-tree] 15rem;
  direction: rtl;
}
</style>
