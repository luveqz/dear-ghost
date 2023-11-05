<script setup lang="ts">
import { useContextMenuTurn } from '@/componsables/context-menu-turn'
import { getLastItem } from '@/lib/utils/array'
import { WIDGET_CATALOG } from '@/stores/editor'

const { $editor } = useNuxtApp()

const addColumn = () => {
  $editor.columns.push({
    id: getLastItem($editor.columns).id + 1,
    config: {
      classes: 'w-page',
    },
    widgets: [],
  })
  $editor.save()
}

const removeColumn = (id: number) => {
  $editor.columns = $editor.columns.filter((column) => column.id !== id)
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

    <main
      class="mt-sticky-widget inline-flex min-w-full grow gap-0.5"
      :class="'justify-center'"
    >
      <BaseColumn
        v-for="column in $editor.columns"
        :key="column.id"
        :class="column.config?.classes || ''"
        @remove="removeColumn(column.id)"
      >
        <component
          v-for="widget in column.widgets"
          :key="widget.id"
          :is="WIDGET_CATALOG[widget.component]"
        />
      </BaseColumn>

      <button
        class="sticky top-[3.25rem] h-[calc(100vh_-_3.25rem)] p-3 text-2xl text-orange-gray-900 transition-colors hover:bg-opacity-5"
        :class="{ 'w-0 p-0 opacity-0': $editor.mode !== 'edit-workspace' }"
        :disabled="$editor.mode !== 'edit-workspace'"
        @click="addColumn"
      >
        +
      </button>
    </main>
  </div>
</template>
