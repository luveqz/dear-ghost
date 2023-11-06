export type PageObject = {
  title: string
  content: string
}

export type PageWidget = {
  id: number
  component: 'BasePage'
  object: PageObject
}

export type ActionPanelWidget = {
  id: number
  component: 'ActionPanel'
}

export type Column = {
  id: number
  widgets: PageWidget[] | ActionPanelWidget[]
  config?: {
    classes?: string
  }
}
