<script setup lang="ts">
import { hasScrollBar } from '@/lib/utils/browser'

const props = defineProps({
  modelValue: {
    type: String,
    required: true,
  },
  stopPropagationOnScroll: {
    type: Boolean,
    default: false,
  },
})

const field = ref<HTMLElement>()

defineEmits(['update:model-value'])

const onWheel = (event: MouseEvent) => {
  if (props.stopPropagationOnScroll && field.value) {
    if (hasScrollBar(field.value, 'vertical')) {
      event.stopPropagation()
    }
  }
}
</script>

<template>
  <textarea
    ref="field"
    class="base-textarea min-h-[2.5rem] resize rounded border border-blue-gray-200 bg-white p-2.5 text-sm font-medium placeholder:opacity-40"
    :value="modelValue"
    @input="
      $emit('update:model-value', ($event.target as HTMLInputElement).value)
    "
    @wheel="onWheel"
  />
</template>

<style scoped>
.base-textarea::-webkit-resizer {
  display: none;
}
</style>
