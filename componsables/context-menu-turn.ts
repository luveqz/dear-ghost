import { ref, computed } from 'vue'

const menus = ref<boolean[]>([])

export function useContextMenuTurn() {
  const id = menus.value.length
  menus.value.push(false)

  const open = () => {
    menus.value[id] = true

    menus.value.forEach((_, index) => {
      if (index !== id) menus.value[index] = false
    })
  }

  const close = () => {
    menus.value[id] = false
  }

  const closeAll = () =>
    menus.value.forEach((_, index) => {
      menus.value[index] = false
    })

  const keys = useMagicKeys()
  whenever(keys.escape, close)

  const isOpen = computed(() => menus.value[id])

  return { isOpen, open, close, closeAll }
}
