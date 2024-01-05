function makeid(length: number) {
  let result = ''
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const charactersLength = characters.length
  let counter = 0
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
    counter += 1
  }
  return result
}

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  modules: ['@pinia/nuxt', '@vueuse/nuxt', 'nuxt-security'],

  ssr: false,

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
      name: process.env.BASIC_AUTH_USER || makeid(60),
      pass: process.env.BASIC_AUTH_PASS || makeid(60),
      enabled: process.env.NODE_ENV !== 'development',
    },
  },
})
