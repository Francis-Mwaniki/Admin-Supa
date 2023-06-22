// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ['@nuxthq/ui',
  '@nuxtjs/partytown',
  '@nuxt/image',
  "nuxt-appwrite",
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
appwrite: {
  endpoint: 'https://cloud.appwrite.io/v1',
  project: '6493f90468e18c956a76',
  key:'c0e67d74665ffb2a277fa8b6804789a312f688dfaf98b0705bdc0c72685d14c0d2b562676acc267b577ddd778eda34ee1321a4499aa1e56eef40f35eec8633a117b837acdea35a5df76217f81f1cb4becf5b0dd1722300487da19e3cc816e49f89ba8061d9c6a33a6bcf179efdf180e974ce98c26533de8a5483b743de4a0748'
},
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
