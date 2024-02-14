<script setup lang="ts">
const dismissed = ref(false)
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
      v-if="$pwa?.needRefresh && !dismissed"
      class="fixed bottom-16 right-16 z-50 mt-7 flex justify-end"
    >
      <div class="overflow-hidden rounded border border-black/15 bg-white">
        <div class="bg-orange-gray-900/5 p-4 text-sm">
          <p>Updates available.</p>

          <div class="mt-2.5 flex gap-2.5">
            <button
              class="rounded border border-black/15 px-4 py-1.5 leading-4"
              @click="dismissed = true"
            >
              Dismiss
            </button>
            <button
              class="rounded border border-black/15 bg-white px-4 py-1.5 leading-4"
              @click="$pwa?.updateServiceWorker()"
            >
              Reload
            </button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>
