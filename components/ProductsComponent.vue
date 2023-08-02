<script setup>
import Admin from "@/components/Admin.vue";
import reset_Password from "~/components/reset_Password.vue";
import { io } from "socket.io-client";
import chart from "@/components/chart.vue";

import { useFetch } from "nuxt/app";
import { ref, computed, onMounted } from "vue";
const client = useSupabaseClient();
const user = useSupabaseUser();
const auth = useSupabaseAuthClient();
const { account } = useAppwrite();
import { userStore } from "~/store/user.js";
import DarkChart from "~/components/DarkChart.vue";
import moment from "moment";
const q = ref("");
const AppwriteUser = ref({});
// AppwriteUser.value = await account.get();
const store = userStore();
const manageProducts = ref(true);
const isOpen = ref(false);
const analytics = ref(false);
const err = ref("");
const toast = useToast();
const token = ref("");
const socket = io("https://acewears.up.railway.app/", {
  transports: ["websocket", "polling", "flashsocket"],
});
const categories = [
  {
    name: "shoes",
    value: "SHOES",
  },
  {
    name: "watches",
    value: "WATCHES",
  },
  {
    name: "perfumes",
    value: "PERFUMES",
  },
];
function formatDate(date) {
  return date ? moment(date).format("MMMM Do YYYY, h:mm:ss a") : "Never";
}
function formatCurrency(amount) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "KES",
  }).format(amount);
}
// const fetchAccount = async () => {
//   store.isAppwriteUser = true;
//   try {
//     AppwriteUser.value = await account.get();
//     // console.log(AppwriteUser.value);
//   } catch (e) {
//     console.log(e);
//     // store.isAppwriteUser = false;
//     // toast.add({
//     //   title: "Note",
//     //   description: e.message ? e.message : e,
//     // });
//   }
// };

onBeforeMount(() => {
  // fetchAccount();
});

onMounted(async () => {
  token.value = localStorage.getItem("token");
  if (!token.value) {
    err.value = "Please login to continue";
  }
  socket.on("connect", () => {
    console.log("connected");
  });

  socket.on("new-product", (data) => {
    store.notification.push(data);
  });
  socket.on("product-update", (data) => {
    store.notification.push(data);
  });

  socket.on("disconnect", () => {
    console.log("disconnected");
  });
});

