type Widget = {
  config?: {
    classes?: string
  }
}

export type PageObject = {
  title: string
  content: string
}

export type PageWidgetData = Widget & {
  id: number
  component: 'PageWidget'
  object: PageObject
}

export type ActionPanelWidgetData = Widget & {
  id: number
  component: 'ActionPanelWidget'
}

export type GenericWidget = ActionPanelWidgetData | PageWidgetData
