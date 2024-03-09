import { LM_STUDIO_API_BASE_URL } from './lib/constants'

const basePath = process.env.NUXT_APP_BASE_URL || '/'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      title: 'Dear Ghost',
    },
  },

  devtools: { enabled: true },

  ssr: false,

  modules: [
    '@pinia/nuxt',
    '@vueuse/nuxt',
    'nuxt-security',
    '@vite-pwa/nuxt',
    '@nuxtjs/plausible',
  ],

  plausible: {
    enabled: process.env.NUXT_APP_DISABLE_ANALYTICS !== 'true',
    ignoredHostnames: ['localhost'],
    apiHost: 'https://dearghost.co',
  },

  nitro: {
    esbuild: {
      options: {
        target: 'esnext',
      },
    },
    prerender: {
      routes: ['/'],
    },
  },

  pwa: {
    base: process.env.NODE_ENV !== 'development' ? basePath : '/',
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
    client: {
      installPrompt: true,
      periodicSyncForUpdates:
        process.env.NODE_ENV === 'development' ? 20 : 3600 * 4,
    },
    scope: process.env.NODE_ENV !== 'development' ? basePath : '/',
    workbox: {
      globPatterns: ['**/*'],
    },
    includeAssets: ['**/*'],
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
      LM_STUDIO_API_BASE_URL:
        process.env.LM_STUDIO_API_BASE_URL || LM_STUDIO_API_BASE_URL,
    },
  },

  security: {
    enabled: process.env.DISABLE_NUXT_SECURITY !== 'true',
    headers: {
      permissionsPolicy: {
        fullscreen: ['self'],
      },
    },
  },
})
