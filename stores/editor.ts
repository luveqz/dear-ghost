import { defineStore } from 'pinia'

import BasePage from '@/components/widgets/BasePage.vue'
import ActionPanel from '@/components/widgets/ActionPanel.vue'
import { Column } from '@/lib/types/editor'

export const WIDGET_CATALOG = {
  BasePage,
  ActionPanel,
}

const COLUMNS_STORAGE_KEY = 'columns'
const DEFAULT_COLUMNS = [
  {
    id: 1,
    config: {
      classes: 'w-page',
    },
    widgets: [
      {
        id: 1,
        component: 'BasePage',
        object: {
          title: 'Untitled',
          content: '',
        },
      },
      {
        id: 2,
        component: 'BasePage',
        object: {
          title: 'Untitled',
          content: '',
        },
      },
    ],
  },
  {
    id: 2,
    config: {
      classes: 'w-action-panel',
    },
    widgets: [
      {
        id: 3,
        component: 'ActionPanel',
      },
    ],
  },
]

export const useEditorStore = defineStore('editor', {
  state: () =>
    ({
      columns: [],
      mode: 'write',
    }) as {
      columns: Column[]
      mode: 'write' | 'edit-workspace'
    },

  actions: {
    validate(columns: Column[]) {
      // validate array with a Joi schema
      return true
    },

    save() {
      if (this.validate(this.columns)) {
        window.localStorage.setItem(
          COLUMNS_STORAGE_KEY,
          JSON.stringify(this.columns),
        )
      }
    },

    load() {
      const columns = JSON.parse(
        window.localStorage.getItem(COLUMNS_STORAGE_KEY) || '[]',
      )

      if (this.validate(columns)) {
        this.columns = columns.length ? columns : DEFAULT_COLUMNS
        return this.columns
      }
      return false
    },
  },
})
