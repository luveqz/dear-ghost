<script setup lang="ts">
import { UseClipboard } from '@vueuse/components'

defineProps({
  code: {
    type: String,
    required: true,
  },
})
</script>

<template>
  <div
    class="group my-2 flex items-center justify-between rounded bg-black/[8%] p-3.5 py-2.5 leading-5"
  >
    {{ code }}
    <UseClipboard v-slot="{ copy, copied }" :source="code">
      <button
        class="h-8 w-12 rounded text-sm font-semibold opacity-0 transition-opacity group-hover:opacity-100"
        :class="{ 'bg-white/60': !copied }"
        @click="copy()"
      >
        {{ copied ? 'Copied' : 'Copy' }}
      </button>
    </UseClipboard>
  </div>
</template>
