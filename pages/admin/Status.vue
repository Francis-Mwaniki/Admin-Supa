<script setup>
import { useUserStore } from "~/store/user";
const router = useRouter();
const isProcessing = ref(false);
const userStore = useUserStore();
const transaction = ref([]);
let singleTransaction = reactive(null);
const token = ref(null);

onMounted(async () => {
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

  setTimeout(() => (userStore.isLoading = false), 1000);
});

const fetchOrders = async () => {
  console.log("token", token.value);
  try {
    // const url = `http://localhost:3000/orders`;
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
        let completed = data.completed;
        let order_id = data.id;
        // let productTitle = data.
        let amount = data?.total;
        let paymentMethod = data?.payment_method;
        let paymentStatus = data?.payment_status;
        let quantity = data?.quantity;
        // let name = data?.user?.name;
        // let phone = data?.user?.phone;
        let createdAt = data?.createdAt;
        let wholeProduct = {
          completed,
          order_id,
          amount,
          paymentMethod,
          paymentStatus,
          quantity,
          createdAt,
        };
        console.log("wholeProduct", wholeProduct);
        transaction.value = [...transaction.value, wholeProduct];
        console.log("transaction", transaction.value);
      });
      // transaction.value = [...transaction.value, wholeProduct];

      // transaction.value = [...transaction.value, wholeProduct];

      console.log("Success:", data);
      // transaction.value.push(data);
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
  singleTransaction = null;
  token.value = localStorage.getItem("token");
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
  { sortable: true, key: "quantity", label: "quantity" },
  { sortable: true, key: "paymentMethod", label: "method" },
  { sortable: true, key: "paymentStatus", label: "status" },
  { sortable: true, key: "completed", label: "iscomplete" },
  // { sortable: true, key: "type", label: "Type" },
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
        userStore.viewOrders = true;
        singleTransaction = row;
      },
    },
  ],

  [
    {
      label: "Delete",
      icon: "i-heroicons-trash-20-solid",
      click: () => {
        isProcessing.value = true;
        userStore.deleteOrder = true;
        singleTransaction = row;
        console.log("singleTransaction", singleTransaction);
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
      <!-- <div v-if="userStore.viewOrders">
        <UModal v-model="isProcessing">
          <OdersDetails :singleTransaction="singleTransaction" />

        </UModal>
      </div>
      <div v-if="userStore.deleteOrder">
        <UModal v-model="isProcessing">
          <DeleteOrder :singleTransaction="singleTransaction" />
  
        </UModal>
      </div> -->
    </div>
  </MainLayout>
</template>
