<script setup lang="ts">
import { highlightVariables } from '@/lib/utils/format'
import { UseClipboard } from '@vueuse/components'

const props = defineProps({
  code: {
    type: String,
    required: true,
  },
  big: {
    type: Boolean,
    default: false,
  },
})

const formattedCode = computed(() => highlightVariables(props.code))
</script>

<template>
  <div
    class="group my-2 flex items-center justify-between gap-x-3 rounded bg-black/[8%] leading-5"
    :class="big ? 'p-4' : 'p-3.5 py-2.5'"
  >
    <pre class="font-nunito text-wrap" v-html="formattedCode" />

    <UseClipboard v-slot="{ copy, copied }" :source="code">
      <button
        class="h-8 w-12 shrink-0 rounded text-sm font-semibold opacity-0 transition-opacity group-hover:opacity-100"
        :class="{ 'bg-white/60': !copied }"
        @click="copy()"
      >
        {{ copied ? 'Copied' : 'Copy' }}
      </button>
    </UseClipboard>
  </div>
</template>
