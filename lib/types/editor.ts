type Widget = {
  config?: {
    classes?: string
  }
}

export type PageObject = {
  title: string
  content: string
}

export type PageWidget = Widget & {
  id: number
  component: 'BasePage'
  object: PageObject
}

export type ActionPanelWidget = Widget & {
  id: number
  component: 'ActionPanel'
}

export type GenericWidget = ActionPanelWidget | PageWidget
