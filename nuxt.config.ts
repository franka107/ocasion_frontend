import { createResolver } from '@nuxt/kit'

const { resolve } = createResolver(import.meta.url)

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true, timeline: { enabled: true } },
  runtimeConfig: {
    public: {
      apiUrl: process.env.NUXT_API_URL,
      globalDomain: process.env.NUXT_GLOBAL_DOMAIN,
      uploadApiUrl: process.env.NUXT_UPLOAD_API_URL,
      socketApiUrl: process.env.NUXT_SOCKET_API_URL,
      landingUrl: process.env.NUXT_LANDING_URL,
    },
  },

  sound: {
    sounds: {
      scan: true,
    },
  },
  vite: {
    optimizeDeps: {
      include: ['howler'],
    },
  },
  modules: [
    '@nuxtjs/tailwindcss',
    'shadcn-nuxt',
    'nuxt-auth-utils', // 'nuxt-svgo',
    [
      '@nuxtjs/google-fonts',
      {
        families: {
          Inter: true,
          Roboto: true,
        },
      },
    ],
    'nuxt-countdown',
    '@vueuse/nuxt',
    '@nuxt/fonts',
  ],
  shadcn: {
    /**
     * Prefix for all the imported component
     */
    prefix: '',
    /**
     * Directory that the component lives in.
     * @default "./components/ui"
     */
    componentDir: './components/ui',
  },
  ssr: false,
  css: [
    resolve('./assets/scss/_variables.scss'),
    resolve('./assets/scss/app.scss'),
  ],
  app: {
    // pageTransition: { name: 'page', mode: 'out-in' },
    // layoutTransition: { name: 'layout', mode: 'out-in' },

    head: {
      link: [
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap',
        },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
        },
      ],
    },
  },
})
