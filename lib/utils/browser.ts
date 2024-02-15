export function selectElementContents(el: Node) {
  var range = document.createRange()
  range.selectNodeContents(el)
  var sel = window.getSelection()

  if (sel) {
    sel.removeAllRanges()
    sel.addRange(range)
  }
}

export function hasScrollBar(
  element: HTMLElement,
  dir: 'vertical' | 'horizontal',
) {
  const dir2 = dir === 'vertical' ? 'scrollTop' : 'scrollLeft'

  let res = !!element[dir2]

  if (!res) {
    element[dir2] = 1
    res = !!element[dir2]
    element[dir2] = 0
  }
  return res
}
