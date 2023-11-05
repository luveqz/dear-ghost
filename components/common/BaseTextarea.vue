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
  <textarea
    class="base-textarea min-h-[2.5rem] resize rounded border border-blue-gray-100 bg-white p-2.5 text-sm font-medium placeholder:opacity-40"
    :value="modelValue"
    @input="
      $emit('update:model-value', ($event.target as HTMLInputElement).value)
    "
  />
</template>

<style scoped>
.base-textarea::-webkit-resizer {
  display: none;
}
</style>
