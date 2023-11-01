<script setup lang="ts">
defineProps({
  mainLabel: {
    type: String,
    required: true,
  },
  secondaryLabel: {
    type: String,
    required: true,
  },
})
</script>

<template>
  <button
    class="border-gray-200 flex h-10 w-full items-center gap-2 rounded border p-2"
  >
    <span
      class="bg-gray-100 flex h-[1.625rem] w-[1.625rem] items-center justify-center rounded"
    >
      <SparkIcon class="w-3.5 opacity-60" />
    </span>

    <span class="flex flex-col text-left">
      <span class="text-orange-700 text-xxs font-semibold leading-none">
        {{ secondaryLabel }}
      </span>
      <span class="mt-0.5 text-sm font-semibold leading-none">
        {{ mainLabel }}
      </span>
    </span>
  </button>
</template>
