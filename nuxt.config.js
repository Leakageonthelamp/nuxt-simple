module.exports = {
  /*
   ** Headers of the page
   */
  head: {
    title: "engder",
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { hid: "description", name: "description", content: "Engder project" }
    ],
    script: [
      { src: "https://unpkg.com/vue/dist/vue.js" },

      { src: "https://unpkg.com/xlsx/dist/shim.min.js" },
      { src: "https://unpkg.com/xlsx/dist/xlsx.full.min.js" }
    ],
    link: [
      { rel: "icon", type: "image/x-icon", href: "/logo.ico" },
      {
        rel: "stylesheet",
        href: "https://use.fontawesome.com/releases/v5.0.13/css/all.css"
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css?family=Comfortaa|Handlee"
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css?family=Quicksand"
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css?family=Varela+Round"
      },
      {
        rel: "stylesheet",
        href:
          "https://cdnjs.cloudflare.com/ajax/libs/animate.css/3.5.2/animate.min.css"
      }
    ]
  },
  server: {
    port: 3030 // default: 3000
  },
  /*
   ** Customize the progress bar color
   */
  loading: { color: "#3B8070" },
  /*
   ** Build configuration
   */
  build: {
    /*
     ** Run ESLint on save
     */
    extend(config, { isDev, isClient }) {
      if (isDev && isClient) {
        config.module.rules.push({
          enforce: "pre",
          test: /\.(js|vue)$/,
          loader: "eslint-loader",
          exclude: /(node_modules)/
        });
      }
    },
    terser: {
      terserOptions: {
        compress: {
          drop_console: true
        }
      }
    }
  },
  styleResources: {
    scss: "./assets/scss/_common.scss"
  },
  css: ["~/assets/scss/main.scss"],
  plugins: [
    { src: "~/plugins/firebase.js", ssr: false },
    { src: "~/plugins/swiper", mode: "client" },
    { src: "~/plugins/vue-element-loading.js", ssr: false },
    { src: "~/plugins/vue-multiselect.js", ssr: false },
    { src: "~/plugins/vue-csv-import.js", ssr: false },
    { src: "~/plugins/vue-tooltip.js" },
    { src: "~/plugins/freeze-scroll-position.js" },
    { src: "~/plugins/directives.js" },
    "~/plugins/axios"
  ],
  modules: [
    ["@nuxtjs/google-analytics"],
    ["@nuxtjs/style-resources"],
    ["bootstrap-vue/nuxt"],
    "@nuxtjs/toast",
    "@nuxtjs/moment",
    "@nuxtjs/axios"
  ],
  "google-analytics": {
    id: "UA-121418594-1"
  },
  toast: {
    position: "top-center",
    register: [
      // Register custom toasts
      {
        name: "my-error",
        message: "Oops...Something went wrong",
        options: {
          type: "error"
        }
      }
    ]
  },
  axios: {
    proxy: true
  },
  proxy: {
    "/webhook/": {
      target:
        process.env.NODE_ENV === "production"
          ? process.env.API_BASE_URL
          : process.env.DEV_API_BASE_URL,
      changeOrigin: true,
      logLevel: "debug",
      pathRewrite: {
        "^/webhook": "/"
      },
      headers: {
        "Access-Control-Allow-Origin": "*"
      }
    }
  }
  // axios: {
  //   // proxy: true,
  //   baseURL:
  //     process.env.NODE_ENV === "PROD"
  //       ? process.env.API_BASE_URL
  //       : process.env.DEV_API_BASE_URL
  // }
};
