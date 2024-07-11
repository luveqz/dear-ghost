<script setup lang="ts">
const { $modal } = useNuxtApp()

const onConfirm = () => {
  $modal.callback()
  $modal.close('confirm-read-permission')
}

const onAbort = () => {
  $modal.callback({ abort: true })
  $modal.close('confirm-read-permission')
}
</script>

<template>
  <div class="rounded bg-white p-5 text-sm-2">
    <p class="mb-3 text-lg font-bold leading-4">Required permissions</p>
    <p class="max-w-[28rem] font-medium leading-4">
      Dear Ghost is trying to get the last version of the files from last
      session. To do this, it needs to read those specific files.
    </p>

    <div class="mt-6 flex justify-end gap-2.5">
      <button class="px-4 py-1.5 leading-4 text-orange-700" @click="onConfirm">
        Yes, allow access
      </button>
      <button
        class="rounded border border-black/15 bg-white px-4 py-1.5 leading-4"
        @click="onAbort"
      >
        Cancel
      </button>
    </div>
  </div>
</template>
