// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ['@nuxthq/ui',
  '@nuxtjs/partytown',
  '@nuxt/image',
  "nuxt-icon",
  "nuxt-lodash",
  '@nuxtjs/cloudinary',
  "@pinia/nuxt",
  // 'nuxt-security',
  '@nuxtjs/supabase',
  '@nuxt/image',
  "@pinia-plugin-persistedstate/nuxt",
  
],
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
