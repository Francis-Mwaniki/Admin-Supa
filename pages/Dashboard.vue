<script setup>
import Admin from "@/components/Admin.vue";
import reset_Password from "~/components/reset_Password.vue";
import { useFetch } from "nuxt/app";
import { ref, computed, onMounted } from "vue";
const client = useSupabaseClient();
const user = useSupabaseUser();
const auth = useSupabaseAuthClient();
const { account } = useAppwrite();
import { userStore } from "~/store/user.js";
const q = ref("");
const AppwriteUser = ref({});
// AppwriteUser.value = await account.get();
const store = userStore();

const fetchAccount = async () => {
  store.isAppwriteUser = true;
  try {
    AppwriteUser.value = await account.get();
    // console.log(AppwriteUser.value);
  } catch (e) {
    console.log(e);
    // store.isAppwriteUser = false;
    // toast.add({
    //   title: "Note",
    //   description: e.message ? e.message : e,
    // });
  }
};

onBeforeMount(() => {
  fetchAccount();
});

onMounted(async () => {
  /* check if user exist if exist dont call fetchAccount else call if not redirect  Login*/
});
watch([AppwriteUser, user], () => {
  if (AppwriteUser.value !== null) {
    navigateTo("/Dashboard");
  } else if (user.value !== null) {
    navigateTo("/Dashboard");
  } else {
    navigateTo("/Login");
  }
});
// });
// definePageMeta({
//   middleware: "auth",
// });
// onMounted(() => {
//   const data = useFetch("/api/mpesa");
//   return new Promise((resolve, reject) => {
//     setTimeout(() => {
//       resolve(data);
//     }, 2000);
//     console.log(data);
//   });
// });

/* sort products by title */

/* add to supabase */

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
  const { data, error } = await client.from("Products").insert([
    {
      title: store.productData.name,
      price: store.productData.size,
      description: store.productData.desc,
      url: store.productData.url,
    },
  ]);

  if (error) {
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
    store.showModal = false;
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
const toast = useToast();
const columns = [
  // {  sortable: true, key: "image", label: "Image" },
  { sortable: true, key: "id", label: "id" },
  { sortable: true, key: "name", label: "Name" },
  { sortable: true, key: "price", label: "Price" },
  { sortable: true, key: "created_at", label: "Date" },
  { sortable: true, key: "actions", label: "Actions" },
];
const page = ref(1);
const pageCount = 5;
const fetchProducts = async () => {
  const { data, error } = await client
    .from("Products")
    .select("*")
    .order("created_at", { ascending: false });
  //.range(page, pageCount);
  try {
    if (error) {
      toast.add({
        title: "Huh!",
        description: "Check your Internet!",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } else {
      store.product = data;
      // console.log("data", data);
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

const items = (row) => [
  [
    {
      label: "Edit",
      icon: "i-heroicons-pencil-square-20-solid",
      click: () => console.log("Edit", row.id),
    },
    {
      label: "Duplicate",
      icon: "i-heroicons-document-duplicate-20-solid",
    },
  ],
  [
    {
      label: "Archive",
      icon: "i-heroicons-archive-box-20-solid",
    },
    {
      label: "Move",
      icon: "i-heroicons-arrow-right-circle-20-solid",
    },
  ],
  [
    {
      label: "Delete",
      icon: "i-heroicons-trash-20-solid",
    },
  ],
];
fetchProducts();
const openModal = () => {
  store.showModal = true;
};
</script>

<template>
  <div>
    <div class="" v-show="store.showResetModal">
      <reset_Password />
    </div>
    <div class="" v-if="!store.showResetModal">
      <div class="flex justify-end items-end py-2"><Admin /></div>
      <div
        v-if="store.showModal"
        class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-40"
      >
        <div class="bg-gray-950 z-20 rounded-lg p-8 max-w-2xl w-full">
          <h2 class="text-2xl font-bold mb-4">
            {{ store.isSaving ? "Edit product" : "Add Product" }}
          </h2>
          <form @submit.prevent="addProductToSupaBase">
            <div class="mb-4">
              <label for="name" class="block text-white">Name:</label>
              <UInput
                v-model="store.productData.name"
                type="text"
                id="name"
                class="bg-gray-200 text-black border border-gray-300 rounded px-3 py-2 w-full"
                required
              />
            </div>
            <div class="mb-4">
              <label for="size" class="block text-white">Price:</label>
              <UInput
                v-model="store.productData.size"
                type="number"
                id="size"
                class="bg-gray-200 text-black border border-gray-300 rounded px-3 py-2 w-full"
                required
              />
            </div>
            <div class="mb-4 mt-2">
              <label for="File" class="block text-white">Select File:</label>
              <CloudUpload @uploaded="handleUrl" />
            </div>

            <div class="mb-4 mt-2">
              <label for="desc" class="block text-white">Description:</label>
              <UTextarea
                v-model="store.productData.desc"
                type="desc"
                id="desc"
                rows="3"
                class="bg-gray-200 text-black border border-gray-300 rounded px-3 py-2 w-full"
                required
              />
            </div>

            <div
              class="flex md:flex-row flex-col mx-auto justify-center gap-y-2 items-center md:justify-start w-full flex-1 max-w-xl gap-x-2"
            >
              <UButton
                type="submit"
                class="text-white px-6 md:w-1/2 text-center py-3 w-full align-middle"
                color="green"
                variant="solid"
                :disabled="store.isSaving"
                :loading="store.isSaving"
              >
                <p class="text-center">{{ store.isSaving ? "Save Changes" : "Add" }}</p>
              </UButton>
              <UButton
                @click="store.showModal = false"
                variant="solid"
                class="px-4 md:w-1/2 w-full py-3"
                >Cancel</UButton
              >
            </div>
          </form>
        </div>
      </div>
      <div class="max-w-6xl mx-auto py-4">
        <div
          class="mx-auto flex flex-row gap-x-4 md:gap-y-1 gap-y-3 space-x-2 flex-grow flex-wrap"
        >
          <UInput v-model="q" placeholder="Filter products..." />
          <UButton
            label="Add Product."
            @click="store.showModal = true"
            class="focus:bg-green-400"
          >
            <span>Add Product</span>
            <ClientOnly><Icon name="ic:round-plus" class="h-6 w-6" /></ClientOnly>
          </UButton>
          <UButton
            label="Delete Product."
            @click="deleteSelectedProducts"
            :color="store.selected.length > 0 ? 'red' : 'green'"
            :disabled="store.isDeleting"
            :loading="store.isDeleting"
          >
            <span class="">{{ store.isDeleting ? "Deleting" : "Delete Product" }}</span>
            <ClientOnly>
              <Icon
                v-if="!store.isDeleting"
                name="ic:round-delete-forever"
                class="w-6 h-6"
            /></ClientOnly>
          </UButton>
        </div>
        <div v-if="store.searching" class="overflow-x-auto">
          <div class="sm:-mx-6 lg:-mx-8">
            <div class="inline-block min-w-full sm:px-6 lg:px-8">
              <UTable
                class="mt-4 bg-gray-900"
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
                  <NuxtImg :src="row.url" class="h-14 w-14 rounded-full" alt="" />
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

        <div class="overflow-x-auto" v-if="!store.searching">
          <div class="mt-4 bg-gray-900 sm:-mx-6 lg:-mx-8">
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
                <NuxtImg :src="row.url" class="h-14 w-14 rounded-full" alt="" />
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
        <Selected
          :selected="store.selected"
          :product="store.product"
          @productUrl="cloudinaryUrl($event)"
        />
      </div>
    </div>
  </div>
</template>
