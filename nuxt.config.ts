import { makeId } from './lib/utils/random'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      title: 'Dear Ghost',
    },
  },

  devtools: { enabled: true },

  modules: ['@pinia/nuxt', '@vueuse/nuxt', 'nuxt-security', '@vite-pwa/nuxt'],

  ssr: false,

  pwa: {
    registerType: 'autoUpdate',
    manifest: {
      display: 'fullscreen',
      name: 'Dear Ghost',
      short_name: 'DearGhost',
      theme_color: '#ffffff',
      icons: [
        {
          src: 'icons/64x64.png',
          sizes: '64x64',
          type: 'image/png',
        },
        {
          src: 'icons/512x512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'any maskable',
        },
      ],
    },
    workbox: {
      globPatterns: ['**/*'],
    },
    includeAssets: ['**/*'],
    devOptions: {
      enabled: true,
      suppressWarnings: true,
      navigateFallbackAllowlist: [/^\/$/],
      type: 'module',
    },
    client: {
      installPrompt: true,
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

  runtimeConfig: {
    app: {
      PALM_2_API_KEY: process.env.PALM_2_API_KEY,
      CLARIFAI_API_KEY: process.env.CLARIFAI_API_KEY,
    },
  },

  security: {
    basicAuth: {
      include: ['/'],
      name: process.env.BASIC_AUTH_USER || makeId(60),
      pass: process.env.BASIC_AUTH_PASS || makeId(60),
      enabled: process.env.BASIC_AUTH_ENABLED === 'true',
    },
    headers: {
      permissionsPolicy: {
        fullscreen: ['self'],
      },
    },
  },
})
