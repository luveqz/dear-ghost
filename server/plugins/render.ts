export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('render:html', (html, ctx) => {
    if (ctx.event.path === '/') {
      html.head.push(
        '<script defer src="/js/pa.js" data-api="/api/event" data-domain="dearghost.co"></script>',
      )
    }
  })
})
