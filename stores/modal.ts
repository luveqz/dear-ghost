import { defineStore } from 'pinia'
import { getKeys } from '@/lib/utils/object'

export const MODALS_AND_MENUS = {
  'confirm-deletion': false,
  'lm-provider-setup': false,
}

export const useModalStore = defineStore({
  id: 'modal-store',

  state: () => {
    return {
      ...MODALS_AND_MENUS,
      callback: () => {},
    }
  },

  actions: {
    open(modal: keyof typeof MODALS_AND_MENUS, callback?: () => any) {
      this[modal] = true

      for (const _modal of getKeys(MODALS_AND_MENUS))
        if (_modal !== modal) this.close(_modal)

      if (callback) {
        this.callback = callback
      }
    },

    close(modal: keyof typeof MODALS_AND_MENUS) {
      this[modal] = false
      this.callback = () => {}
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
