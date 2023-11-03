/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './stores/**/*.{js,ts}',
    './app.vue',
    './nuxt.config.{js,ts}',
  ],

  theme: {
    colors: {
      gray: {
        100: '#DFDFDF',
        200: '#BFBFBF',
        900: '#353434',
      },
      orange: {
        500: '#DB7E11',
        700: '#B96400',
      },
      white: '#E8EFF6',
      black: '#1E1C1C',
    },

    extend: {
      spacing: {
        'sticky-widget': '4.75rem',
      },
      fontSize: {
        xxs: '0.688rem',
      },
      width: {
        page: '33.125rem',
        'action-panel': '20rem',
      },
    },
  },

  plugins: [],
}
