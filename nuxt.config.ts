const basePath = process.env.NUXT_APP_BASE_URL || '/'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      title: 'Dear Ghost',
      link: [
        { rel: 'icon', type: 'image/x-icon', href: `${basePath}dark.ico` },
      ],
    },
  },

  experimental: {
    componentIslands: true,
  },

  devtools: { enabled: true },

  ssr: true,

  modules: ['@pinia/nuxt', '@vueuse/nuxt', '@nuxtjs/plausible'],

  plausible: {
    enabled: process.env.NUXT_APP_DISABLE_ANALYTICS !== 'true',
    ignoredHostnames: ['localhost'],
    apiHost: 'https://dearghost.co',
  },

  routeRules: {
    '/': {
      prerender: true,
      ssr: true,
      static: true,
      experimentalNoScripts: true,
    },
  },

  components: [
    {
      path: '~/components', // will get any components nested in e.g. /components/test too
      pathPrefix: false,
    },
  ],

  css: ['@/assets/css/main.css', '@/assets/css/prose-mirror.css'],

  postcss: {
    plugins: {
      'tailwindcss/nesting': {},
      tailwindcss: {},
      autoprefixer: {},
    },
  },

  typescript: {
    tsConfig: {
      compilerOptions: {
        paths: {
          '@': ['.'],
          '@/*': ['./*'],
        },
      },
    },
  },

  compatibilityDate: '2024-11-02',
})
