<script setup lang="ts">
import { useContextMenuTurn } from '@/composables/context-menu-turn'
import { TemplateParser } from '@/lib/utils/template'
import type { Prompt } from '@/lib/types/library'
import type { TextFile } from '@/lib/types/editor'

const { $editor, $library, $llm } = useNuxtApp()

const activeFile = computed(() => $editor.activeFile as TextFile)
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
  const isSaved = activeFile.value.isSaved
  originEditor.setEditable(false)
  activeFile.value.isSaved = isSaved

  await $llm.send({
    prompt: parsedPrompt,
    provider: prompt.providerId,
    model: prompt.modelId,
    controller,
    insertChunk(chunk) {
      // 3. Insert response chunk.
      chunk.split(/(\n)/).forEach((segment) => {
        const selection = originEditor.state.selection
        originEditor
          .chain()
          .focus()
          .insertContentAt(
            selection.to,
            segment === '\n' ? { type: 'paragraph' } : segment,
            {
              updateSelection: true,
            },
          )
          .run()
      })
    },
  })

  const wasSaved = activeFile.value.isSaved
  originEditor.setEditable(true)
  activeFile.value.isSaved = wasSaved
}

const layoutStyle = computed(() => {
  return {
    'grid-template-columns': `${
      $editor.config.view.actionPanel ? '[action-panel] 17.5rem' : ''
    }  [editor] 33.125rem ${
      $editor.config.view.fileTree ? '[file-tree] 15rem' : ''
    }`,
  }
})

onMounted(() => {
  $editor.load()
  $library.load()
})

const keys = useMagicKeys()
whenever(keys['escape'], () => {
  controller.value?.abort()
})

whenever(
  () => activeFile.value,
  () => {
    useHead({
      title: `${activeFile.value.data.title} -  Dear Ghost`,
    })
  },
)

/*----------------------------------------
  Prevent closing the tab with unsaved
  changes.
----------------------------------------*/
const beforeUnloadHandler = (event: Event) => {
  const unsaved = $editor.files.find((file) => file.handle && !file.isSaved)
  if (unsaved) {
    $editor.activeFile = unsaved

    // Recommended
    event.preventDefault()

    // Included for legacy support, e.g. Chrome/Edge < 119
    event.returnValue = true
  }
}

onMounted(() => {
  document.addEventListener('DOMContentLoaded', (event) => {
    // we can move only if we are not in a browser's tab
    const isBrowser = matchMedia('(display-mode: browser)').matches
    if (!isBrowser) {
      window.moveTo(16, 16)
      window.resizeTo(980, 600)
    }
  })

  window.addEventListener('beforeunload', beforeUnloadHandler)
})

onBeforeUnmount(() => {
  window.removeEventListener('beforeunload', beforeUnloadHandler)
})
</script>

<template>
  <div
    class="absolute left-0 top-0 flex h-full w-full flex-col items-center"
    @contextmenu="closeAll"
  >
    <TheNavigation class="w-full shrink-0" />

    <main
      v-show="!$editor.loading"
      class="mr-2 flex w-full grow items-start justify-center overflow-x-hidden overflow-y-scroll"
      :class="{
        'lg:pr-[8%]':
          $editor.config.view.fileTree && !$editor.config.view.actionPanel,
      }"
    >
      <div class="grid-template justify-end" :style="layoutStyle">
        <FileTreeWidget
          v-if="$editor.config.view.fileTree"
          class="sticky top-sticky-widget mt-sticky-widget h-[calc(100vh_-_4rem_-_2.6rem)] shrink-0 pr-10"
          :active-file="activeFile"
          @set-active-file="$editor.setActiveFile"
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
              @active="$editor.setActiveFile(file as TextFile)"
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
          v-if="$editor.config.view.actionPanel"
          class="fixed mt-sticky-widget h-[calc(100vh_-_2rem_-_2rem)] w-action-panel"
          style="grid-area: action-panel; direction: ltr"
          @run-prompt="onRunPrompt"
        />
      </div>
    </main>

    <div
      class="mr-2 flex w-full shrink-0 justify-center overflow-y-scroll"
      :class="{
        'lg:pr-[8%]':
          $editor.config.view.fileTree && !$editor.config.view.actionPanel,
      }"
    >
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

    <!-- Modals -->
    <BaseModal name="confirm-read-permission">
      <ConfirmReadPermissionDialog />
    </BaseModal>

    <BaseModal name="confirm-close-file">
      <ConfirmCloseFileDialog />
    </BaseModal>

    <BaseModal name="confirm-remove-prompt">
      <ConfirmRemovePromptDialog />
    </BaseModal>

    <BaseModal name="setup-llm-provider">
      <SetupLLMProviderDialog />
    </BaseModal>

    <BaseModal name="template-info">
      <TemplateInfoDialog />
    </BaseModal>

    <BaseModal name="config">
      <ConfigDialog />
    </BaseModal>

    <!-- Toast Displays -->
    <ToastDisplayError />

    <!-- Config -->
    <FaviconSetter />
  </div>
</template>

<style scoped>
.grid-template {
  display: grid;
  direction: rtl;
}
</style>
