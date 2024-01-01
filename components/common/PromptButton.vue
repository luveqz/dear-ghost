<script setup lang="ts">
import Popper from 'vue3-popper'
import { onClickOutside } from '@vueuse/core'
import { useContextMenuTurn } from '@/componsables/context-menu-turn'
import { Prompt } from '@/lib/types/library'
import { PROMPT_ICON_CATALOG } from '@/stores/library'

const props = defineProps({
  prompt: {
    type: Object as PropType<Prompt>,
    required: true,
  },
})

const emit = defineEmits(['run-prompt'])

const keys = useMagicKeys()

if (props.prompt.shortcut) {
  whenever(keys[props.prompt.shortcut], () => {
    emit('run-prompt')
  })
}

const { isOpen, open, close } = useContextMenuTurn()

const popoverRef = ref()
onClickOutside(popoverRef, close)
</script>

<template>
  <Popper :show="isOpen" placement="left-end" offset-distance="0">
    <button
      class="flex h-11 w-full select-none items-center gap-2 border-l border-r border-t border-black/15 p-2"
      :class="{ 'rounded-es-none': isOpen }"
      v-bind="$attrs"
      @contextmenu.stop.prevent="open"
      @click="$emit('run-prompt')"
    >
      <span
        class="flex h-[1.625rem] w-[1.625rem] items-center justify-center rounded bg-orange-gray-100"
      >
        <component
          :is="PROMPT_ICON_CATALOG[prompt.iconName]"
          class="h-4 w-4 opacity-60"
        />
      </span>

      <span class="flex flex-col text-left">
        <span class="text-xxs font-semibold leading-none text-orange-700">
          {{ prompt.secondaryLabel }}
        </span>
        <span class="mt-0.5 text-sm font-semibold leading-none">
          {{ prompt.mainLabel }}
        </span>
      </span>
    </button>

    <template #content>
      <PromptConfigPopover
        ref="popoverRef"
        :prompt="prompt"
        :is-open="isOpen"
        class="absolute top-[calc(100%_-_0.1rem)] z-50 min-w-full"
      />
    </template>
  </Popper>
</template>
