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
  const parser = new TemplateParser(originEditor, selection)
  const parsedPrompt = parser.parseTemplate(prompt.template)

  if (parser.errors) {
    return
  }

  // 2. Call LLM provider.
  originEditor.setEditable(false)
  await $llm.send({
    prompt: parsedPrompt,
    provider: prompt.providerId,
    model: prompt.modelId,
    controller,
    insertChunk(chunk) {
      // 4. Show response.
      const selection = originEditor.state.selection
      if (prompt.responseMode === ResponseMode.InsertBelow) {
        originEditor
          .chain()
          .focus()
          .insertContentAt(
            selection.to,
            chunk.includes('\n') ? { type: 'paragraph' } : chunk,
            {
              updateSelection: true,
            },
          )
          .run()
      }

      if (prompt.responseMode === ResponseMode.ReplaceSelection) {
        originEditor
          .chain()
          .focus()
          .deleteSelection()
          .insertContentAt(
            selection.from,
            chunk.includes('\n') ? { type: 'paragraph' } : chunk,
            {
              updateSelection: true,
            },
          )
          .run()
      }
    },
  })
  originEditor.setEditable(true)
}

const layoutStyle = computed(() => {
  return {
    'grid-template-columns': `${
      $editor.view.actionPanel ? '[action-panel] 20rem' : ''
    }  [editor] 33.125rem ${$editor.view.fileTree ? '[file-tree] 15rem' : ''}`,
  }
})

onMounted(async () => {
  $editor.load()
  setActiveFile($editor.files[0] as TextFile)

  if ('__TAURI__' in window && window.__TAURI__) {
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
  }
})

const keys = useMagicKeys()
whenever(keys['escape'], () => {
  controller.value?.abort()
})
</script>

<template>
  <div
    class="absolute left-0 top-0 flex h-full w-full flex-col items-center"
    @contextmenu="closeAll"
  >
    <TheNavigation class="w-full shrink-0" />

    <main
      class="mr-2 mt-sticky-widget flex w-full grow items-start justify-center overflow-x-hidden overflow-y-scroll"
      :class="{
        'lg:pr-[8%]': $editor.view.fileTree && !$editor.view.actionPanel,
      }"
    >
      <div class="grid-template justify-end" :style="layoutStyle">
        <FileTreeWidget
          v-if="$editor.view.fileTree"
          class="sticky top-0 h-[calc(100vh_-_4rem_-_2.6rem)] shrink-0 pr-16"
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

        <!--
          Filler div (prevents the editor from getting
          focused while clicking outside of it).
        -->
        <div
          class="sticky top-0 h-[calc(100vh_-_4rem_-_2.6rem)]"
          style="grid-area: action-panel"
        />

        <ActionPanelWidget
          v-if="$editor.view.actionPanel"
          class="fixed h-[calc(100vh_-_2rem_-_2rem)] w-action-panel"
          style="grid-area: action-panel; direction: ltr"
          @run-prompt="onRunPrompt"
        />
      </div>
    </main>

    <div class="mr-2 flex w-full shrink-0 justify-center overflow-y-scroll">
      <div class="grid-template overflow-x-hidden" :style="layoutStyle">
        <StatusBarWidget
          class="px-5"
          style="grid-area: editor; direction: ltr"
          v-if="activeFile?.editor"
          :active-editor="activeFile?.editor"
          @stop-generation="controller?.abort()"
        />
      </div>
    </div>

    <TheToastDisplay />
  </div>
</template>

<style scoped>
.grid-template {
  display: grid;
  direction: rtl;
}
</style>
