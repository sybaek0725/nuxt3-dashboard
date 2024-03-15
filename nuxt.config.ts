// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    devtools: { enabled: true },

    ssr: false,

    css: ['@/assets/scss/index.scss'],

    modules: ['vuetify-nuxt-module', '@pinia/nuxt'],

    vuetify: {
        moduleOptions: {
            /* module specific options */
        },
        vuetifyOptions: {
            /* vuetify options */
            icons: {
                defaultSet: 'mdi',
                sets: ['mdi', 'fa'],
            },
        },
    },

    pinia: {
        storesDirs: ['./stores/**'],
    },
});
