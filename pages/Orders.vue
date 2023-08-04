<script setup>
import { userStore } from "~/store/user";
const router = useRouter();
const isProcessing = ref(false);
const store = userStore();
const transaction = ref([]);
let singleTransaction = reactive(null);
const token = ref(null);
const page = ref(1);
const q = ref("");
const pageCount = 5;
const rows = computed(() => {
  return store.orders.slice((page.value - 1) * pageCount, page.value * pageCount);
});

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
onMounted(async () => {
  /*
    let completed = data.completed;
        let order_id = data.id;
        let ordersTitle = data.orders.title;
        let amount = data.orders.price;
        let name = data.contact.contactName;
        let phone = data.contact.phone;
        let createdAt = new Date(data.createdAt).toLocaleDateString();
        let type = "mpesa";
        let wholeorders = {
          completed,
          order_id,
          ordersTitle,
          amount,
          name,
          phone,
          type,
          createdAt,
        };


  */

  setTimeout(() => (store.isLoading = false), 1000);
});

const fetchOrders = async () => {
  console.log("token", token.value);
  try {
    // const url = `http://localhost:3000/orders`;
    const url = "https://acewears.up.railway.app/orders/admin-all-orders";
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
      //   let ordersTitle = data.orders.title;
      //   let amount = data.orders.price;
      //   let name = data.contact.contactName;
      //   let phone = data.contact.phone;
      //   let createdAt = data?.createdAt;
      //   let type = "mpesa";
      //   let wholeorders = {
      //     completed,
      //     order_id,
      //     ordersTitle,
      //     amount,
      //     name,
      //     phone,
      //     type,
      //     createdAt,
      //   };
      //   console.log("wholeorders", wholeorders);
      //   transaction.value = [...transaction.value, wholeorders];
      // });
      data.forEach((data) => {
        let completed = data.completed;
        let order_id = data.id;
        // let ordersTitle = data.
        let amount = data?.total;
        let paymentMethod = data?.payment_method;
        let paymentStatus = data?.payment_status;
        let quantity = data?.quantity;
        let email = data?.user?.email;
        let ordersTitle = data?.items[0]?.product?.title;
        let price = data?.items[0]?.product?.price;
        // let name = data?.user?.name;
        let total = data?.total;
        let createdAt = data?.createdAt;
        let wholeorders = {
          completed,
          order_id,
          amount,
          email,
          total,
          ordersTitle,
          price,
          paymentMethod,
          paymentStatus,
          quantity,
          createdAt,
        };
        console.log("wholeorders", wholeorders);
        transaction.value = [...transaction.value, wholeorders];
        store.orders = transaction.value;
        console.log("transaction", transaction.value);
      });
      // transaction.value = [...transaction.value, wholeorders];

      // transaction.value = [...transaction.value, wholeorders];

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

const columns = [
  { sortable: true, key: "order_id", label: "id" },
  { sortable: true, key: "ordersTitle", label: "orders" },
  { sortable: true, key: "price", label: "price" },
  { sortable: true, key: "email", label: "email" },
  // { sortable: true, key: "phone", label: "phone" },
  { sortable: true, key: "total", label: "amount" },
  { sortable: true, key: "quantity", label: "quantity" },
  { sortable: true, key: "paymentMethod", label: "method" },
  { sortable: true, key: "paymentStatus", label: "status" },

  // { sortable: true, key: "completed", label: "iscomplete" },
  // { sortable: true, key: "type", label: "Type" },
  { sortable: true, key: "createdAt", label: "Date" },
  { key: "actions", label: "Actions" },
];
const filteredRows = computed(() => {
  store.searching = true;

  if (!q.value) {
    return store.orders;
  }

  return store.orders.filter((orders) => {
    /* return everything exclude description */
    const keys = Object.keys(orders).filter((key) => key !== "desc");
    return keys.some((key) => {
      return String(orders[key]).toLowerCase().includes(q.value.toLowerCase());
    });
  });
});
watch(q, (value) => {
  console.log("value", value);
  if (value === "") {
    store.searching = false;
  } else {
    store.searching = true;
    /* paginate to 5  */
    return store.orders.filter((orders) => {
      /* return everything exclude description */
      const keys = Object.keys(orders).filter((key) => key !== "desc");
      return keys.some((key) => {
        return String(orders[key]).toLowerCase().includes(q.value.toLowerCase());
      });
    });
  }
});
const items = (row) => [
  [
    {
      label: "view",
      icon: "i-heroicons-eye-20-solid",
      click: () => {
        isProcessing.value = true;
        store.viewOrders = true;
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
        store.deleteOrder = true;
        singleTransaction = row;
        console.log("singleTransaction", singleTransaction);
      },
    },
  ],
];

const selectedOrder = ref([]);
</script>

<template>
  <div class="py-7 px-7 overflow-x-auto dark:bg-slate-900">
    <!-- YOUR ODERS AND TRAN -->
    <h1 class="text-3xl font-semibold text-gray-800 dark:text-gray-100">Orders</h1>
    <p class="text-gray-600 dark:text-gray-400">Your orders and transactions</p>

    <h2 class="text-3xl font-semibold text-gray-800 dark:text-gray-100 text-center my-4">
      ORDERS
    </h2>

    <UTable
      v-model="selectedOrder"
      :rows="rows"
      :columns="columns"
      sort-asc-icon="i-heroicons-arrow-up-20-solid"
      sort-desc-icon="i-heroicons-arrow-down-20-solid"
      :sort-button="{
        icon: 'i-heroicons-sparkles-20-solid',
        color: 'primary',
        variant: 'outline',
        size: '2xs',
        square: false,
        ui: { rounded: 'rounded-full' },
      }"
    >
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
    <div v-if="store.searching" class="overflow-x-auto px-7">
      <div class="sm:-mx-6 lg:-mx-8">
        <div class="inline-block min-w-full sm:px-6 lg:px-8">
          <UTable
            class="mt-4"
            v-model="store.selected"
            :rows="filteredRows"
            :columns="columns"
            :sort="{ column: 'title' }"
            sort-asc-icon="i-heroicons-arrow-up-20-solid"
            sort-desc-icon="i-heroicons-arrow-down-20-solid"
            :sort-button="{
              icon: 'i-heroicons-sparkles-20-solid',
              color: 'primary',
              variant: 'outline',
              size: '2xs',
              square: false,
              ui: { rounded: 'rounded-full' },
            }"
          >
            <template #name-data="{ row }">
              <span v-if="row.amount" class="">Ksh. {{ row.amount }}</span>
            </template>

            <template #actions-data="{ row }">
              <UDropdown :items="items(row)">
                <UButton
                  variant="ghost"
                  icon="i-heroicons-ellipsis-horizontal-20-solid"
                />
              </UDropdown>
            </template>
          </UTable>
        </div>
      </div>
    </div>
    <!-- pagination -->
    <UPagination v-model="page" :page-count="pageCount" :total="store.orders.length" />
    <!-- total number of orderss with tailwindcss -->
    <div class="flex justify-end">
      <span class="text-sm text-gray-500 dark:text-gray-400">
        Showing
        <span class="font-medium">{{ (page - 1) * pageCount + 1 }}</span>
        to
        <span class="font-medium">{{ page * pageCount }}</span>
        of
        <span class="font-medium">{{ store.orders.length }}</span>
        results
      </span>
    </div>
    <!-- paypal -->
    <div v-if="store.viewOrders">
        <UModal v-model="isProcessing">
          <OrderDetails :singleTransaction="singleTransaction" />

        </UModal>
      </div>
      <div v-if="store.deleteOrder">
        <UModal v-model="isProcessing">
          <DeleteOrder :singleTransaction="singleTransaction" />
  
        </UModal>
      </div>
  </div>
</template>
