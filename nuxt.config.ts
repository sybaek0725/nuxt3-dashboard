// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    devtools: { enabled: true },

    ssr: false,

    app: {
        head: {
            script: [{ src: '/js/fabric.js' }, { src: '/js/NoSleep.min.js', defer: true }],
            title: 'AI 디지털 교과서',
            meta: [{ name: 'description', content: 'AI 디지털 수학 교과서' }]
        }
    },

    css: ['@/assets/scss/index.scss'],

    modules: ['@nuxtjs/i18n', 'vuetify-nuxt-module', '@pinia/nuxt', 'nuxt3-localforage'],

    i18n: {
        vueI18n: './i18n.config.js'
    },

    vuetify: {
        moduleOptions: {
            /* module specific options */
        },
        vuetifyOptions: {
            /* vuetify options */
            icons: {
                defaultSet: 'mdi',
                sets: ['mdi', 'fa']
            }
        }
    },

    plugins: [{ src: '@/plugins/lib.ts', mode: 'client', ssr: false }],

    pinia: {
        storesDirs: ['./stores/**']
    },

    runtimeConfig: {
        public: {
            apiBase: process.env.PUBLIC_API_BASE,
            loginUrl: process.env.PUBLIC_LOGIN_URL,
            logoutUrl: process.env.PUBLIC_LOGOUT_URL,
            homeUrl: process.env.PUBLIC_HOME_URL,
            signalServer: process.env.PUBLIC_SIGNAL_SERVER,
            stunServer: process.env.PUBLIC_STUN_SERVER,
            turnServer: process.env.PUBLIC_TURN_SERVER,
            turnServerId: process.env.PUBLIC_TURN_SERVER_ID,
            turnServerPw: process.env.PUBLIC_TURN_SERVER_PW,
            socketRoom: process.env.PUBLIC_SOCKET_ROOM,
            envType: process.env.PUBLIC_ENV_TYPE
        }
    },

    vite: {
        optimizeDeps: {
            include: ['localforage', '@unhead/vue', 'v-calendar', 'vue3-roulette']
        }
    }
});
