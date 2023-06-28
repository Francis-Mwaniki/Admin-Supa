<template>
  <div
    id="container"
    @click="handleClose"
    class="fixed inset-0 bg-gray-800 bg-opacity-30 backdrop-blur-sm flex justify-center items-center opacity-100"
  >
    <div
      class="bg-gray-950 rounded-3xl w-1/4 max-sm:w-5/6 transform transition-all duration-300 ease-in-out text-white"
    >
      <form @submit="handleSubmit" class="p-4 m-4">
        <h1
          class="text-2xl text-indigo-500 text-center font-medium mb-7 max-sm:text-center max-sm:text-lg"
        >
          Topup Your Account
        </h1>
        <div class="flex justify-center items-center max-sm:flex-col">
          <input
            type="text"
            name="phoneNumber"
            placeholder="Enter your phone Number"
            v-model="payment.phoneNumber"
            @input="handleChange"
            class="w-full p-2 outline-none border-gray-500 border rounded text-sm font-medium"
          />
        </div>
        <div class="mt-5 flex justify-center items-center max-sm:flex-col">
          <input
            type="text"
            name="amount"
            placeholder="Enter amount in KSH"
            v-model="payment.amount"
            @input="handleChange"
            class="w-full p-2 outline-none border-gray-500 border rounded text-sm font-medium"
          />
        </div>
        <div
          class="mt-8 border-t-2 border-gray-200 pt-7 flex items-center justify-center max-sm:mt-6 max-sm:gap-8"
        >
          <button
            class="py-2 px-2 w-full h-12 text-lg font-medium rounded text-white bg-indigo-600 max-sm:py-2 sm:px-2 max-sm:text-center max-sm:w-full max-sm:text-xs max-sm:px-3"
            :class="
              store.isLoading
                ? 'cursor-not-allowed bg-gray-500 text-white '
                : 'cursor-pointer bg-indigo-600 text-white'
            "
            type="submit"
          >
            <template v-if="store.isLoading">
              <div class="flex justify-center flex-row">
                <span>Sending...</span>
                <Icon
                  name="line-md:loading-twotone-loop"
                  class="animate-spin text-white ease-in-out inline-block ml-4 h-6 w-6"
                  :disabled="store.isLoading"
                />
              </div>
            </template>
            <template v-else> Send </template>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch } from "vue";
import { userStore } from "../../store/user";

export default {
  setup() {
    const store = userStore();
    const isMpesaOpen = ref(false);
    const toast = useToast();

    const department = ref([]);
    const payment = ref({
      phoneNumber: "",
      amount: "",
    });

    const handleSubmit = async (e) => {
      e.preventDefault();
      store.isLoading = true;
      const data = {
        phoneNumber: payment.value.phoneNumber,
        amount: payment.value.amount,
      };
      console.log(data);
      toast.add({
        title: "Success",
        description: "Payment sent successfully",
        type: "success",
        timeout: 2000,
      });
      setTimeout(() => {
        store.isLoading = false;
      }, 2000);
    };
    const handleChange = (e) => {
      payment.value = {
        ...payment.value,
        [e.target.name]: e.target.value,
      };
    };
    const handleClose = (e) => {
      if (e.target.id === "container") {
        isMpesaOpen.value = false;
      }
    };

    return {
      store,
      handleSubmit,
      handleChange,
      handleClose,
      isMpesaOpen,
      payment,
    };
  },
};
</script>
