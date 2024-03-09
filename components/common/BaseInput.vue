<script setup lang="ts">
defineProps({
  modelValue: {
    type: String,
    required: true,
  },
  variant: {
    type: String as PropType<'small' | 'medium'>,
    default: 'small',
  },
})

defineEmits(['update:model-value'])
</script>

<template>
  <input
    type="text"
    class="h-10 rounded border border-blue-gray-200 bg-white p-2.5 font-medium placeholder:opacity-80"
    :class="variant === 'small' ? 'px-2 text-sm' : 'px-4 text-base'"
    :value="modelValue"
    @input="
      $emit('update:model-value', ($event.target as HTMLInputElement).value)
    "
  />
</template>
