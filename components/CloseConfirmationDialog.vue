<template>
  <div class="rounded bg-white p-5 text-sm">
    <p class="mb-3 text-lg font-bold leading-4">Unsaved changes</p>
    <p class="font-medium leading-4"
      >You will lose them. Do you want to continue?</p
    >

    <div class="mt-6 flex justify-end gap-2.5">
      <button
        class="px-4 py-1.5 leading-4 text-orange-700"
        @click="
          () => {
            $modal.callback()
            $modal.close('confirm-deletion')
          }
        "
      >
        Yes, close file
      </button>
      <button
        class="rounded border border-black/15 bg-white px-4 py-1.5 leading-4"
        @click="$modal.close('confirm-deletion')"
      >
        Cancel
      </button>
    </div>
  </div>
</template>
