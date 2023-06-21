<!-- components/RegisterForm.vue -->

<template>
  <div v-if="!showModal" class="animate-bounce">
    <div class="flex items-center justify-center mx-auto my-auto min-h-screen gap-x-2">
      <div class="mt-4 w-3 h-3 bg-gray-200 rounded-full animate-spin"></div>
      <div class="mt-4 w-3 h-3 bg-gray-200 rounded-full animate-spin"></div>
      <div class="mt-4 w-3 h-3 bg-gray-200 rounded-full animate-spin"></div>
    </div>
  </div>
  <div class="flex justify-center items-center h-screen" v-if="showModal">
    <form
      @submit.prevent="LoginUser()"
      class="w-1/3 p-8 bg-gray-900 rounded shadow-lg transition-all duration-500 transform"
      :class="{
        'translate-y-0 opacity-100': showModal,
        '-translate-y-10 opacity-0': !showModal,
      }"
    >
      <h2 class="text-2xl mb-4">Welcome Back!</h2>

      <div class="mb-4">
        <label for="email" class="block mb-2">Email</label>
        <input
          type="email"
          id="email"
          v-model="email"
          class="w-full border px-4 py-2 rounded"
        />
      </div>
      <div class="mb-4">
        <label for="password" class="block mb-2">Password</label>
        <input
          type="password"
          v-model="password"
          id="password"
          class="w-full border px-4 py-2 rounded"
        />
      </div>

      <div class="flex">
        <UButton
          type="submit"
          class="text-white px-7 justify-self-center"
          color="blue"
          variant="solid"
          :disabled="isLogin"
          :loading="isLogin"
        >
          {{ isLogin ? "Processing" : "Login" }}
        </UButton>
      </div>
      <!-- dont have an account -->
      <div class="flex justify-end">
        <p class="text-gray-400">
          Don't have an account?
          <span
            class="text-blue-500 cursor-pointer"
            @click="
              $router.push('/');
              closeModal();
            "
          >
            Register
          </span>
        </p>
      </div>
    </form>
  </div>
</template>

<script>
import { ref } from "vue";
export default {
  setup() {
    const client = useSupabaseClient();
    const user = useSupabaseUser();
    const toast = useToast();
    const showModal = ref(false);
    const auth = useSupabaseAuthClient();
    const router = useRouter();
    const isLogin = ref(false);
    const email = ref("");
    const password = ref("");

    const closeModal = () => {
      showModal.value = false;
    };
    onMounted(() => {
      setTimeout(() => {
        showModal.value = true;
      }, 3000);
    });

    const LoginUser = async () => {
      isLogin.value = true;
      const { user, error } = await auth.auth.signInWithPassword({
        email: email.value,
        password: password.value,
      });

      if (error) {
        isLogin.value = false;
        toast.add({
          title: "Error",
          description: error.message,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        toast.add({
          title: "Error",
          description: "Go to your email and verify your account",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        console.error("Error logging user:", error);
      } else {
        toast.add({
          title: "success",
          description: " Admin Logged in successfully",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        isLogin.value = false;
        console.log("User Logged:", user);
        setTimeout(() => {
          router.push("/Dashboard");
        }, 3000);
        // Perform any additional actions after successful registration
        // e.g., redirect to a dashboard page
      }
    };

    return {
      email,
      password,
      closeModal,
      isLogin,
      LoginUser,
      showModal,
    };
  },
};
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
