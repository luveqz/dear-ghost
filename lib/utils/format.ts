export function highlightVariables(code: string) {
  return code.replace(
    /{{(.*?)}}/g,
    '<span class="text-black/45">{{</span><span class=" font-bold">$1</span><span class="text-black/45">}}</span>',
  )
}
