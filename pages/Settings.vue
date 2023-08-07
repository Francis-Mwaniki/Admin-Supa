<template>
    <div>
      <!-- https://gist.github.com/goodreds/5b8a4a2bf11ff67557d38c5e727ea86c -->
      <button
        class="bg-[#ff4e09] hover:shadow-lg font-semibold text-white px-6 py-2 sm:text-base md:text-base lg:text-base xl:text-base text-sm flex justify-center items-center mx-auto"
        @click="addAdmin = true"
      >
        Add Another Admin
      </button>
  
      <div
        class="max-w-2xl mx-4 sm:max-w-sm md:max-w-sm lg:max-w-sm xl:max-w-sm sm:mx-auto md:mx-auto lg:mx-auto xl:mx-auto mt-16 bg-white shadow-xl rounded-lg text-gray-900 dark:dark:bg-neutral-900 dark:text-white"
      >
        <div class="rounded-t-lg h-32 overflow-hidden">
          <NuxtImg
            class="object-cover object-top w-full"
            src="https://images.unsplash.com/photo-1549880338-65ddcdfd017b?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&ixid=eyJhcHBfaWQiOjE0NTg5fQ"
            alt="Mountain"
          />
        </div>
        <UModal v-model="editProfileModal" v-if="editProfileModal">
          <div class="flex justify-end ">
            <button
              class="bg-[#ff4e09] font-medium p-2 md:p-4 text-white uppercase"
              @click="closeModal"
            >
              <Icon name="ic:sharp-close" class="h-9 w-9" />
            </button>
          </div>
          <div class="p-8 rounded-lg">
            <editProfile />
          </div>
        </UModal>
        <div
          class="mx-auto w-32 h-32 relative -mt-16 border-4 border-white rounded-full overflow-hidden"
        >
          <div class="flex justify-center items-center h-full bg-black">
            <div class="text-6xl font-bold text-white" v-if="!userStore().isLoading">
              <!-- first letter of the name -->
              {{ user?.name.charAt(0) }}
            </div>
            <div class="text-center mt-2" v-if="userStore().isLoading">
              <Icon name="eos-icons:bubble-loading" class="h-9 w-9" />
            </div>
          </div>
        </div>
        <div class="bg-black text-white">
          <div class="text-center mt-2" v-if="!userStore().isLoading">
            <h2 class="font-semibold">{{ user?.name }}</h2>
            <p class="">{{ user?.user_type }}</p>
            <!-- email  -->
            <p class="">{{ user?.email }}</p>
            <!-- date -->
            <p class="">{{ formatDate(user?.created_at) }}</p>
          </div>
          <!-- loading -->
          <div class="text-center mt-2" v-if="userStore().isLoading">
            <Icon name="eos-icons:bubble-loading" class="h-9 w-9" />
          </div>
  
          <ul class="py-4 mt-2 flex items-center justify-around">
            <li class="flex flex-col items-center justify-around">
              <svg
                class="w-4 fill-current text-blue-900"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path
                  d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"
                />
              </svg>
              <div>{{ user?.products?.length }}product/s</div>
            </li>
            <li class="flex flex-col items-center justify-between">
              <svg
                class="w-4 fill-current text-blue-900"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path
                  d="M7 8a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm0 1c2.15 0 4.2.4 6.1 1.09L12 16h-1.25L10 20H4l-.75-4H2L.9 10.09A17.93 17.93 0 0 1 7 9zm8.31.17c1.32.18 2.59.48 3.8.92L18 16h-1.25L16 20h-3.96l.37-2h1.25l1.65-8.83zM13 0a4 4 0 1 1-1.33 7.76 5.96 5.96 0 0 0 0-7.52C12.1.1 12.53 0 13 0z"
                />
              </svg>
              <div>{{ user?.orders?.length }} order/s</div>
            </li>
            <li class="flex flex-col items-center justify-around">
              <svg
                class="w-4 fill-current text-blue-900"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path
                  d="M9 12H1v6a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-6h-8v2H9v-2zm0-1H0V5c0-1.1.9-2 2-2h4V2a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v1h4a2 2 0 0 1 2 2v6h-9V9H9v2zm3-8V2H8v1h4z"
                />
              </svg>
              <div>15</div>
            </li>
          </ul>
          <div class="p-4 border-t mx-8 mt-2 flex flex-row gap-x-2">
            <button
              class="w-1/2 block mx-auto rounded-full bg-[#ff4e09] hover:shadow-lg font-semibold text-white px-6 py-2 sm:text-base md:text-base lg:text-base xl:text-base text-sm"
              @click="$router.push('/')"
            >
              Home
            </button>
            <button
              class="w-1/2 block mx-auto rounded-full bg-[#ff4e09] hover:shadow-lg font-semibold text-white px-6 py-2 sm:text-base md:text-base lg:text-base xl:text-base text-sm"
              @click="openModal"
            >
              Edit
            </button>
          </div>
        </div>
      </div>
    </div>
  
    <!-- Add User -->
  
    <!-- Add another user by productkey Umodal-->
  
    <div class="">
      <UModal v-model="addAdmin">
        <div class="flex justify-end">
          <button
            class="bg-[#ff4e09] font-medium p-2 md:p-4 text-white uppercase"
            @click="addAdmin = false"
          >
            <Icon name="ic:sharp-close" class="h-9 w-9" />
          </button>
        </div>
  
        <!-- v-if productKey copy -->
        <!-- <div class="flex justify-center items-center mx-auto" v-if="productKey">
          <h2 class="font-semibold text-xl text-center pt-3">Your product key is</h2>
          <div class="flex justify-center items-center mx-auto">
            <p class="text-2xl font-semibold text-center">{{ productKey }}</p>
  
            <button
              class="bg-[#ff4e09] font-medium p-2 md:p-4 text-white uppercase"
              @click="copyProductKey"
            >
              <Icon name="ic:sharp-content-copy" class="h-9 w-9" />
            </button>
          </div>
        </div> -->
  
        <h2 class="font-semibold text-xl text-center pt-3">Add another Admin</h2>
  
        <div class="flex py-4 px-2 sm:h-full h-screen">
          <div
            class="w-1/2 flex justify-center flex-col items-center mx-auto gap-y-3 py-2 px-1"
          >
            <label class="block text-sm font-medium text-gray-700">
              Enter the email of the admin
            </label>
            <UInput
              type="text"
              v-model="adminEmail"
              class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
              placeholder="Enter the email of the admin"
            />
  
            <!-- Submit  -->
            <div class="flex justify-center">
              <button
                class="bg-[#ff4e09] font-medium p-2 md:px-4 md:py-2 text-white uppercase text-sm"
                @click="GenerateProductKey()"
              >
                <span v-if="!gen">
                  <Icon name="ic:sharp-check" class="h-7 w-7" />
                  Generate Key
                </span>
                <span v-else>
                  <Icon name="eos-icons:loading" class="h-7 w-7" />
                  Generating
                </span>
              </button>
            </div>
          </div>
        </div>
      </UModal>
    </div>
  </template>
  
  <script setup>
  import { ref } from "vue";
  import { userStore } from "~/store/user";
  const editProfileModal = ref(false);
  const router = useRouter();
  
  import moment from "moment";
  const user = ref(null);
  const openModal = () => (editProfileModal.value = true);
  const closeModal = () => (editProfileModal.value = false);
  const addAdmin = ref(false);
  const toast = useToast();
  const adminEmail = ref("");
  const token=ref('')
  let productKey = ref("");
  let singleTransaction=ref(null)
  const gen = ref(false);
  const copyProductKey = () => {
    navigator.clipboard.writeText(productKey.value);
    toast.add({
      title: "Copied",
      description: "Product key copied to clipboard",
      status: "success",
      duration: 9000,
      isClosable: true,
    });
  };
  onBeforeMount(async () => {
  singleTransaction = null;
  token.value = localStorage.getItem("token");
  if (!token.value) {
    router.push("/Login");
  }
  await fetchUser();
});

