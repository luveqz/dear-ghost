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
      PALM_2_API_BASE_URL:
        process.env.PALM_2_API_BASE_URL ||
        'https://generativelanguage.googleapis.com/v1beta2/models/text-bison-001:generateText',
      PALM_2_API_KEY: process.env.PALM_2_API_KEY,
      CLARIFAI_API_BASE_URL:
        process.env.CLARIFAI_API_BASE_URL ||
        'https://api.clarifai.com/v2/models/',
      CLARIFAI_API_KEY: process.env.CLARIFAI_API_KEY,
    },
  },
})
