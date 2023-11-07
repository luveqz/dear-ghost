import { defineStore } from 'pinia'

import BasePage from '@/components/widgets/BasePage.vue'
import ActionPanel from '@/components/widgets/ActionPanel.vue'
import { GenericWidget } from '@/lib/types/editor'

export const WIDGET_CATALOG = {
  BasePage,
  ActionPanel,
}

const WIDGET_STORAGE_KEY = 'widgets'
const DEFAULT_WIDGETS = [
  {
    id: 1,
    component: 'BasePage',
    object: {
      title: 'Untitled',
      content: '',
    },
    config: {
      classes: 'w-page',
    },
  },
  {
    id: 3,
    component: 'ActionPanel',
    config: {
      classes: 'w-action-panel',
    },
  },
]

export const useEditorStore = defineStore('editor', {
  state: () =>
    ({
      widgets: [],
      mode: 'write',
    }) as {
      widgets: GenericWidget[]
      mode: 'write' | 'edit-workspace'
    },

  actions: {
    validate(widgets: GenericWidget[]) {
      // validate array with a Joi schema
      return true
    },

    save() {
      if (this.validate(this.widgets)) {
        window.localStorage.setItem(
          WIDGET_STORAGE_KEY,
          JSON.stringify(this.widgets),
        )
      }
    },

    load() {
      const columns = JSON.parse(
        window.localStorage.getItem(WIDGET_STORAGE_KEY) || '[]',
      )

      if (this.validate(columns)) {
        this.widgets = columns.length ? columns : DEFAULT_WIDGETS
        return this.widgets
      }
      return false
    },
  },
})
