<script setup lang="ts">
import { onKeyStroke } from '@vueuse/core'
import { MODALS_AND_MENUS } from '@/stores/modal'

const props = defineProps({
  name: {
    type: String as PropType<keyof typeof MODALS_AND_MENUS>,
    required: true,
  },
})

const { $modal } = useNuxtApp()

const isOpen = computed(() => $modal[props.name])

const close = () => {
  $modal.close(props.name)
}

onKeyStroke('Escape', close)
</script>

<template>
  <transition
    enter-from-class="opacity-0"
    enter-active-class="transition-opacity duration-200"
    leave-active-class="transition-opacity duration-300"
    leave-to-class="opacity-0"
  >
    <div
      v-if="isOpen"
      class="fixed left-0 top-0 z-20 flex h-full w-full items-center justify-center bg-black/40"
      @click.self="close"
    >
      <div class="flex w-full justify-center px-4 md:px-10" @click.self="close">
        <slot />
      </div>
    </div>
  </transition>
</template>
