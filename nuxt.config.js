export default {
  head: {
    titleTemplate: '%s - Medical Center',
    title: 'Mednoor',
    htmlAttrs: {
      lang: 'en',
    },
    meta: [
      { charset: 'utf-8' },
      {
        name: 'viewport',
        content:
          'width=device-width, initial-scale=1, user-scalable=1.0, minimum-scale=1.0, maximum-scale=1.0',
      },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },

  css: [
    'ant-design-vue/dist/antd.css',
    './assets/_variables.sass',
    './assets/global.sass',
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    '@/plugins/antd-ui',
    '~/plugins/directives',
    '~/plugins/api',
    { src: '~/plugins/pincode', mode: 'client' },
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    '@nuxtjs/i18n',
    '@nuxtjs/eslint-module',
    '@nuxtjs/style-resources',
    '@nuxtjs/google-fonts',
    '@nuxtjs/vuetify',
  ],

  i18n: {
    strategy: 'prefix',
    locales: [
      { name: 'English', code: 'en', iso: 'en-US', file: 'en.js' },
      { name: 'Español', code: 'es', iso: 'es-MX', file: 'es.js' },
    ],
    defaultLocale: 'en',
    vueI18n: {
      fallbackLocale: 'en',
    },
    langDir: 'lang/',
  },

  googleFonts: {
    families: {
      Spartan: [300, 400, 500],
      Overpass: [300, 400, 700],
    },
  },

  styleResources: {
    // your settings here
    sass: ['./assets/*.sass'],
    less: [],
    stylus: [],
    hoistUseStatements: true, // Hoists the "@use" imports. Applies only to "sass", "scss" and "less". Default: false.
  },

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    '@nuxtjs/auth-next',
    'nuxt-socket-io',
    '@nuxtjs/toast',
    'cookie-universal-nuxt',
    'vue2-editor/nuxt',
  ],

  toast: {
    theme: 'bubble',
    position: 'top-right',
    duration: '2369',
  },

  auth: {
    strategies: {
      local: {
        scheme: 'refresh',
        token: {
          property: 'token',
          global: true,
          maxAge: 1800,
          // required: true,
          // type: 'Bearer'
        },
        refreshToken: {
          property: 'refresh_token',
          data: 'refresh_token',
          maxAge: 60 * 60 * 24 * 30,
          // maxAge: 0,
        },
        endpoints: {
          // login: {
          //   url: process.env.USER_BASE_URL + '/sign-in',
          //   method: 'post',
          //   propertyName: 'data.token',
          // },

          login: {
            url: process.env.USER_BASE_URL + '/token-exchange',
            method: 'post',
            propertyName: 'data.token',
          },
          user: {
            url: process.env.USER_BASE_URL + '/me',
            method: 'get',
            propertyName: 'data.user',
          },
          refresh: {
            url: process.env.USER_BASE_URL + '/refresh',
            method: 'post',
            propertyName: 'data.token',
          },
          logout: {
            url: process.env.USER_BASE_URL + '/logout',
            method: 'post',
            propertyName: 'data.refresh_token',
          },

          autoLogout: false,
        },
      },
    },
    redirect: {
      login: '/sign-in',
      logout: '/sign-out',
      callback: '/sign-in',
      home: '/welcome',
    },
    plugins: ['~/plugins/auth.js'],
  },

  env: {
    BASE_URL: process.env.BASE_URL,
    API_URL: process.env.API_URL,
    MEDIA_URL: process.env.MEDIA_URL,
    USER_BASE_URL: process.env.USER_BASE_URL,
    APPOINTMENTS_URL: process.env.APPOINTMENTS_URL,
    INSURANCE_URL: process.env.INSURANCE_URL,
    HOME_URL: process.env.HOME_URL,
    PAYMENT_URL:process.env.PAYMENT_URL

  },

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {},

  io: {
    sockets: [
      // Required
      {
        // At least one entry is required
        name: 'home',
        url: process.env.API_URL,
        default: true,
      },
      {
        name: 'media',
        url: process.env.MEDIA_URL,
      },
    ],
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    // hardSource: false,
    // cache: true,
    // parallel: true,
    loaders: {
      sass: {
        implementation: require('sass'),
      },
      scss: {
        implementation: require('sass'),
      },
    },
  },
}
