// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ['@nuxthq/ui',
  '@nuxtjs/partytown',
  '@nuxt/image',
  'nuxt-delay-hydration',
  "nuxt-icon",
  "nuxt-lodash",
  '@nuxtjs/cloudinary',
  "@pinia/nuxt",
  // 'nuxt-security',
  '@nuxtjs/supabase',
  '@nuxt/image',
  "@pinia-plugin-persistedstate/nuxt",
  
],
delayHydration: {
  // enables nuxt-delay-hydration in dev mode for testing
  debug: process.env.NODE_ENV === 'development'
},
partytown: {
 
},
  cloudinary: {
    cloudName: 'dzvtkbjhc',
  
  },
  image: {
    cloudinary: {
      baseURL: 'https://res.cloudinary.com/douqbebwk/image/upload/'
    }
  },

css: ["~/assets/css/tailwind.css","~/assets/css/root.css"],

// .eslintrc

// security: {
//   rateLimiter: {
//     tokensPerInterval: 100,
//     interval: 'hour',
//   }
// }


})
