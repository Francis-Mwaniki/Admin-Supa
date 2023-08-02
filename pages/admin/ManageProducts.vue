<template>
  <div>
    <ProductsComponent />
  </div>
</template>

<script setup>
const token = ref("");
const router = useRouter();
onMounted(() => {});

onBeforeMount(() => {
  token.value = localStorage.getItem("token");
  console.log(token.value);
  if (token.value == null) {
    router.push("/Login");
  }
});

watch(token, (value) => {
  if (value == null) {
    router.push("/Login");
  }
});
</script>

<style scoped></style>
