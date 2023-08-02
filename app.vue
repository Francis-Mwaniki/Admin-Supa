<template>
  <dashboard-layout>
    <UContainer>
      <NuxtPage />
    </UContainer>

    <UNotifications />
  </dashboard-layout>
</template>

<script setup>
import DashboardLayout from "./components/dashboard/Layout.vue";
import { io } from "socket.io-client";
import { userStore } from "~/store/user";
const { account, ID } = useAppwrite();
const phone = ref("");
const otp = ref("");
const socket = io("https://acewears.up.railway.app/", {
  transports: ["websocket", "polling", "flashsocket"],
});
const getOtpFromUser = () => {
  otp.value = prompt("Enter OTP");
};
const store = userStore();

/* watch sockets */

watchEffect(() => {
  socket.on("connect", () => {
    console.log("connected");
  });
  socket.on("order-create", (desc) => {
    store.notification.push(desc);
    console.log("desc", desc);
  });

  socket.on("order-update", (desc) => {
    console.log("desc", desc);
    store.notification.push(desc);
  });
  socket.on("disconnect", () => {
    console.log("disconnected");
  });
});
</script>
<style>
@import url("https://fonts.googleapis.com/css2?family=Poppins&display=swap");
* {
  font-family: "Poppins", sans-serif;
}
input {
  color: black;
}
</style>
