import nitroConfigHook from "./nuxt-config/hooks/nitro";
import viteConfig from "./nuxt-config/vite";

export default defineNuxtConfig({
    ssr: false,

    hooks: {
        ...nitroConfigHook,
    },

    modules: [
        '@injectivelabs/ui-shared',
        "@nuxtjs/tailwindcss",
        "@pinia/nuxt",
        "@vueuse/nuxt"
    ],

    typescript: {
        typeCheck: "build",
    },

    css: ['@/assets/css/tailwind.css'],

    sourcemap: {
        server: false,
        client: true,
    },

    imports: {
        dirs: ["store/**"],
    },

    pinia: {
        autoImports: ["defineStore"],
    },

    vite: viteConfig,

    plugins: [{src: "./nuxt-config/buffer.ts", ssr: false}],
});
