<script setup>
import { useFetch } from "nuxt/app";
import { ref, computed, onMounted } from "vue";

const client = useSupabaseClient();
const user = useSupabaseUser();
const auth = useSupabaseAuthClient();
const router = useRouter();

const showModal = ref(false);

const closeModal = () => {
  showModal.value = false;
};
onMounted(() => {
  setTimeout(() => {
    showModal.value = true;
  }, 3000);
});
/* watchEffect if user redirect to Dashboard  reload browser once */
watchEffect(() => {
  if (user.value) {
    router.push("/Dashboard");
  } else {
    router.push("/Login");
  }
});

// onMounted(() => {
//   const data = useFetch("/api/mpesa");
//   return new Promise((resolve, reject) => {
//     setTimeout(() => {
//       resolve(data);
//     }, 2000);
//     console.log(data);
//   });
// });

/* sort products by title */

/* add to supabase */

const toast = useToast();
</script>

<template>
  <div v-if="!user">
    <div>
      <!-- loading div with animate pulse if show Modal is false -->
      <div v-if="!showModal" class="animate-bounce">
        <div
          class="flex items-center justify-center mx-auto my-auto min-h-screen gap-x-2"
        >
          <div class="mt-4 w-3 h-3 bg-gray-200 rounded-full animate-spin"></div>
          <div class="mt-4 w-3 h-3 bg-gray-200 rounded-full animate-spin"></div>
          <div class="mt-4 w-3 h-3 bg-gray-200 rounded-full animate-spin"></div>
        </div>
      </div>
      <Register :showModal="showModal" />
    </div>
  </div>
</template>
