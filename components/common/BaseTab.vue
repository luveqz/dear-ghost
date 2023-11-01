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
    class="no-outline-on-click relative flex w-14 flex-col items-center gap-1 px-1 pb-2 pt-2"
    v-slot="{ selected }"
  >
    <span :class="{ 'opacity-50': !selected }">
      <slot />
    </span>

    <p :class="{ 'opacity-60': !selected }">{{ label }}</p>

    <hr
      v-if="selected"
      class="absolute bottom-0 left-0 h-1 w-full border-none bg-orange-500"
    />
  </Tab>
</template>
