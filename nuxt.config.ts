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

  security: {
    enabled: process.env.DISABLE_NUXT_SECURITY !== 'true',
    headers: {
      permissionsPolicy: {
        fullscreen: ['self'],
      },
    },
  },
})
