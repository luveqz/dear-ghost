import { defineStore } from 'pinia'

import PageWidget from '@/components/widgets/PageWidget.vue'
import ActionPanelWidget from '@/components/widgets/ActionPanelWidget.vue'
import { GenericWidget } from '@/lib/types/editor'

export const WIDGET_CATALOG = {
  PageWidget,
  ActionPanelWidget,
}

const WIDGET_STORAGE_KEY = 'widgets'
const DEFAULT_WIDGETS = [
  {
    id: 1,
    component: 'PageWidget',
    data: {
      title: 'Untitled',
      content: '',
    },
    config: {
      classes: 'w-page',
    },
  },
  {
    id: 3,
    component: 'ActionPanelWidget',
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
    validate(widgets: any) {
      // validate array with a Joi schema
      return true
    },

    save() {
      if (this.validate(this.widgets)) {
        const plainWidgetData = this.widgets.map((widget) => {
          if (widget.component === 'PageWidget') {
            const { editor, ...rest } = widget
            return rest
          } else {
            return widget
          }
        })

        window.localStorage.setItem(
          WIDGET_STORAGE_KEY,
          JSON.stringify(plainWidgetData),
        )
      }
    },

    load() {
      const widgets = JSON.parse(
        window.localStorage.getItem(WIDGET_STORAGE_KEY) || '[]',
      )

      if (this.validate(widgets)) {
        this.widgets = widgets.length ? widgets : DEFAULT_WIDGETS
        return this.widgets
      }
      return false
    },
  },
})
