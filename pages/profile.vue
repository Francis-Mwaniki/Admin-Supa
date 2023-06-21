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
          Go Back
        </UButton>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      profile: {
        provider: "email",
        providers: ["email"],
        aud: "authenticated",
        confirmation_sent_at: "2023-06-21T06:38:30.416048Z",
        confirmed_at: "2023-06-21T06:38:49.737004Z",
        created_at: "2023-06-21T06:38:30.410163Z",
        email: "francismwaniki630@gmail.com",
        email_confirmed_at: "2023-06-21T06:38:49.737004Z",
        id: "4ca483fd-94bc-497e-ad17-867a5aa57810",
        identities: [
          /* identities array */
        ],
        last_sign_in_at: "2023-06-21T10:23:45.526632Z",
        phone: "",
        recovery_sent_at: "2023-06-21T10:22:52.569134Z",
        role: "authenticated",
        updated_at: "2023-06-21T10:23:45.52831Z",
        user_metadata: {}, // Add the user_metadata object here
      },
    };
  },
  methods: {
    formatDate(date) {
      // Implement your date formatting logic here
      // Example: return new Date(date).toLocaleDateString();
      return date;
    },
  },
};
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
