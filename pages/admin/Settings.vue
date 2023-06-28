<template>
  <!-- <Content title="Settings" /> -->

  <!-- settings tailwindcss -->
  <div class="flex flex-col items-center justify-center min-h-screen py-2">
    <div
      class="flex flex-col items-center justify-center bg-white shadow-md rounded-3xl w-96 md:w-96 p-10 space-y-5"
    >
      <h2 class="font-bold text-3xl tracking-wide">Settings</h2>
      <div class="flex flex-col space-y-4">
        <div class="flex flex-col space-y-1 w-full">
          <label for="phone" class="font-semibold text-gray-500">Phone</label>
          <input
            type="text"
            name="phone"
            id="phone"
            class="border-2 border-gray-200 p-3 rounded-lg focus:outline-none focus:border-blue-500"
            placeholder="Phone"
            v-model="phone"
          />
        </div>
        <div class="flex flex-col space-y-1 w-full">
          <label for="otp" class="font-semibold text-gray-500">OTP</label>
          <input
            type="text"
            name="otp"
            id="otp"
            class="border-2 border-gray-200 p-3 rounded-lg focus:outline-none focus:border-blue-500"
            placeholder="OTP"
            v-model="otp"
          />
        </div>
        <div class="flex flex-col-reverse md:flex-row md:justify-between items-center">
          <button
            class="bg-blue-500 text-white font-semibold px-6 py-3 rounded-lg mr-4 w-full md:w-1/2"
            @click="getOtpFromUser"
          >
            Get OTP
          </button>
          <button
            class="bg-blue-500 text-white font-semibold px-6 py-3 rounded-lg w-full md:w-1/2"
            @click="verify"
          >
            Verify
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Content from "../../components/Content.vue";

export default {
  components: {
    Content,
  },
};
</script>
