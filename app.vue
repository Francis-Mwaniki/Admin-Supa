<template>
  <dashboard-layout>
    <NuxtPage />
  </dashboard-layout>
</template>

<script setup>
import DashboardLayout from "./components/dashboard/Layout.vue";
const { account, ID } = useAppwrite();
const phone = ref("");
const otp = ref("");
const getOtpFromUser = () => {
  otp.value = prompt("Enter OTP");
};
onMounted(() => {
  // phone.value = prompt("Enter your phone number");
  // const promise = account.createPhoneSession(ID.unique(), phone.value,);
  // promise
  //   .then((result) => {
  //     console.log(result.secret);
  //     alert("OTP sent to your phone");
  //   })
  //   .catch((error) => {
  //     console.log(error);
  //     alert("Error");
  //   });
  //   const verify = () => {
  //     const promise = account.get();
  //     promise
  //       .then((result) => {
  //         console.log(result);
  //         alert("OTP verified");
  //       })
  //       .catch((error) => {
  //         console.log(error);
  //         alert("Error");
  //       });
  //   };
  //   verify();
});
</script>
<style>
@import url("https://fonts.googleapis.com/css2?family=Poppins&display=swap");
* {
  font-family: "Poppins", sans-serif;
}
</style>
