<script setup lang="ts">
import { useToast } from '@/composables/toast'
import WarningIcon from '@/components/icons/WarningIcon.vue'
import UnplugIcon from '@/components/icons/UnplugIcon.vue'

const { message, icon, seeMoreModalId, ctaText } = useToast()

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
      class="fixed bottom-16 z-30 mx-auto mt-7 flex justify-center"
    >
      <div
        class="mx-auto flex max-w-[30rem] items-center gap-x-2 rounded bg-[#e4cccc] px-2.5 py-2.5 text-[#7B0909]"
      >
        <span
          class="flex items-center justify-center rounded bg-[#B67474] p-1 text-[#e4cccc]"
        >
          <component :is="ICONS[icon]" />
        </span>

        <p class="leading-4"> {{ message }} </p>

        <button
          v-if="seeMoreModalId"
          class="rounded border border-[#7B0909] border-opacity-20 px-2 py-1.5 text-sm leading-4"
          @click="$modal.open(seeMoreModalId)"
          >{{ ctaText }}</button
        >
      </div>
    </div>
  </transition>
</template>
