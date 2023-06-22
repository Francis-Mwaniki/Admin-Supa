<template>
  <div v-if="!store.showResetModal" class="animate-bounce">
    <div class="flex items-center justify-center mx-auto my-auto min-h-screen gap-x-2">
      <div class="mt-4 w-3 h-3 bg-gray-200 rounded-full animate-spin"></div>
      <div class="mt-4 w-3 h-3 bg-gray-200 rounded-full animate-spin"></div>
      <div class="mt-4 w-3 h-3 bg-gray-200 rounded-full animate-spin"></div>
    </div>
  </div>
  <div class="flex justify-center items-center min-h-screen" v-if="store.showResetModal">
    <form
      @submit.prevent="resetPassword"
      class="md:w-1/3 w-full p-8 bg-gray-900 rounded shadow-lg transition-all duration-500 transform"
      :class="{
        'translate-y-0 opacity-100': store.showResetModal,
        '-translate-y-10 opacity-0': !store.showResetModal,
      }"
    >
      <h2 class="text-2xl mb-4">Reset Password</h2>

      <div class="mb-4">
        <label for="email" class="block mb-2">Email</label>
        <input
          type="email"
          id="email"
          v-model="email"
          class="w-full border px-4 py-2 rounded"
        />
      </div>

      <div class="flex my-5">
        <UButton
          type="submit"
          class="flex w-full py-4 text-white font-medium items-center justify-center space-x-3 rounded-md shadow-lg bg-green-600 filter hover:brightness-90"
          color="green"
          variant="solid"
          :disabled="store.resetting"
          :loading="store.resetting"
        >
          {{ store.resetting ? "processing" : "Reset password" }}
        </UButton>
      </div>
      <!-- dont have an account -->
      <div class="flex justify-end">
        <p class="text-gray-400">
          Already have an account?
          <span
            class="text-blue-500 cursor-pointer"
            @click="
              $router.push('/Login');
              closeModal();
            "
          >
            Login
          </span>
        </p>
      </div>
    </form>
  </div>
</template>

<script setup>
import { userStore } from "~/store/user.js";
const toast = useToast();
const user = useSupabaseUser();
const client = useSupabaseClient();
const auth = useSupabaseAuthClient();
const store = userStore();
const closeModal = () => {
  store.showResetModal = false;
};

let res = ref(null);
const email = ref("");
const resetPassword = async () => {
  if (!email.value)
    return toast.add({
      id: "reset-password-error",
      title: "Error",
      description: "Please enter your email",
    });
  try {
    const { data, error } = await auth.auth.resetPasswordForEmail(email.value, {
      redirectTo: "http://localhost:3000/Login",
    });
    if (error) {
      toast.add({
        id: "reset-password-error",
        title: "Error",
        description: error.message,
      });
    } else {
      res.value = data;
      console.log(data);
      toast.add({
        id: "reset-password-success",
        title: "Success",
        description: "Check your email for the password reset link",
        type: "success",
      });
    }
  } catch (error) {
    toast.add({
      id: "reset-password-error",
      title: "Error",
      description: error.message,
    });
  }
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
