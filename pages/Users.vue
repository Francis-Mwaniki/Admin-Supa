<script setup>
import { userStore } from "~/store/user";
const router = useRouter();
const isProcessing = ref(false);
const store = userStore();
const allUsers = ref([]);
let singleUser = reactive(null);
const token = ref(null);
const page = ref(1);
const q = ref("");
const pageCount = 5;
const rows = computed(() => {
  return store.users.slice((page.value - 1) * pageCount, page.value * pageCount);
});

onBeforeMount(async () => {
  singleUser = null;
  token.value = localStorage.getItem("token");
  if (!token.value) {
    router.push("/");
  }
  await fetchUser();
});

/* if token value if no return login */
watch(token, (value) => {
  if (!value) {
    router.push("/");
  }
});
onMounted(async () => {
  /*
    let completed = data.completed;
        let order_id = data.id;
        let userTitle = data.user.title;
        let amount = data.user.price;
        let name = data.contact.contactName;
        let phone = data.contact.phone;
        let createdAt = new Date(data.createdAt).toLocaleDateString();
        let type = "mpesa";
        let wholeuser = {
          completed,
          order_id,
          userTitle,
          amount,
          name,
          phone,
          type,
          createdAt,
        };


  */

  setTimeout(() => (store.isLoading = false), 1000);
});

const fetchUser = async () => {
  console.log("token", token.value);
  try {
    // const url = `http://localhost:3000/user`;
    const url = "https://acewears.up.railway.app/orders/admin-all-users";
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
      //   let userTitle = data.user.title;
      //   let amount = data.user.price;
      //   let name = data.contact.contactName;
      //   let phone = data.contact.phone;
      //   let createdAt = data?.createdAt;
      //   let type = "mpesa";
      //   let wholeuser = {
      //     completed,
      //     order_id,
      //     userTitle,
      //     amount,
      //     name,
      //     phone,
      //     type,
      //     createdAt,
      //   };
      //   console.log("wholeuser", wholeuser);
      //   allUsers.value = [...allUsers.value, wholeuser];
      // });
      data.forEach((data) => {
        let user = data.id;
        let email = data?.email;
        let orders = data?.orders?.length > 0 ? data?.orders?.length : 0;
        let name = data?.name;
        let phone = data?.phone;
        let createdAt = data?.created_at;
        let user_type = data?.user_type;

        let wholeuser = {
          user,
          createdAt,
          user_type,
          email,
          orders,
          name,
          phone,
        };
        console.log("wholeuser", wholeuser);
        allUsers.value = [...allUsers.value, wholeuser];
        store.users = allUsers.value;
        console.log("allUsers", allUsers.value);
      });
      // allUsers.value = [...allUsers.value, wholeuser];

      // allUsers.value = [...allUsers.value, wholeuser];

      console.log("Success:", data);
      // allUsers.value.push(data);
    } else {
      useToast().add({
        title: "Error",
        description: "Error fetching user",
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

/*  user,
          email,
          orders,
          name,
          phone, */
const columns = [
  { sortable: true, key: "user", label: "id" },
  { sortable: true, key: "email", label: "email" },
  { sortable: true, key: "name", label: "name" },
  { sortable: true, key: "email", label: "email" },
  { sortable: true, key: "phone", label: "phone" },
  // { sortable: true, key: "amount", label: "amount" },
  // { sortable: true, key: "quantity", label: "quantity" },
  // { sortable: true, key: "paymentMethod", label: "method" },
  // { sortable: true, key: "paymentStatus", label: "status" },

  // { sortable: true, key: "completed", label: "iscomplete" },
  { sortable: true, key: "user_type", label: "User_Type" },
  { sortable: true, key: "createdAt", label: "Date" },
  { key: "actions", label: "Actions" },
];
const filteredRows = computed(() => {
  store.searching = true;

  if (!q.value) {
    return store.users;
  }

  return store.users.filter((user) => {
    /* return everything exclude description */
    const keys = Object.keys(user).filter((key) => key !== "desc");
    return keys.some((key) => {
      return String(user[key]).toLowerCase().includes(q.value.toLowerCase());
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
    return store.users.filter((user) => {
      /* return everything exclude description */
      const keys = Object.keys(user).filter((key) => key !== "desc");
      return keys.some((key) => {
        return String(user[key]).toLowerCase().includes(q.value.toLowerCase());
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
        store.viewuser = true;
        singleUser = row;
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
        singleUser = row;
        console.log("singleUser", singleUser);
      },
    },
  ],
];

const selectedUser = ref([]);
</script>

<template>
  <div class="py-7 px-7 overflow-x-auto dark:bg-slate-900">
    <!-- YOUR ODERS AND TRAN -->
    <h1 class="text-3xl font-semibold text-gray-800 dark:text-gray-100">USERS</h1>
    <p class="text-gray-600 dark:text-gray-400">Your Customers</p>

    <h2 class="text-3xl font-semibold text-gray-800 dark:text-gray-100 text-center my-4">
      Customers
    </h2>

    <UTable
      v-model="selectedUser"
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
            <template #name-data="{ row }"> </template>

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
    <UPagination v-model="page" :page-count="pageCount" :total="store.users.length" />
    <!-- total number of users with tailwindcss -->
    <div class="flex justify-end">
      <span class="text-sm text-gray-500 dark:text-gray-400">
        Showing
        <span class="font-medium">{{ (page - 1) * pageCount + 1 }}</span>
        to
        <span class="font-medium">{{ page * pageCount }}</span>
        of
        <span class="font-medium">{{ store.users.length }}</span>
        results
      </span>
    </div>
    <!-- paypal -->
    <!-- <div v-if="store.viewuser">
        <UModal v-model="isProcessing">
          <OdersDetails :singleUser="singleUser" />

        </UModal>
      </div>
      <div v-if="store.deleteOrder">
        <UModal v-model="isProcessing">
          <DeleteOrder :singleUser="singleUser" />
  
        </UModal>
      </div> -->
  </div>
</template>
