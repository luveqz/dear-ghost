export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('render:html', (html) => {
    html.head.push(
      '<script defer src="/js/pa.js" data-api="/api/event" data-domain="dearghost.co"></script>',
    )
  })
})
