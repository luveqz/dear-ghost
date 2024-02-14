<script setup lang="ts">
import { useToast } from '@/componsables/toast'
import WarningIcon from '@/components/icons/WarningIcon.vue'
import UnplugIcon from '@/components/icons/UnplugIcon.vue'

const { message, icon } = useToast()

const ICONS = {
  unplug: UnplugIcon,
  warning: WarningIcon,
}
</script>

<template>
  <transition
    enter-active-class="transition duration-100 ease-out"
    enter-from-class="transform opacity-0"
    enter-to-class="transform opacity-100"
    leave-active-class="transition duration-75 ease-in"
    leave-from-class="transform opacity-100"
    leave-to-class="transform opacity-0"
  >
    <div
      v-if="message"
      class="fixed bottom-16 z-50 mx-auto mt-7 flex justify-center"
    >
      <div
        class="mx-auto flex max-w-[30rem] items-center gap-x-2 rounded bg-[#E7CECE] px-2.5 py-2.5 text-[#7B0909]"
      >
        <span
          class="flex items-center justify-center rounded bg-[#B67474] p-1 text-[#E7CECE]"
        >
          <component :is="ICONS[icon]" />
        </span>

        {{ message }}
      </div>
    </div>
  </transition>
</template>
