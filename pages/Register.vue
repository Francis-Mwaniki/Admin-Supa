<!-- components/RegisterForm.vue -->

<template>
  <div class="flex justify-center items-center h-screen">
    <UModal v-model="showmode" @close="$router.push('/Login')">
      <form
        @submit.prevent="registerUser"
        class="sm:w-full p-8 bg-gray-900 rounded shadow-lg transition-all duration-500 transform w-full overflow-auto"
      >
        <h2 class="text-2xl mb-4 text-white">Register as Admin</h2>
        <!-- NAME -->
        <div class="mb-4">
          <label for="name" class="block mb-2 text-white">Name</label>
          <input
            type="text"
            id="name"
            v-model="name"
            class="w-full border px-4 py-2 rounded dark:text-white dark:bg-gray-800"
          />
        </div>

        <div class="mb-4">
          <label for="email" class="block mb-2 text-white">Email</label>
          <input
            type="email"
            id="email"
            v-model="email"
            class="w-full border px-4 py-2 rounded dark:text-white dark:bg-gray-800"
          />
        </div>
        <div class="mb-4">
          <label for="password" class="block mb-2 text-white">Password</label>
          <input
            type="password"
            v-model="password"
            id="password"
            class="w-full border px-4 py-2 rounded dark:text-white dark:bg-gray-800"
          />
        </div>
        <div class="mb-4">
          <label for="confirmPassword" class="block mb-2 text-white"
            >ConfirmPassword</label
          >
          <input
            type="password"
            v-model="confirmPassword"
            id="confirmPassword"
            class="w-full border px-4 py-2 rounded dark:text-white dark:bg-gray-800"
          />
        </div>
        <div class="mb-4">
          <label for="productKey" class="block mb-2 text-white">Product Key</label>
          <input
            type="text"
            v-model="productKey"
            id="productKey"
            class="w-full border px-4 py-2 rounded dark:text-white dark:bg-gray-800"
          />
        </div>
        <!-- phone -->
        <div class="mb-4">
          <label for="phone" class="block mb-2 text-white">Phone</label>
          <input
            type="text"
            v-model="phone"
            id="phone"
            class="w-full border px-4 py-2 rounded dark:text-white dark:bg-gray-800"
          />
        </div>

        <div class="flex">
          <button
            type="submit"
            class="inline-flex items-center focus:outline-none mr-4 bg-[#ff4e09] text-white py-2 px-4 rounded"
            :disabled="isRegistering"
            :loading="isRegistering"
          >
            <Icon name="eos-icons:bubble-loading" class="h-8 w-8" v-if="isRegistering" />
            {{ isRegistering ? "processing" : "Signup" }}
          </button>
        </div>
        <!-- dont have an account -->
        <div class="flex justify-end">
          <p class="text-gray-400">
            Already have an account?
            <NuxtLink to="/Login" class="text-blue-500 cursor-pointer"> Login </NuxtLink>
          </p>
        </div>
      </form>
    </UModal>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
const name = ref("");
const productKey = ref("");
const showmode = ref(true);
const email = ref("");
const password = ref("");
const phone = ref("");
const confirmPassword = ref("");
const isRegistering = ref(false);
const toast = useToast();
const isLogging = ref(false);
const router = useRouter();

const registerUser = async () => {
  isRegistering.value = true;
  const data = {
    name: name.value,
    email: email.value,
    productKey: productKey.value,
    password: password.value,
    confirmPassword: confirmPassword.value,
    phone: phone.value,
  };
  try {
    const url = "https://acewears.up.railway.app/auth/signup/ADMIN";
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (response.ok) {
      const data = await response.json();
      console.log(data);
      toast.add({
        timeout: 3000,
        title: "Success",
        description: "User created successfully",
      });
      isRegistering.value = false;
      isLogging.value = true;
      setTimeout(() => {
        router.push("/Login");
      }, 3000);
    } else {
      const error = await response.json();
      toast.add({
        timeout: 3000,
        title: "Error",
        description: error.message,
      });
      console.log(error);
      isRegistering.value = false;
    }
  } catch (error) {
    console.log(error);
    toast.add({
      timeout: 3000,
      title: "Error",
      description: error.message,
    });
    isRegistering.value = false;
  }
};

// onBeforeMount(() => {
//   const token = localStorage.getItem("token");
//   if (token) {
//     router.push("/Login");
//   }
// });
/* watch  token */
// watch(
//   () => localStorage.getItem("token"),
//   (token) => {
//     if (token) {
//       router.push("/admin/ManageProducts");
//     }
//   }
// );
</script>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.5s, opacity 0.5s;
}

.slide-enter,
.slide-leave-to {
  opacity: 0;
  transform: translateY(-50px);
}
</style>
