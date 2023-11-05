<script setup lang="ts">
defineProps({
  modelValue: {
    type: String,
    required: true,
  },
})

defineEmits(['update:model-value'])
</script>

<template>
  <input
    type="text"
    class="border-blue-gray-100 h-10 rounded border bg-white p-2.5 px-2 text-sm font-medium placeholder:opacity-40"
    :value="modelValue"
    @input="
      $emit('update:model-value', ($event.target as HTMLInputElement).value)
    "
  />
</template>
