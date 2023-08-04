<template>
    <div>
      <div class="dark:bg-neutral-800 bg-white h-screen sm:min-h-screen">
        <!-- close icon -->
        <div class="flex justify-end">
          <button
            class="focus:outline-none rounded bg-[#ff4e09]"
            @click="store.viewOrders = false"
          >
            <Icon name="ic:sharp-close" class="text-white" />
          </button>
        </div>
        <div
          class="dark:bg-neutral-800 bg-white overflow-hidden flex items-center justify-center"
        >
          <div class="bg-white lg:w-6/12 md:w-7/12 w-8/12 shadow-3xl dark:bg-neutral-800">
            <!-- Total -->
  
            <main
              class="relative flex justify-center mx-auto sm:w-96 lg:w-full lg:justify-center items-center"
            >
              <!-- {{ singleTransaction }} -->
              <!-- background image mobile  -->
  
              <!-- background image desktop  -->
  
              <!-- mobile screen  -->
              <div class="grid justify-items-center px-5 relative mt-2 lg:mt-3 h-1/2">
                <div
                  class="bg-white rounded-xl overflow-hidden w-80 mx-auto dark:bg-neutral-800 dark:text-white"
                >
                  <aside class="text-center mt-5 px-5">
                    <h1 class="font-bold text-lg tracking-wide">Order Summary</h1>
                    <!-- order amount-->
                    <button
                      class="text-white mt-5 text-xs tracking-wide bg-green-500 rounded"
                    >
                      <span class="font-bold">Status:</span>
                      {{ singleTransaction?.paymentStatus }}
                    </button>
  
                    <p class="mt-5 leading-5 px-2 text-xs tracking-wide my-5">
                      <!-- mode payment -->
                      <span class="font-bold">Payment Method:</span>
                      {{ singleTransaction?.paymentMethod }}
                    </p>
                    <h2 class="sr-only">plans</h2>
                    <div class="flex justify-center items-center">
                      <Icon name="ic:sharp-check-circle" class="text-green-500" />
                      <div class="flex flex-col justify-center items-start ml-3 text-xs">
                        <h2 class="font-bold">
                          <span class="font-bold">Ksh.</span>
                          {{ singleTransaction?.amount }}
                        </h2>
                      </div>
                      <div class="flex flex-col justify-center items-start ml-3 text-xs">
                        <h2 class="font-bold">
                          <span class="font-bold">Quantity:</span>
                          {{ singleTransaction?.quantity }}
                        </h2>
                      </div>
                    </div>
                    <!-- <section
                      class="flex justify-between items-center mt-5 bg-blue-50 p-3 rounded-xl"
                    >
                   
                      <div class="flex justify-center items-center flex-col mx-auto">
                        <nuxt-img
                          v-if="singleTransaction?.order?.product?.image[0]?.url"
                          class="rounded-md md:w-[300px] w-[170px]"
                          :src="singleTransaction?.order?.product?.image[0]?.url"
                        />
                        <NuxtImg
                          v-if="!singleTransaction?.order?.product?.image[0]?.url"
                          class="rounded-md md:w-[300px] w-[170px]"
                          src="https://res.cloudinary.com/dq7l8216n/image/upload/v1628581999/placeholder-image-300x225_kjxh3r.png"
                        />
                      </div>
                    </section> -->
                    <div class="flex flex-col justify-center items-center w-full mt-5 pb-5">
                      <button
                        class="dark:text-white font-bold px-5 py-3 rounded-lg w-full shadow-2xl text-xs bg-orange-600"
                        @click="printOrder()"
                      >
                        <span class="text-white">Print</span>
                        <Icon name="ic:outline-print" class="text-white" size="20" />
                      </button>
                      <button
                        @click="store.viewOrders = false"
                        class="font-bold px-5 py-2 text-xs mt-3 dark:text-white w-full bg-red-600"
                      >
                        Close Window
                      </button>
                    </div>
                  </aside>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
  
      <!-- v-if userStore.isMpesaOrders -->
    </div>
  
    <!-- Transaction Modal -->
  </template>
  
  <script setup>
  import { ref } from "vue";
  import { userStore } from "~/store/user";
  const showOrder = ref(false);
  const total = ref(0);
  const store = userStore();
  const props = defineProps(["singleTransaction"]);
  const { singleTransaction } = toRefs(props);
  const openModal = () => {
    showOrder.value = true;
  };
  
  const printOrder = () => {
    window.print();
  };
  onMounted(() => {
 
    /* take all order ids in checkout */
  });
  </script>