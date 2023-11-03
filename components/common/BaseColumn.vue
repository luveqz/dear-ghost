<script setup lang="ts">
import Sortable from 'sortablejs'
import interact from 'interactjs'

defineEmits(['remove'])

const columnRef = ref<HTMLElement | null>()
const sortableInstance = ref<Sortable>()

const enableSortableColumn = () => {
  if (columnRef.value) {
    sortableInstance.value = new Sortable(columnRef.value, {
      group: 'shared',
      swapThreshold: 1,
      animation: 150,
    })
  }
}

const enableResizableColumn = () => {
  if (columnRef.value)
    interact(columnRef.value).resizable({
      // resize from all edges and corners
      edges: { left: false, right: true, bottom: false, top: false },

      listeners: {
        move(event) {
          var target = event.target
          var x = parseFloat(target.getAttribute('data-x')) || 0
          var y = parseFloat(target.getAttribute('data-y')) || 0

          // update the element's style
          target.style.width = event.rect.width + 'px'
          target.style.transform = 'translate(' + x + 'px,' + y + 'px)'

          target.setAttribute('data-x', x)
          target.setAttribute('data-y', y)
        },
      },
      modifiers: [
        // keep the edges inside the parent

        // minimum size
        interact.modifiers.restrictSize({
          min: { width: 100, height: 50 },
        }),
      ],

      inertia: true,
    })
}

onMounted(() => {
  enableSortableColumn()
  enableResizableColumn()
})

onBeforeUnmount(() => {
  sortableInstance.value?.destroy()
})
</script>

<template>
  <section
    class="resizable-column relative flex min-h-full flex-col gap-y-0.5"
    ref="columnRef"
  >
    <button
      class="absolute w-full py-2 text-center"
      :class="{ 'opacity-0': $editor.mode !== 'edit-workspace' }"
      :disabled="$editor.mode !== 'edit-workspace'"
      @click="$emit('remove')"
    >
      remove
    </button>

    <slot />
  </section>
</template>
