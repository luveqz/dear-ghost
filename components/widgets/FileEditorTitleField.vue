<script setup lang="ts">
import { selectElementContents } from '@/lib/utils/browser'
import { DEFAULT_FILE } from '@/stores/editor'

const props = defineProps({
  modelValue: {
    type: String,
    required: true,
  },
})

const { tab } = useMagicKeys()
const emit = defineEmits(['update:model-value'])

const onInput = ({ target }: Event) => {
  emit('update:model-value', (target as HTMLElement).innerText)
}

const selectTextOnTab = ({ target }: Event) => {
  if (target && tab.value) {
    selectElementContents(target as Node)
  }
}

const restoreDefaultTitle = () => {
  emit('update:model-value', DEFAULT_FILE.data.title)
}

const onBlur = () => {
  if (!props.modelValue.trim()) {
    restoreDefaultTitle()
  }

  clearSelection()
}

const clearSelection = () => {
  if (window.getSelection) {
    window.getSelection()?.removeAllRanges()
  }
}
</script>

<template>
  <h2
    draggable="false"
    class="sticky top-0 z-10 flex h-fit items-stretch gap-2 bg-white pb-1 pt-sticky-widget text-xl font-bold leading-none"
  >
    <span class="w-2 shrink-0 grow rounded-sm bg-orange-500" />
    <div
      class="h-fit w-full bg-white leading-tight focus-visible:outline-none"
      contenteditable
      @input="onInput"
      @focus="selectTextOnTab"
      @blur="onBlur"
      @keypress.enter.prevent
      v-text="modelValue"
    />
  </h2>
</template>
