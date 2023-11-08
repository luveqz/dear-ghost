<script setup lang="ts">
import { useContextMenuTurn } from '@/componsables/context-menu-turn'
import { getLastItem } from '@/lib/utils/array'
import { Editor } from '@tiptap/core'
import draggable from 'vuedraggable'

const { $editor } = useNuxtApp()
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

onMounted(() => {
  $editor.load()
})
</script>

<template>
  <div
    class="absolute left-0 top-0 flex h-full min-w-full flex-col items-center"
    @contextmenu.prevent="closeAll"
  >
    <TheNavigation class="fixed left-0 top-0 z-20 w-full" />

    <div
      class="fixed left-0 top-0.5 z-10 h-sticky-widget w-full shrink-0 bg-white"
    />

    <draggable
      class="mt-sticky-widget inline-flex min-w-full grow gap-0.5"
      :class="'justify-center'"
      :list="$editor.widgets"
      item-key="id"
      @end="$editor.save()"
    >
      <template #item="{ element: widget }">
        <div class="flex flex-col" :class="widget.config?.classes || ''">
          <ActionPanelWidget v-if="widget.component === 'ActionPanelWidget'" />
          <PageWidget
            v-else-if="widget.component === 'PageWidget'"
            :data="widget.data"
            class="grow"
            @instantiated="(editor) => (widget.editor = editor)"
            @active="(editor) => (activeEditor = editor)"
          />
        </div>
      </template>
    </draggable>
    <button
      class="fixed right-0 top-[3.25rem] h-[calc(100vh_-_3.25rem)] p-3 text-2xl text-orange-gray-900 transition-colors hover:bg-opacity-5"
      :class="{ 'w-0 p-0 opacity-0': $editor.mode !== 'edit-workspace' }"
      :disabled="$editor.mode !== 'edit-workspace'"
      @click="addPage"
    >
      +
    </button>
  </div>
</template>
