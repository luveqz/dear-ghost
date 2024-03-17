<script setup lang="ts">
import { Tab } from '@headlessui/vue'

defineProps({
  label: {
    type: String,
    required: true,
  },
})
</script>

<template>
  <Tab
    class="group relative flex w-14 flex-col items-center gap-1 px-1 pb-2 text-black/80 focus-visible:outline-none"
    v-slot="{ selected }"
  >
    <span :class="{ 'opacity-50': !selected }">
      <slot />
    </span>

    <p :class="{ 'opacity-60': !selected }">{{ label }}</p>

    <hr
      v-if="selected"
      class="h-0.25 absolute bottom-0 left-0 w-full border-none bg-orange-500"
    />
  </Tab>
</template>
