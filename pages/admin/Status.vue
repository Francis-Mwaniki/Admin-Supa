<script setup>
import { userStore } from "~/store/user";
import { io } from "socket.io-client";
const router = useRouter();
const isProcessing = ref(false);
const resultDesc = ref(null);
const store = userStore();
const transaction = ref([]);
const singleTransaction = ref([]);
const token = ref(null);
const toast = useToast();
const user = ref(null);
const socket = io("https://acewears.up.railway.app/", {
  transports: ["websocket", "polling", "flashsocket"],
});
onMounted(async () => {
  socket.on("connect", () => {
    console.log("connected");
  });

  socket.on("disconnect", () => {
    console.log("disconnected");
  });
  /*
    let completed = data.completed;
        let order_id = data.id;
        let productTitle = data.product.title;
        let amount = data.product.price;
        let name = data.contact.contactName;
        let phone = data.contact.phone;
        let createdAt = new Date(data.createdAt).toLocaleDateString();
        let type = "mpesa";
        let wholeProduct = {
          completed,
          order_id,
          productTitle,
          amount,
          name,
          phone,
          type,
          createdAt,
        };


  */
  token.value = localStorage.getItem("token");
  user.value = localStorage.getItem("user");
  JSON.parse(user.value);
});

const fetchOrders = async () => {
  console.log("token", token.value);

  try {
    // const url = `http://localhost:3000/orders/admin-all-orders`;
    const url = "https://acewears.up.railway.app/orders";
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + token.value,
      },
    });

    const data = await response.json();

    if (!data.error) {
      console.log("Success:", data);
      // data.map((data) => {
      //   let completed = data.completed;
      //   let order_id = data.id;
      //   let productTitle = data.product.title;
      //   let amount = data.product.price;
      //   let name = data.contact.contactName;
      //   let phone = data.contact.phone;
      //   let createdAt = data?.createdAt;
      //   let type = "mpesa";
      //   let wholeProduct = {
      //     completed,
      //     order_id,
      //     productTitle,
      //     amount,
      //     name,
      //     phone,
      //     type,
      //     createdAt,
      //   };
      //   console.log("wholeProduct", wholeProduct);
      //   transaction.value = [...transaction.value, wholeProduct];
      // });
      data.forEach((data) => {
        let status = resultDesc.value ? resultDesc.value : "pending";
        let order_id = data.id;
        let productTitle = data?.product?.title;
        let amount = data?.product?.price;
        let user_id = data?.user?.id;
        let name = data?.user?.name;
        let phone = data?.user?.phone;
        let createdAt = data?.createdAt;
        let type = "mpesa";
        let wholeProduct = {
          status,
          order_id,
          productTitle,
          amount,
          name,
          user_id,
          phone,
          type,
          createdAt,
        };

        transaction.value.push(wholeProduct);
      });
      // transaction.value = [...transaction.value, wholeProduct];

      // transaction.value = [...transaction.value, wholeProduct];

      console.log("Success:", data);
      console.log("transaction", transaction.value);
    } else {
      useToast().add({
        title: "Error",
        description: "Error fetching orders",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      console.log("Error:", data);
    }
  } catch (error) {
    console.error("Error:", error);
    useToast().add({
      title: "Error",
      description: error.message,
      status: "error",
      duration: 5000,
      isClosable: true,
    });
  }
};
onBeforeMount(async () => {
  singleTransaction.value = null;
  token.value = localStorage.getItem("token");
  user.value = localStorage.getItem("user");
  if (!token.value) {
    router.push("/Login");
  }
  await fetchOrders();
});

/* if token value if no return login */
watch(token, (value) => {
  if (!value) {
    router.push("/Login");
  }
});

const columns = [
  // {  sortable: true, key: "image", label: "Image" },
  { sortable: true, key: "order_id", label: "id" },
  { sortable: true, key: "amount", label: "amount" },
  { sortable: true, key: "phone", label: "phone" },
  { sortable: true, key: "name", label: "name" },
  // { sortable: true, key: "status", label: "status" },
  { sortable: true, key: "status", label: "status" },
  { sortable: true, key: "type", label: "Type" },
  { sortable: true, key: "createdAt", label: "Date" },
  { key: "actions", label: "Actions" },
];

const items = (row) => [
  [
    {
      label: "view",
      icon: "i-heroicons-eye-20-solid",
      click: () => {
        isProcessing.value = true;
        store.viewOrders = true;
        singleTransaction.value = row;
      },
    },
  ],

  [
    {
      label: "Delete",
      icon: "i-heroicons-trash-20-solid",
      click: () => {
        isProcessing.value = true;
        store.deleteOrder = true;
        singleTransaction.value = row;
      },
    },
  ],
];

const selected = ref([]);
</script>

<template>
  <MainLayout>
    <div class="py-7 px-7 overflow-x-auto dark:bg-slate-900">
      <!-- YOUR ODERS AND TRAN -->
      <h1 class="text-3xl font-semibold text-gray-800 dark:text-gray-100">Orders</h1>
      <p class="text-gray-600 dark:text-gray-400">Your orders and transactions</p>
      <!-- want see all your transactions here -->

      <h2
        class="text-3xl font-semibold text-gray-800 dark:text-gray-100 text-center my-4"
      >
        ORDERS
      </h2>

      <UTable v-model="selected" :rows="transaction" :columns="columns">
        <template #amount-data="{ row }" class="text-white">
          <span v-if="row.amount" class="">Ksh. {{ row.amount }}</span>
        </template>

        <template #actions-data="{ row }">
          <UDropdown :items="items(row)">
            <UButton
              color="gray"
              variant="ghost"
              icon="i-heroicons-ellipsis-horizontal-20-solid"
            />
          </UDropdown>
        </template>
      </UTable>

      <!-- paypal -->
      <!-- <div v-if="store.viewOrders">
        <UModal v-model="isProcessing">
          <OdersDetails :singleTransaction="singleTransaction" />
    
        </UModal>
      </div>
      <div v-if="store.deleteOrder">
        <UModal v-model="isProcessing">
          <DeleteOrder :singleTransaction="singleTransaction" />
  
        </UModal>
      </div> -->
    </div>
  </MainLayout>
</template>
