export function deepCopy(object: Object | Object[]) {
  return JSON.parse(JSON.stringify(object))
}
