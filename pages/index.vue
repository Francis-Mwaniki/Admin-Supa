<template>
  <!-- go to login -->
  <div class="bg-black">
    <UModal v-model="gotoLoginOrSignUp" @close="redirect">
      <div class="flex justify-end">
        <button
          class="bg-[#ff4e09] font-medium p-2 md:p-4 text-white uppercase"
          @click="redirect"
        >
          <Icon name="ic:sharp-close" class="h-9 w-9" />
        </button>
      </div>
      <div class="flex justify-center sm:min-h-screen h-screen">
        <div class="w-1/2">
          <div class="flex justify-end">
            <!-- create a login or signup container to redirect user  using tailwindcss -->
            <div class="max-w-md w-full my-5">
              <div>
                <img
                  class="mx-auto h-12 w-auto"
                  src="https://res.cloudinary.com/dwxly1dc7/image/upload/v1690709239/8838572ba14d424fac2b9eabdcc3215e_zhghil.png"
                  alt="Workflow"
                />
                <h2 class="mt-6 text-center text-xl font-extrabold text-white">
                  Welcome to Acewears Community
                </h2>
              </div>
              <div class="mt-8 flex justify-center py-7">
                <NuxtLink
                  to="/Login"
                  class="px-4 py-2 bg-slate-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500"
                >
                  Login
                </NuxtLink>
                <NuxtLink
                  to="/Register"
                  class="ml-3 px-4 py-2 bg-slate-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500"
                >
                  Register
                </NuxtLink>
              </div>

              <!-- copyrights -->
              <div class="mt-6 text-center text-white">
                <p class="mt-2 text-sm text-gray-500">
                  &copy; 2023 Acewears, Inc. All rights reserved.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </UModal>
  </div>

  <!-- login -->
</template>

<script setup>
const gotoLoginOrSignUp = ref(true);

const redirect = () => {
  navigateTo("/Login");
};

const goTologin = () => {
  gotoLoginOrSignUp.value = false;
  navigateTo("/Login");
};

const goToSignUp = () => {
  gotoLoginOrSignUp.value = false;
  navigateTo("/SignUp");
};
</script>

<style scoped>
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
