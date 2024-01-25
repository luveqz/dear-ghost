export function selectElementContents(el: Node) {
  var range = document.createRange()
  range.selectNodeContents(el)
  var sel = window.getSelection()

  if (sel) {
    sel.removeAllRanges()
    sel.addRange(range)
  }
}