const handleUrl = (url) => {
  store.productData.url = url;
  console.log("url", url);
};
const addProductToSupaBase = async () => {
  if (store.productData.url === "") {
    toast.add({
      title: "Error",
      description: "Please upload an image",
      status: "error",
      duration: 5000,
      isClosable: true,
    });
    return;
  }
  if (store.productData.name === "") {
    toast.add({
      title: "Error",
      description: "Please enter a name",
      status: "error",
      duration: 5000,
      isClosable: true,
    });
    return;
  }
  if (store.productData.size === "") {
    toast.add({
      title: "Error",
      description: "Please enter a size",
      status: "error",
      duration: 5000,
      isClosable: true,
    });
    return;
  }
  if (store.productData.desc === "") {
    toast.add({
      title: "Error",
      description: "Please enter a description",
      status: "error",
      duration: 5000,
      isClosable: true,
    });
    return;
  }
  store.isSaving = true;
  console.log("store.productData", store.productData);
  const url = `https://acewears.up.railway.app/product`;
  const token = localStorage.getItem("token");
  let newData = {
    title: store.productData.name,
    description: store.productData.desc,
    price: parseInt(store.productData.size),
    categoryType: store.productData.category,
    category: "WATCHES",
    image: [{ url: store.productData.url }],
  };
  let resp = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "content-type": "application/json",
    },
    body: JSON.stringify(newData),
    /* {
      title: store.productData.name,
      description: store.productData.desc,
      price: 1,
      categoryType: "SHOES",
      image: [{ url: store.productData.url }],
    }*/
  });
  console.log("resp", resp);

  if (!resp) {
    store.isSaving = false;
    toast.add({
      title: "Error",
      description: "Error adding product",
      status: "error",
      duration: 5000,
      isClosable: true,
    });
    console.log(error);
  } else {
    const data = await resp.json();
    console.log("data", data);
    store.isSaving = false;
    toast.add({
      title: "Product Added",
      description: "Product Added Successfully",
      status: "success",
      duration: 5000,
      isClosable: true,
    });
    setTimeout(() => {
      store.productData = { id: null, url: "", name: "", size: "", desc: "" };
    }, 2000);

    await fetchProducts();
    store.isSaving = false;
    store.showAddModal = false;
  }
};
/*    deleteSelectedProducts in supabase
const { data, error } = await supabase
  .from('Products')
  .delete()
  .eq('some_column', 'someValue')


*/
const deleteSelectedProducts = async () => {
  store.isDeleting = true;
  /* user must select only one at a time */
  if (store.selected.length > 1) {
    store.isDeleting = false;
    toast.add({
      title: "Error",
      description: "Please select only one product at a time",
      status: "error",
      duration: 5000,
      isClosable: true,
    });
    return;
  }
  if (store.selected.length === 0) {
    store.isDeleting = false;
    toast.add({
      title: "Error",
      description: "Please select a product",
      status: "error",
      duration: 5000,
      isClosable: true,
    });
    return;
  }

  store.isLoading = true;
  console.log("selected", store.selected[0].id);
  try {
    const { data, error } = await client
      .from("Products")
      .delete()
      .eq("id", store.selected[0].id);
    if (error) {
      store.isDeleting = false;
      console.log(error);
    } else {
      store.isDeleting = false;
      toast.add({
        title: "Products Deleted",
        description: "Products Deleted Successfully",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      await fetchProducts();
    }
  } catch (error) {
    store.isDeleting = false;
    toast.add({
      title: "Error",
      description: "Error Deleting Product",
      status: "error",
      duration: 5000,
      isClosable: true,
    });
  }
};
const filteredRows = computed(() => {
  store.searching = true;

  if (!q.value) {
    return store.product;
  }

  return store.product.filter((product) => {
    /* return everything exclude description */
    const keys = Object.keys(product).filter((key) => key !== "desc");
    return keys.some((key) => {
      return String(product[key]).toLowerCase().includes(q.value.toLowerCase());
    });
  });
});
const addProduct = () => {
  store.productData = { id: null, url: "", name: "", size: "", desc: "" };
  store.showAddModal = true;
};
watch(q, (value) => {
  console.log("value", value);
  if (value === "") {
    store.searching = false;
  } else {
    store.searching = true;
    /* paginate to 5  */
    return store.product.filter((product) => {
      /* return everything exclude description */
      const keys = Object.keys(product).filter((key) => key !== "desc");
      return keys.some((key) => {
        return String(product[key]).toLowerCase().includes(q.value.toLowerCase());
      });
    });
  }
});

const columns = [
  // {  sortable: true, key: "image", label: "Image" },
  { sortable: true, key: "id", label: "id" },
  { sortable: true, key: "name", label: "Name" },
  { sortable: true, key: "price", label: "Price" },
  { sortable: true, key: "categoryType", label: "category" },
  { key: "actions", label: "Actions" },
];
const page = ref(1);
const pageCount = 5;
const fetchProducts = async () => {
  const url = "https://acewears.up.railway.app/product/";
  //.range(page, pageCount);
  try {
    let resp = await fetch(url, {
      method: "GET",
      headers: {
        "content-type": "application/json",
      },
    });
    if (!resp) {
      console.log("err from fetching", data);
      toast.add({
        title: "Huh!",
        description: "Check your Internet!",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } else {
      const data = await resp.json();
      /* format date before */
      // data.map((product) => {
      //   product.created_at = formatDate(product.created_at);
      //   product.size = formatCurrency(product.price);
      // });
      console.log("data", data);
      store.product = data;
      console.log("data", data);
    }
  } catch (error) {
    // toast.add({
    //   title: "Huh!",
    //   description: "Check you internet please!",
    //   status: "error",
    //   duration: 5000,
    //   isClosable: true,
    // });
    console.log(error);
  }
};

const rows = computed(() => {
  return store.product.slice((page.value - 1) * pageCount, page.value * pageCount);
});
const handleEdit = (row) => {
  let product = {
    id: row.id,
    title: row.title,
    price: row.price,
    url: row.url,
    desc: row.description,
  };
  store.productData.id = product.id;
  store.productData.name = product.title;
  store.productData.size = product.price;
  store.productData.url = product.url;
  store.productData.desc = product.desc;
  if (store.productData !== null) {
    store.isEditing = true;
    store.showModal = true;
  }
};
const editProductToSupaBase = async () => {
  store.isEditing = true;
  store.isLoading = true;
  if (store.productData.id === null) {
    toast.add({
      title: "Error",
      description: "Please select a product",
      status: "error",
      duration: 5000,
      isClosable: true,
    });
    return;
  }
  const url = `https://acewears.up.railway.app/product/${store.productData.id}/`;
  const token = localStorage.getItem("token");
  let newData = {
    title: store.productData.name,
    description: store.productData.desc,
    price: parseInt(store.productData.size),
    categoryType: store.productData.category,
    category: "WATCHES",
    image: [{ url: store.productData.url }],
  };
  let resp = await fetch(url, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "content-type": "application/json",
    },
    body: JSON.stringify(newData),
    /* {
      title: store.productData.name,
      description: store.productData.desc,
      price: 1,
      categoryType: "SHOES",
      image: [{ url: store.productData.url }],
    }*/
  });
  console.log("resp", resp);
  if (!resp) {
    const data = await resp.json();
    store.isLoading = false;
    store.isEditing = false;
    store.showModal = false;
    console.log("data", data);
  } else {
    const data = await resp.json();
    console.log("data", data);
    store.isLoading = false;
    store.showModal = false;
    toast.add({
      title: "Product Updated",
      description: "Product Updated Successfully",
      status: "success",
      duration: 5000,
      isClosable: true,
    });
    store.productData.name = "";
    store.productData.size = "";
    store.productData.url = "";
    store.productData.desc = "";
    store.isEditing = false;
    await fetchProducts();
  }
};
const handleDelete = (row) => {
  store.selected = [row];
  store.isDeleting = true;
  deleteProductFromSupaBase(row);
};
const handleView = (row) => {
  store.selected = [row];
  store.isViewProduct = true;
  console.log("selected", store.selected);
};
const deleteProductFromSupaBase = async (row) => {
  try {
    const url = `https://acewears.up.railway.app/product/${row.id}/`;
    // const url = `http://localhost:3000/product/${row.id}/`;
    const token = localStorage.getItem("token");

    let resp = await fetch(url, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "content-type": "application/json",
      },
    });
    if (!resp) {
      console.log("err from fetching", data);
      store.isDeleting = false;
      console.log(error);
    } else {
      const data = await resp.json();
      console.log("data", data);
      store.isDeleting = false;
      toast.add({
        title: "Products Deleted",
        description: "Products Deleted Successfully",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      await fetchProducts();
    }
  } catch (error) {
    store.isDeleting = false;

    toast.add({
      title: "Error",
      description: "Error Deleting Product",
      status: "error",
      duration: 5000,
      isClosable: true,
    });
  }
};

const items = (row) => [
  [
    {
      label: "Edit",
      icon: "i-heroicons-pencil-square-20-solid",
      click: () => handleEdit(row),
    },
  ],

  [
    {
      label: "Delete",
      icon: "i-heroicons-trash-20-solid",
      click: () => handleDelete(row),
    },
  ],
  [
    {
      label: "View",
      icon: "i-heroicons-eye-20-solid",
      click: () => handleView(row),
    },
  ],
];

const openModal = () => {
  store.showModal = true;
};
const openAddModal = () => {
  store.showAddModal = true;
};
fetchProducts();
</script>

<template>
  <main>
    <div>
      <!-- <UButton label="Open" class="my-4" @click="isOpen = true">
       
        <Icon
          name="material-symbols:menu-rounded"
          class="h-6 w-6 text-white"
          v-if="!isOpen"
        />
        <Icon name="ic:round-close" class="h-6 w-6 text-white" v-if="isOpen" />
      </UButton> -->

      <USlideover v-model="isOpen">
        <!-- switch between Analytics and Admin menu-->
        <div class="py-4 flex gap-y-9 flex-col">
          <div class="flex justify-center space-x-4 items-center mx-auto">
            <Icon name="logos:google-tag-manager" class="h-40 w-40 text-white" />
          </div>
          <div class="flex justify-center space-x-4 items-center my-auto">
            <button
              class="inline-flex items-center focus:outline-none mr-4 bg-[#ff4e09] text-white py-2 px-4 rounded"
              @click="
                analytics = true;
                manageProducts = false;
                isOpen = false;
              "
            >
              Analytics
            </button>
            <button
              class="inline-flex items-center focus:outline-none mr-4 bg-[#ff4e09] text-white py-2 px-4 rounded"
              @click="
                manageProducts = true;
                analytics = false;
                isOpen = false;
              "
            >
              Manage Products
            </button>
          </div>
        </div>
        <!-- copyrights -->
        <div class="flex justify-center items-center">
          <p class="text-gray-400 text-sm">
            &copy; 2023 <span class="text-blue-500">AceShoes</span
            ><span class="text-orange-500">Technologies</span>
          </p>
        </div>
      </USlideover>
    </div>

    <main>
      <div class="" v-show="manageProducts">
        <ProductSlider
          :isViewProduct="store.isViewProduct"
          :selected-product="store.selected[0]"
        />
        <div>
          <div class="" v-show="store.showResetModal">
            <reset_Password />
          </div>
          <div class="" v-if="!store.showResetModal">
            <div class="flex justify-end items-end py-2"><Admin /></div>
            <!-- <div
              v-if="store.showModal"
              class="fixed inset-0 flex items-center justify-center bg-opacity-50 z-40"
            > -->
            <UModal v-model="store.showAddModal" v-if="store.showAddModal">
              <div class="flex justify-end bg-gray-950">
                <button
                  class="bg-[#ff4e09] font-medium p-2 md:p-4 text-white uppercase"
                  @click="store.showAddModal = false"
                >
                  <Icon name="ic:sharp-close" class="h-9 w-9" />
                </button>
              </div>
              <div
                class="z-20 rounded-lg p-8 max-w-2xl w-full overflow-y-auto bg-gray-950"
              >
                <h2 class="text-2xl font-bold mb-4">Add Product</h2>
                <form>
                  <div class="mb-4 overflow-y-auto">
                    <label for="name" class="block text-white">Name:</label>
                    <UInput
                      v-model="store.productData.name"
                      type="text"
                      id="name"
                      class="rounded px-3 py-2 w-full"
                      required
                    />
                  </div>
                  <!-- select categoryType  div-->
                  <div class="mb-4 overflow-y-auto">
                    <USelect
                      v-model="store.productData.category"
                      :options="categories"
                      class="rounded px-3 py-2 w-full"
                      option-attribute="name"
                      placeholder="Select Category"
                    />
                  </div>
                  <div class="mb-4">
                    <label for="size" class="block text-white">Price:</label>
                    <UInput
                      v-model="store.productData.size"
                      type="number"
                      id="size"
                      class="rounded px-3 py-2 w-full"
                      required
                    />
                  </div>
                  <div class="mb-4 mt-2">
                    <label for="File" class="block text-white">Select File:</label>
                    <!-- if not during edit please add another -->

                    <CloudUpload @uploaded="handleUrl" />
                  </div>

                  <div class="mb-4 mt-2">
                    <label for="desc" class="block text-white">Description:</label>
                    <UTextarea
                      v-model="store.productData.desc"
                      type="desc"
                      id="desc"
                      rows="3"
                      class="rounded px-3 py-2 w-full"
                      required
                    />
                  </div>

                  <div
                    class="flex md:flex-row flex-col mx-auto justify-center gap-y-2 items-center md:justify-start w-full flex-1 max-w-xl gap-x-2"
                  >
                    <button
                      v-if="!store.isEditing"
                      @click.prevent="addProductToSupaBase"
                      type="submit"
                      class="inline-flex items-center focus:outline-none mr-4 bg-[#ff4e09] text-white py-2 px-4 rounded"
                      :disabled="store.isSaving"
                      :loading="store.isSaving"
                    >
                      <p class="text-center">
                        <Icon
                          name="eos-icons:bubble-loading"
                          class="h-6 w-6"
                          v-if="store.isSaving"
                        />
                        {{ store.isSaving ? "Saving." : "Add Product" }}
                      </p>
                    </button>
                  </div>
                </form>
              </div>
            </UModal>

            <!-- editting -->

            <UModal v-model="store.showModal" v-if="store.showModal">
              <div class="flex justify-end bg-gray-950">
                <button
                  class="bg-[#ff4e09] font-medium p-2 md:p-4 text-white uppercase"
                  @click="store.showModal = false"
                >
                  <Icon name="ic:sharp-close" class="h-9 w-9" />
                </button>
              </div>
              <div
                class="z-20 rounded-lg p-8 max-w-2xl w-full overflow-y-auto bg-gray-950"
              >
                <h2 class="text-2xl font-bold mb-4">Edit product</h2>
                <form>
                  <div class="mb-4 overflow-y-auto">
                    <label for="name" class="block text-white">Name:</label>
                    <UInput
                      v-model="store.productData.name"
                      type="text"
                      id="name"
                      class="rounded px-3 py-2 w-full"
                      required
                    />
                  </div>
                  <!-- select categoryType  div-->
                  <div class="mb-4 overflow-y-auto">
                    <USelect
                      v-model="store.productData.category"
                      :options="categories"
                      class="rounded px-3 py-2 w-full"
                      option-attribute="name"
                      placeholder="Select Category"
                    />
                  </div>
                  <div class="mb-4">
                    <label for="size" class="block text-white">Price:</label>
                    <UInput
                      v-model="store.productData.size"
                      type="number"
                      id="size"
                      class="rounded px-3 py-2 w-full"
                      required
                    />
                  </div>
                  <div class="mb-4 mt-2">
                    <div
                      class="text-white"
                      v-if="store.productData.url && store.isEditing"
                    >
                      <h3>Current image</h3>
                      <NuxtImg
                        v-if="store.productData.url && store.isEditing"
                        :src="store.productData.url"
                        class="w-20 h-20 rounded-full mx-auto"
                      />
                    </div>
                    <label for="File" class="block text-white">Select File:</label>
                    <!-- if not during edit please add another -->

                    <CloudUpload @uploaded="handleUrl" />
                  </div>

                  <div class="mb-4 mt-2">
                    <label for="desc" class="block text-white">Description:</label>
                    <UTextarea
                      v-model="store.productData.desc"
                      type="desc"
                      id="desc"
                      rows="3"
                      class="rounded px-3 py-2 w-full"
                      required
                    />
                  </div>

                  <div
                    class="flex md:flex-row flex-col mx-auto justify-center gap-y-2 items-center md:justify-start w-full flex-1 max-w-xl gap-x-2"
                  >
                    <button
                      v-if="store.isEditing"
                      @click.prevent="editProductToSupaBase"
                      type="submit"
                      class="inline-flex items-center focus:outline-none mr-4 bg-[#ff4e09] text-white py-2 px-4 rounded"
                      :disabled="store.isLoading"
                      :loading="store.isLoading"
                    >
                      <p class="text-center">
                        <Icon
                          name="eos-icons:bubble-loading"
                          class="h-6 w-6"
                          v-if="store.isLoading"
                        />
                        {{ store.isLoading ? "Editing" : "Edit product" }}
                      </p>
                    </button>
                  </div>
                </form>
              </div>
            </UModal>

            <div class="max-w-6xl mx-auto py-4">
              <div
                class="mx-auto flex flex-row gap-x-4 md:gap-y-1 gap-y-3 space-x-2 flex-grow flex-wrap mb-2"
              >
                <UInput v-model="q" placeholder="Filter products..." />
                <button
                  @click="addProduct()"
                  class="inline-flex items-center focus:outline-none mr-4 bg-[#ff4e09] text-white py-2 px-4 rounded"
                  color="orange"
                >
                  <span>Add Product</span>
                  <ClientOnly><Icon name="ic:round-plus" class="h-6 w-6" /></ClientOnly>
                </button>
                <button
                  @click="deleteSelectedProducts"
                  :disabled="store.isDeleting"
                  class="inline-flex items-center focus:outline-none mr-4 bg-[#ff0d09] text-white py-2 px-4 rounded"
                  :loading="store.isDeleting"
                >
                  <span class="">{{
                    store.isDeleting ? "Deleting" : "Delete Product"
                  }}</span>
                  <ClientOnly>
                    <Icon
                      v-if="!store.isDeleting"
                      name="ic:round-delete-forever"
                      class="w-6 h-6"
                  /></ClientOnly>
                </button>
              </div>
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
                        <NuxtImg
                          :src="row.image?.url"
                          class="h-14 w-14 rounded-full"
                          alt=""
                        />
                        <span
                          :class="[
                            store.selected.find((product) => product.id === row.id) &&
                              'text-primary-500 dark:text-primary-400',
                          ]"
                          >{{ row.title }}</span
                        >

                        <span
                          :class="[
                            store.selected.find((product) => product.id === row.id) &&
                              'text-primary-500 dark:text-primary-400',
                          ]"
                          >{{ row.price }}</span
                        >

                        <span
                          :class="[
                            store.selected.find((product) => product.id === row.id) &&
                              'text-primary-500 dark:text-primary-400',
                          ]"
                          >{{ 23 + 3 }}</span
                        >

                        <span
                          :class="[
                            store.selected.find((product) => product.id === row.id) &&
                              'text-primary-500 dark:text-primary-400',
                          ]"
                          >{{ row.id }}</span
                        >
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

              <div class="overflow-x-auto px-7" v-if="!store.searching">
                <div class="mt-4 sm:-mx-6 lg:-mx-8">
                  <UTable
                    v-model="store.selected"
                    :rows="rows"
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
                    {{ store.selected }}
                    <template #name-data="{ row }">
                      <NuxtImg
                        :src="row.image?.url"
                        class="h-14 w-14 rounded-full"
                        alt=""
                      />
                      <span
                        :class="[
                          store.selected.find((product) => product.id === row.id) &&
                            'text-primary-500 dark:text-primary-400',
                        ]"
                        >{{ row.title }}</span
                      >
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
                <UPagination
                  v-model="page"
                  :page-count="pageCount"
                  :total="store.product.length"
                />
                <!-- total number of products with tailwindcss -->
                <div class="flex justify-end">
                  <span class="text-sm text-gray-500 dark:text-gray-400">
                    Showing
                    <span class="font-medium">{{ (page - 1) * pageCount + 1 }}</span>
                    to
                    <span class="font-medium">{{ page * pageCount }}</span>
                    of
                    <span class="font-medium">{{ store.product.length }}</span>
                    results
                  </span>
                </div>
              </div>

              <!-- selected show -->
              <!-- <Selected
                :selected="store.selected"
                :product="store.product"
                @productUrl="cloudinaryUrl($event)"
              /> -->
            </div>
          </div>
        </div>
        <div class="flex justify-center items-center">
          <p class="text-gray-400 text-sm">
            &copy; 2023 <span class="text-blue-500">Acewears</span
            ><span class="text-orange-500">Technologies</span>
          </p>
        </div>
      </div>
      <div class="" v-show="analytics">
        <ClientOnly>
          <AnalyticsProductsVsSales />
        </ClientOnly>
      </div>

      <!-- <ClientOnly>
      <chart />
    </ClientOnly> -->
      <!-- <ClientOnly>
      <DarkChart />
    </ClientOnly> -->
    </main>
  </main>
</template>
<style>
* {
  scrollbar-width: thin;
  scrollbar-color: rgba(155, 155, 155, 0.5) transparent;
}
::-webkit-scrollbar {
  width: 5px;
}
</style>
