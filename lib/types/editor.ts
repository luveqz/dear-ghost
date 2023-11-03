import { WIDGET_CATALOG } from '@/stores/editor'

export type Widget = {
  id: number
  component: keyof typeof WIDGET_CATALOG
  config: any
}

export type Column = {
  id: number
  widgets: Widget[]
  config?: {
    classes?: string
  }
}
