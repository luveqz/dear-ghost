export function range(length: number) {
  return [...Array(length).entries()]
}

export function getLastItem(array: any[] | NodeListOf<Element>) {
  return [...array][array.length - 1]
}

export function hasChildren(element: Element | undefined) {
  return element && element.childElementCount
}
