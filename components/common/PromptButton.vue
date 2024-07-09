<script setup lang="ts">
import Popper from 'vue3-popper'
import { onClickOutside } from '@vueuse/core'
import { useContextMenuTurn } from '@/composables/context-menu-turn'
import type { Prompt } from '@/lib/types/library'
import { PROMPT_ICON_CATALOG } from '@/lib/utils/library'

const props = defineProps({
  prompt: {
    type: Object as PropType<Prompt>,
    required: true,
  },
})

const emit = defineEmits(['run-prompt', 'scroll-popover'])

const keys = useMagicKeys()

if (props.prompt.shortcut) {
  whenever(keys[props.prompt.shortcut], () => {
    emit('run-prompt')
  })
}

const { isOpen, open, close } = useContextMenuTurn()
const toggle = () => (isOpen.value ? close() : open())

const popoverRef = ref<HTMLElement>()
onClickOutside(popoverRef, close)

const onWheel = (e: WheelEvent) => {
  emit('scroll-popover', e.deltaY)
}
</script>

<template>
  <Popper
    ref="popoverRef"
    :show="isOpen"
    placement="left-end"
    offset-distance="0"
  >
    <div
      class="flex border-l border-r border-t border-black/15"
      :class="{
        'rounded-es-none': isOpen,
        grayscale: $llm.running,
      }"
      v-bind="$attrs"
    >
      <button
        class="flex h-10 w-full select-none items-center gap-2 p-2"
        :class="{ 'cursor-not-allowed': $llm.running }"
        @click="!$llm.running && $emit('run-prompt')"
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
          <span class="mt-0.5 text-sm font-medium leading-none">
            {{ prompt.mainLabel }}
          </span>
        </span>
      </button>

      <button
        class="flex w-10 items-center justify-center border-l border-black/15"
        @click="toggle"
        @contextmenu.stop.prevent="toggle"
      >
        <AngleDownIcon class="opacity-50" />
      </button>
    </div>

    <template #content>
      <PromptConfigPopover
        :prompt="prompt"
        :is-open="isOpen"
        class="absolute top-[calc(100%_-_0.1rem)] z-50 min-w-full"
        @wheel="onWheel"
      />
    </template>
  </Popper>
</template>
