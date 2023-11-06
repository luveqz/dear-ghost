// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  modules: ['@pinia/nuxt', '@vueuse/nuxt'],

  components: [
    {
      path: '~/components', // will get any components nested in e.g. /components/test too
      pathPrefix: false,
    },
  ],

  css: ['@/assets/css/main.css', '@/assets/css/prose-mirror.css'],

  postcss: {
    plugins: {
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
      PALM_API_BASE_URL:
        'https://generativelanguage.googleapis.com/v1beta2/models/text-bison-001:generateText',
    },
  },
})
