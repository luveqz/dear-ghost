import { Editor } from '@tiptap/vue-3'

type Widget = {
  config?: {
    classes?: string
  }
}

export type PageData = {
  title: string
  content: string
}

export type PageWidgetData = Widget & {
  id: number
  component: 'PageWidget'
  editor?: Editor
  data: PageData
}

export type ActionPanelWidgetData = Widget & {
  id: number
  component: 'ActionPanelWidget'
}

export type GenericWidget = ActionPanelWidgetData | PageWidgetData
