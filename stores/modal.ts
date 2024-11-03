import { defineStore } from 'pinia'
import { getKeys } from '@/lib/utils/object'

export const MODALS_AND_MENUS = {
  'confirm-read-permission': false,
  'confirm-remove-prompt': false,
  'confirm-close-file': false,
  'setup-llm-provider': false,
  'template-info': false,
  config: false,
}

export const useModalStore = defineStore({
  id: 'modal-store',

  state: () => {
    return {
      ...MODALS_AND_MENUS,
      stack: [] as (keyof typeof MODALS_AND_MENUS)[],
      callback: null as ((args?: any) => {}) | null,
    }
  },

  getters: {
    lastOpened(state): keyof typeof MODALS_AND_MENUS | undefined {
      return state.stack[this.stack.length - 1]
    },
  },

  actions: {
    open(modal: keyof typeof MODALS_AND_MENUS, callback?: () => any) {
      this[modal] = true
      this.stack.push(modal)

      if (callback) {
        this.callback = callback
      }
    },

    close(modal: keyof typeof MODALS_AND_MENUS) {
      this[modal] = false
      this.callback = () => {}
    },

    closeLastOpened() {
      const modal = this.stack.pop()
      if (modal) this.close(modal)
    },

    toggle(modal: keyof typeof MODALS_AND_MENUS) {
      this[modal] = !this[modal]
    },

    reset() {
      const modals = getKeys(MODALS_AND_MENUS)
      modals.forEach((modal) => this.close(modal))
    },
  },
})