/* if token value if no return login */
watch(token, (value) => {
  if (!value) {
    router.push("/Login");
  }
});
  const GenerateProductKey = async () => {
    gen.value = true;
    const token = localStorage.getItem("token");
    const url = "https://acewears.up.railway.app/auth/key";
    //"http://localhost:5000/auth/addAdmin"
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: adminEmail.value,
          userType: "ADMIN",
        }),
      });
      if (response.ok) {
        const data = await response.json();
        productKey.value = data.key
        console.log("data", data)
        addAdmin.value = false;
        adminEmail.value = "";
        toast.add({
          title: "Success",
          description: "product was sent to the admin's email",
          status: "success",
          timeout: 0,
          isClosable: true,
         
        });
        gen.value = false;
      } else {
        gen.value = false;
        toast.add({
          title: "Error",
          description: "Something went wrong",
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      }
    } catch (error) {
      gen.value = false;
      console.log(error);
    }
  };
  
  const goTo = (path) => {
    router.push(path);
  };
  
  const fetchUser = async () => {
    userStore().isLoading = true;
    const token = localStorage.getItem("token");
  
    const url = "https://acewears.up.railway.app/auth/me";
  
    //"http://localhost:5000/auth/me"
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      const data = await response.json();
      user.value = data;
      console.log(data);
      userStore().isLoading = false;
    } catch (error) {
      userStore().isLoading = false;
      console.log(error);
    }
  };
  
  onMounted(() => {
    fetchUser();
  });
  
  const formatDate = (date) => {
    return moment(date).format("DD/MM/YYYY");
  };
  </script>
  
  <style scoped>
  * {
    color: #ffffff;
  }
  </style>