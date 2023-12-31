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

const restoreDefaultTitle = () => {
  emit('update:model-value', DEFAULT_FILE.data.title.trim())
}

const onBlur = () => {
  if (!props.modelValue.trim()) {
    restoreDefaultTitle()
  }
}
</script>

<template>
  <h2
    draggable="false"
    class="sticky top-0 z-10 flex items-stretch gap-2 bg-white pb-1 pt-sticky-widget text-xl font-bold leading-none"
  >
    <span class="w-2 shrink-0 grow-0 rounded-sm bg-orange-500" />
    <div
      class="input-sizer stacked w-full leading-tight"
      :data-value="modelValue"
    >
      <textarea
        class="resize-none bg-white focus-visible:outline-none"
        rows="1"
        :value="modelValue"
        @input="
          $emit('update:model-value', ($event.target as HTMLInputElement).value)
        "
        @blur="onBlur"
        @keypress.enter.prevent
      />
    </div>
  </h2>
</template>

<style lang="postcss">
.input-sizer {
  display: inline-grid;
  vertical-align: top;
  align-items: center;
  position: relative;

  &.stacked {
    align-items: stretch;

    &::after,
    input,
    textarea {
      grid-area: 2 / 1;
    }
  }

  &::after,
  input,
  textarea {
    width: auto;
    min-width: 1em;
    grid-area: 1 / 2;
    font: inherit;
    margin: 0;
    resize: none;
    background: none;
    appearance: none;
    border: none;
  }

  textarea {
    overflow-y: hidden;
  }

  &::after {
    content: attr(data-value) ' ';
    visibility: hidden;
    white-space: pre-wrap;
  }
}
</style>
