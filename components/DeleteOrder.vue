<template>
    <div>
      <div class="dark:bg-neutral-900 bg-white h-screen sm:min-h-screen">
        <!-- close icon -->
        <div class="flex justify-end">
          <button
            class="focus:outline-none rounded bg-[#ff4e09]"
            @click="store.deleteOrder = false"
          >
            <Icon name="ic:sharp-close" class="text-white" />
          </button>
        </div>
        <div
          class="dark:bg-neutral-900 bg-white overflow-hidden flex items-center justify-center flex-col"
        >
          <div class="flex justify-center items-center mx-auto" v-if="processing">
            <span>Deleting..</span> <Icon class="w-10 h-10" name="line-md:loading-loop" />
          </div>
  
          <div
            class="bg-white lg:w-6/12 md:w-7/12 w-8/12 shadow-3xl dark:bg-neutral-900 pt-10"
          >
            <!-- are you sure you want to delete -->
            <div class="flex justify-center items-center flex-col">
              <h2 class="font-bold sm:text-lg text-sm tracking-wide">
                Are you sure you want to delete this order?
              </h2>
              <div
                class="flex justify-center items-center my-3 flex-row gap-x-3"
                @click="deleteOrder"
              >
                <button class="text-white mt-5 text-xs tracking-wide bg-green-500 rounded">
                  Yes
                </button>
                <button
                  class="text-white mt-5 text-xs tracking-wide bg-red-500 rounded"
                  @click="store.deleteOrder = false"
                >
                  No
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  
    <!-- Transaction Modal -->
  </template>
  
  <script setup>
  import { ref } from "vue";
  import { userStore } from "~/store/user.js";
  const showOrder = ref(false);
  const showTransactionModal = ref(false);
  const mpesaNumber = ref("");
  const toast = useToast();
  const total = ref(0);
  const token = ref("");
  const store = userStore();
  const processing = ref(false);
  const props = defineProps(["singleTransaction"]);
  const openModal = () => {
    showOrder.value = true;
  };
  
  const deleteOrder = async () => {
    processing.value = true;
    console.log("singleTransaction", props.singleTransaction);
  
    try {
      /* delete order from db */
      // const url = ` http://localhost:5000/transaction/paypal/${singleTransaction?.value.id}`;
      const url = `https://acewears.up.railway.app/orders/${props.singleTransaction?.order_id}/admin`;
      // const url = `https://acewears.up.railway.app/transaction/paypal/${singleTransaction?.value.id}`;
      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token.value,
        },
      });
      if (response.ok) {
        setTimeout(() => {
          processing.value = false;
          store.deleteOrder = false;
        }, 4000);
        const data = await response.json();
        console.log("data", data);
        toast.add({
          title: "Success",
          description: "Order deleted successfully",
          type: "success",
        });
        setTimeout(() => {
          window.location.reload();
        }, 10);
      }
    } catch (error) {
      setTimeout(() => {
        processing.value = false;
        store.deleteOrder = false;
      }, 4000);
      toast.add({
        title: "Error",
        description: "Something went wrong",
        type: "error",
      });
  
      console.log("error", error);
    }
  };
  onMounted(() => {
    token.value = localStorage.getItem("token");
    if (!token.value) {
      router.push("/Login");
    }
  
  
    /* take all order ids in checkout */
  });
  </script>