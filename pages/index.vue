<!-- components/RegisterForm.vue -->

<template>
  <!-- <div class="bg-opacity-60 bg-black relative" /> -->
  <div

    class="flex justify-center items-center inset-0 h-full w-full fixed z-40 bg-gray-950 min-w-full overflow-auto"
    :class="{ 'pt-64 pb-2 sm:pt-3': isRegister, 'pt-0 sm:pt-3': isLogin }"

  >

    <UModal v-model="isRegister" v-if="isRegister">
      <form
        v-if="isRegister"
        @submit.prevent="registerUser"
        class="sm:w-full p-8 bg-gray-900 rounded shadow-lg transition-all duration-500 transform w-full overflow-auto"
      >
        <h2 class="text-2xl mb-4">Register</h2>
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
            <span class="text-blue-500 cursor-pointer" @click="goTo('Login')">
              Login
            </span>
          </p>
        </div>
      </form>
    </UModal>
    <UModal v-model="isLogin" v-if="isLogin">
      <form
        v-if="isLogin"
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
            <span class="text-blue-500 cursor-pointer" @click="goTo('Register')">
              Register
            </span>
          </p>
        </div>
      </form>
    </UModal>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
const isRegister = ref(true);
const isLogin = ref(false);
const name = ref("");
const productKey = ref("");
const email = ref("");
const password = ref("");
const phone = ref("");
const confirmPassword = ref("");
const isRegistering = ref(false);
const toast = useToast();
const isLogging = ref(false);
const router = useRouter();
const goTo = (page) => {
  if (page === "Register") {
    isRegister.value = true;
    isLogin.value = false;
  } else {
    isRegister.value = false;
    isLogin.value = true;
  }
};
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
    const url = "https://acewears.onrender.com/auth/signup/ADMIN";
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
const loginUser = async () => {
  isLogging.value = true;
  const data = {
    email: email.value,
    password: password.value,
  };
  try {
    const url = "https://acewears.onrender.com/auth/signin/";
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
        router.push("/");
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

onBeforeMount(() => {
  if (router.currentRoute.value.path === "/Login") {
    isRegister.value = false;
    isLogin.value = true;
  }
  const token = localStorage.getItem("token");
  if (token) {
    router.push("/admin/ManageProducts");
  }
});
/* watch  token */
watch(
  () => localStorage.getItem("token"),
  (token) => {
    if (token) {
      router.push("/admin/ManageProducts");
    }
  }
);
</script>

<style scoped>
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.modal-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
}

.modal-container {
  background-color: white;
  padding: 2rem;
  border-radius: 0.5rem;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.modal-content {
  max-width: 400px;
  margin: 0 auto;
}
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
