<!-- components/RegisterForm.vue -->

<template>
  <div v-if="!store.isUpdating" class="animate-bounce">
    <div class="flex items-center justify-center mx-auto my-auto min-h-screen gap-x-2">
      <div class="mt-4 w-3 h-3 bg-gray-200 rounded-full animate-spin"></div>
      <div class="mt-4 w-3 h-3 bg-gray-200 rounded-full animate-spin"></div>
      <div class="mt-4 w-3 h-3 bg-gray-200 rounded-full animate-spin"></div>
    </div>
  </div>
  <div class="flex justify-center items-center h-screen" v-if="store.isUpdating">
    <form
      @submit.prevent="updateUser()"
      class="w-1/3 p-8 bg-gray-900 rounded shadow-lg transition-all duration-500 transform"
      :class="{
        'translate-y-0 opacity-100': store.isUpdating,
        '-translate-y-10 opacity-0': !store.isUpdating,
      }"
    >
      <h2 class="text-2xl mb-4">Update Profile</h2>

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
          :disabled="isUpdate"
          :loading="isUpdate"
        >
          {{ isUpdate ? "Processing" : "Update" }}
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
import { useRouter } from "vue-router";
import { userStore } from "~/store/user";
export default {
  setup() {
    const client = useSupabaseClient();
    const user = useSupabaseUser();
    const toast = useToast();
    const store = userStore();
    const auth = useSupabaseAuthClient();
    const router = useRouter();
    const isUpdate = ref(false);
    const email = ref("");
    const password = ref("");

    const closeModal = () => {
      store.isUpdating = false;
    };
    onMounted(() => {
      setTimeout(() => {
        store.isUpdating = true;
      }, 3000);
    });

    const updateUser = async () => {
      isUpdate.value = true;
      const { user, error } = await auth.auth.signInWithPassword({
        email: email.value,
        password: password.value,
      });

      if (error) {
        isUpdate.value = false;
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
        isUpdate.value = false;
        console.log("User Logged:", user);
        setTimeout(() => {
          router.push("/Dashboard");
        }, 3000);
        // Perform any additional actions after successful registration
        // e.g., redirect to a dashboard page
      }
    };
    /* populate user to email, password  from client supabase*/
    const populateUser = () => {
      email.value = user.value.email;
      password.value = user.value.password;
    };

    return {
      email,
      password,
      closeModal,
      isUpdate,
      updateUser,
      store,
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
