<template>
  <div class="mx-auto py-8 bg-gray-950 min-h-screen">
    <div class="max-w-lg mx-auto bg-gray-800 shadow-md rounded-lg p-6">
      <h1 class="text-2xl font-bold mb-4 text-green-600">Profile</h1>
      <div class="mb-4">
        <label class="font-semibold text-gray-100">Email:</label>
        <p class="text-gray-50">{{ profile.email }}</p>
      </div>
      <div class="mb-4">
        <label class="font-semibold text-gray-100">Confirmed Email:</label>
        <p class="text-gray-50">{{ formatDate(profile.email_confirmed_at) }}</p>
      </div>
      <div class="mb-4">
        <label class="font-semibold text-gray-100">Last Sign-in:</label>
        <p class="text-gray-50">{{ formatDate(profile.last_sign_in_at) }}</p>
      </div>
      <div class="mb-4">
        <label class="font-semibold text-gray-100">Last Sign-in:</label>
        <p class="text-gray-50">{{ formatDate(profile.last_sign_in_at) }}</p>
      </div>
      <div class="mb-4">
        <label class="font-semibold text-gray-100">Phone:</label>
        <p class="text-gray-50">{{ profile.phone || "Not available" }}</p>
      </div>
      <div class="mb-4">
        <label class="font-semibold text-gray-100">Role:</label>
        <p class="text-gray-50">{{ profile.role }}</p>
      </div>
      <div class="mb-4">
        <label class="font-semibold text-gray-100">Created At:</label>
        <p class="text-gray-50">{{ formatDate(profile.created_at) }}</p>
      </div>
      <div class="mb-4">
        <label class="font-semibold text-gray-100">Updated At:</label>
        <p class="text-gray-50">{{ formatDate(profile.updated_at) }}</p>
      </div>
      <!-- go back icon  -->
      <div class="flex justify-center mt-4">
        <UButton
          color="green"
          variant="solid"
          class="text-white px-7 justify-self-center"
          @click="$router.push('/Dashboard')"
        >
          <Icon name="ic:round-arrow-back" class="mr-2" />
          Go Back
        </UButton>
      </div>
    </div>
  </div>
</template>

<script setup>
import moment from "moment";
const user = useSupabaseUser();
const profile = computed(() => user.value || {});

function formatDate(date) {
  return date ? moment(date).format("MMMM Do YYYY, h:mm:ss a") : "Never";
}
</script>

<style scoped>
.container {
  background-color: #f3f4f6;
}

.max-w-lg {
  max-width: 30rem;
}

.bg-white {
  background-color: #ffffff;
}

.shadow-md {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.rounded-lg {
  border-radius: 0.5rem;
}

.p-6 {
  padding: 1.5rem;
}

.text-2xl {
  font-size: 1.5rem;
  line-height: 2rem;
}

.font-bold {
  font-weight: 700;
}

.mb-4 {
  margin-bottom: 1rem;
}

.font-semibold {
  font-weight: 600;
}

.text-gray-200 {
  color: #4b5563;
}

/* Add any additional custom styles here */
</style>
