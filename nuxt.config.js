// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    target: 'static',
    router: {
        base: '/main/'
    },
    server: {
        port: 3001, // default: 3000
    },
    typescript: false,
    plugins: ['~/plugins/pinia.ts'], 
    app: {
        head: {
            title: 'fashtsaly dashboard',
            link: [
                {
                    id: 'theme-css',
                    rel: 'stylesheet',
                    type: 'text/css',
                    href: '/themes/aura-light-green/theme.css'
                }
            ]
        }
    },
    runtimeConfig: {
        public: {
          API_BASE_URL: 'https://fashtsaly.com/API/public/',
        },
    },
    modules: ['nuxt-primevue', '@pinia/nuxt', 'nuxt-tiptap-editor'],
    pinia: {
        storesDirs: ['./stores/**', './custom-folder/stores/**'],
    },
    primevue: {
        options: { ripple: true },
        components: {
            exclude: ['Editor']
        }
    },
    script: [
        {
            strategy: 'lazyOnload',
            src: 'https://www.googletagmanager.com/gtag/js?id=UA-93461466-1'
        },
        {
            id: 'ga-analytics',
            strategy: 'lazyOnload',
            children: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', 'UA-93461466-1');
            `
        }
    ],
    css: ['primeicons/primeicons.css', 'primeflex/primeflex.scss', 'primevue/resources/primevue.min.css', '@/assets/styles.scss']
});