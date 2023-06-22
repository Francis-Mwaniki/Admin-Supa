<template>
  <div class="min-h-screen bg-gray-950 text-white">
    <UContainer>
      <NuxtPage />
    </UContainer>

    <UNotifications />
  </div>
</template>

<script setup>
const { account, ID } = useAppwrite();
const phone = ref("");
onMounted(() => {
  phone.value = prompt("Enter your phone number");
  const promise = account.createPhoneSession(ID.unique(), phone.value);
  promise
    .then((result) => {
      console.log(result.secret);
      alert("OTP sent to your phone");
    })
    .catch((error) => {
      console.log(error);
      alert("Error");
    });
});
</script>
