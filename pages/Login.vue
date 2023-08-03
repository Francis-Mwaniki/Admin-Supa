<!-- components/RegisterForm.vue -->

<template>
  <div class="bg-black">
    <div class="flex justify-center items-center h-screen">
      <!--  :class="{ 'pt-64 pb-2 sm:pt-3': isRegister, 'pt-0 sm:pt-3': isLogin }" -->
      <UModal v-model="showmode" @close="$router.push('/')">
        <form
          @submit.prevent="loginUser"
          class="sm:w-full p-8 bg-gray-900 rounded shadow-lg transition-all duration-500 transform w-full overflow-auto"
        >
          <h2 class="text-2xl mb-4">Login</h2>
          <!-- NAME -->

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

          <div class="flex">
            <button
              type="submit"
              :disabled="isLogging"
              class="inline-flex items-center focus:outline-none mr-4 bg-[#ff4e09] text-white py-2 px-4 rounded"
              :loading="isLogging"
            >
              <Icon name="eos-icons:bubble-loading" class="h-8 w-8" v-if="isLogging" />
              {{ isLogging ? "processing" : "login" }}
            </button>
          </div>
          <!-- dont have an account -->
          <div class="flex justify-end">
            <p class="text-gray-400">
              Don't have an account?
              <NuxtLink to="/Register" class="text-blue-500 cursor-pointer">
                Register
              </NuxtLink>
            </p>
          </div>
        </form>
      </UModal>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
const isRegister = ref(true);
const isLogin = ref(false);
const showmode = ref(true);
const email = ref("");
const password = ref("");
const toast = useToast();
const isLogging = ref(false);
const router = useRouter();

const loginUser = async () => {
  isLogging.value = true;
  const data = {
    email: email.value,
    password: password.value,
  };
  try {
    const url = "https://acewears.up.railway.app/auth/signin/";
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
      isLogging.value = false;
      if (data.user.user_type === "ADMIN") {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        toast.add({
          timeout: 3000,
          title: "Success",
          description: "User logged in successfully",
        });

        router.push("/admin/ManageProducts");
      } else {
        toast.add({
          timeout: 3000,
          title: "Error",
          description: "You are not an admin",
        });
        router.push("/Register");
      }
    } else {
      const error = await response.json();
      toast.add({
        timeout: 3000,
        title: "Error",
        description: error.message,
      });
      console.log(error);
      isLogging.value = false;
    }
  } catch (error) {
    console.log(error);
    toast.add({
      timeout: 3000,
      title: "Error",
      description: error.message,
    });
    isLogging.value = false;
  }
};
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
