<script lang="ts" setup>
import TriangleIcon from '@/components/icons/TriangleIcon.vue'

defineProps({
  text: {
    type: String,
  },
})
</script>

<template>
  <li class="flex items-center gap-3 leading-tight sm:gap-5">
    <div
      class="flex h-9 w-9 shrink-0 items-center justify-center rounded bg-orange-gray-900 text-white"
    >
      <TriangleIcon />
    </div>

    <div>
      <template v-if="text">
        {{ text }}
      </template>

      <template v-else>
        <slot />
      </template>
    </div>
  </li>
</template>
