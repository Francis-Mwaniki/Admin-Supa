<template>
  <div>
    <!-- component -->
    <section class="pb-10 bg-opacity-50">
      <div class="mx-auto container max-w-2xl md:w-3/4 shadow-md">
        <div class="space-y-6">
          <hr class="p-4 border-t-2 bg-opacity-5 border-indigo-400 rounded-t" />
          <h2 class="md:w-1/3 mx-auto max-w-sm dark:text-white text-black">
            Personal info
          </h2>
          <div
            class="md:inline-flex space-y-4 md:space-y-0 w-full p-4 text-gray-500 items-center gap-y-5"
          >
            <div class="md:w-2/3 mx-auto max-w-sm space-y-5 gap-y-3">
              <div>
                <label class="text-sm dark:text-white text-black">Full name</label>
                <div class="w-full inline-flex border">
                  <div class="w-1/12 pt-2 bg-gray-100">
                    <Icon name="ic:round-verified-user" class="w-4" />
                  </div>
                  <input
                    type="text"
                    class="w-11/12 focus:outline-none focus:text-gray-600 p-2 dark:focus:text-white"
                    v-model="user.name"
                  />
                </div>
              </div>
              <div>
                <div class="pt-5">
                  <label class="text-sm dark:text-white text-black">Phone number</label>
                  <div class="w-full inline-flex border">
                    <div class="pt-2 w-1/12 bg-gray-100">
                      <Icon name="ic:round-phone" class="w-4" />
                    </div>
                    <input
                      type="text"
                      v-model="user.phone"
                      class="w-11/12 focus:outline-none focus:text-gray-600 p-2 dark:focus:text-white"
                    />
                  </div>
                </div>
                <div class="pt-5">
                  <label class="text-sm dark:text-white text-black"
                    >change password</label
                  >
                  <div class="w-full inline-flex border-b my-2">
                    <div class="w-1/12 pt-2 bg-gray-100">
                      <Icon name="ic:round-password" class="w-4" />
                    </div>
                    <input
                      type="password"
                      v-model="user.password"
                      class="w-11/12 focus:outline-none focus:text-gray-600 p-2 dark:focus:text-white"
                    />
                  </div>
                  <div class="w-full inline-flex border-b my-2">
                    <div class="w-1/12 pt-2 bg-gray-100">
                      <Icon name="ic:round-password" class="w-4" />
                    </div>
                    <input
                      type="password"
                      v-model="user.password"
                      class="w-11/12 focus:outline-none focus:text-gray-600 dark:focus:text-white p-2"
                    />
                  </div>
                </div>

                <button
                  class="inline-flex items-center focus:outline-none mr-4 mt-6 bg-[#ff4e09] text-white py-2 px-4 rounded"
                >
                  <Icon name="ic:sharp-update" class="w-4 mr-2" />
                  update
                </button>
              </div>
            </div>
          </div>

          <hr class="p-4 border-t-2 bg-opacity-5 border-indigo-400 rounded-t" />

          <div class="w-full p-4 text-right text-gray-500">
            <button
              @click="deleteUser"
              class="inline-flex items-center focus:outline-none mr-4 bg-[#ff4e09] text-white py-2 px-4 rounded"
            >
              <svg fill="none" class="w-4 mr-2" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
              Delete account
            </button>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from "vue";
import moment from "moment";
const router = useRouter();
const token = ref("");
const user = ref({
  name: "John Doe",
  phone: "1234567890",
  password: "1234567890",
});

/* let url = 'http://localhost:5000/auth/me';
  
  let options = {
    method: 'GET',
    headers: {
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiQnV5ZXIiLCJpZCI6MiwiaWF0IjoxNjg5MjMwMzY4LCJleHAiOjE2ODkzMTY3Njh9.uxEiw0Q7VRYYj4idn8S-ywLxaZA-WPggGANZta2pu9c'
    }
  };
  
  fetch(url, options)
    .then(res => res.json())
    .then(json => console.log(json))
    .catch(err => console.error('error:' + err)); */

const goTo = (path) => {
  router.push(path);
};

const fetchUser = async () => {
  const token = localStorage.getItem("token");

  let url = "https://acewears-app-production.up.railway.app/auth/me";

  //"http://localhost:5000/auth/me"
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    const data = await response.json();
    user.value.name = data.name;
    user.value.phone = data.phone;
    user.value.password = data.password;
    console.log(data);
  } catch (error) {
    console.log(error);
  }
};

onMounted(() => {
  token.value = localStorage.getItem("token");

  fetchUser();
});

const deleteUser = async () => {
  try {
    localStorage.removeItem("token");
    router.push("/");
  } catch (error) {
    console.log(error);
  }
};
const formatDate = (date) => {
  return moment(date).format("DD/MM/YYYY");
};
</script>

<style scoped></style>
