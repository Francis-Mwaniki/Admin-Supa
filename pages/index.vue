<script setup>
import Admin from "@/components/Admin.vue";
import { useFetch } from "nuxt/app";
import { ref, computed, onMounted } from "vue";
const client = useSupabaseClient();
const q = ref("");
const product = ref([]);
const isAdding = ref(false);
const isLoading = ref(false);
const selected = ref([]);
const isEditing = ref(false);
const isSaving = ref(false);
const productData = ref({ id: null, url: "", name: "", size: "", desc: "" });
const searching = ref(false);

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
  productData.value.url = url;
  console.log("url", url);
};
const addProductToSupaBase = async () => {
  isSaving.value = true;
  isAdding.value = true;
  console.log("productData", productData.value);
  const { data, error } = await client.from("Products").insert([
    {
      title: productData.value.name,
      price: productData.value.size,
      description: productData.value.desc,
      url: productData.value.url,
    },
  ]);
  if (error) {
    isSaving.value = false;
    console.log(error);
  } else {
    isSaving.value = false;
    toast.add({
      title: "Product Added",
      description: "Product Added Successfully",
      status: "success",
      duration: 5000,
      isClosable: true,
    });
    setTimeout(() => {
      isAdding.value = false;
      productData.value = { id: null, url: "", name: "", size: "", desc: "" };
    }, 2000);
    await fetchProducts();
  }
};
/*    deleteSelectedProducts in supabase 
const { data, error } = await supabase
  .from('Products')
  .delete()
  .eq('some_column', 'someValue')


*/
const deleteSelectedProducts = async () => {
  /* user must select only one at a time */
  if (selected.value.length > 1) {
    toast.add({
      title: "Error",
      description: "Please select only one product at a time",
      status: "error",
      duration: 5000,
      isClosable: true,
    });
    return;
  }
  if (selected.value.length === 0) {
    toast.add({
      title: "Error",
      description: "Please select a product",
      status: "error",
      duration: 5000,
      isClosable: true,
    });
    return;
  }

  isLoading.value = true;
  console.log("selected", selected.value[0].id);
  try {
    const { data, error } = await client
      .from("Products")
      .delete()
      .eq("id", selected.value[0].id);
    if (error) {
      isLoading.value = false;
      console.log(error);
    } else {
      isLoading.value = false;
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
  searching.value = true;

  if (!q.value) {
    return product.value;
  }

  return product.value.filter((product) => {
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
    searching.value = false;
  } else {
    searching.value = true;
    /* paginate to 5  */
    return product.value.filter((product) => {
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
      product.value = data;
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
  return product.value.slice((page.value - 1) * pageCount, page.value * pageCount);
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
</script>

<template>
  <div class="flex justify-end items-end py-2"><Admin /></div>
  <div
    v-if="isAdding"
    class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-40"
  >
    <div class="bg-gray-900 bg-opacity-80 z-20 rounded-lg p-8 max-w-2xl w-full">
      <h2 class="text-2xl font-bold mb-4">
        {{ isEditing ? "Edit product" : "Add Product" }}
      </h2>
      <form @submit.prevent="addProductToSupaBase">
        <div class="mb-4">
          <label for="name" class="block text-white">Name:</label>
          <input
            v-model="productData.name"
            type="text"
            id="name"
            class="bg-gray-200 text-black border border-gray-300 rounded px-3 py-2 w-full"
            required
          />
        </div>
        <div class="mb-4">
          <label for="size" class="block text-white">Price:</label>
          <input
            v-model="productData.size"
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
          <label for="desc" class="block text-white">desc:</label>
          <input
            v-model="productData.desc"
            type="desc"
            id="desc"
            class="bg-gray-200 text-black border border-gray-300 rounded px-3 py-2 w-full"
            required
          />
        </div>

        <div class="flex justify-end">
          <UButton
            type="submit"
            class="text-white"
            color="green"
            variant="solid"
            :disabled="isSaving"
            :loading="isSaving"
          >
            {{ isAdding ? "Save Changes" : "Add" }}
          </UButton>
          <UButton @click="isAdding = false" variant="solid" class="ml-2">Cancel</UButton>
        </div>
      </form>
    </div>
  </div>
  <div class="max-w-6xl mx-auto py-4">
    <div class="mx-auto flex flex-row gap-x-4 space-x-2">
      <UInput v-model="q" placeholder="Filter products..." />
      <UButton label="Add Product." @click="isAdding = true" class="focus:bg-green-400">
        <span>Add Product</span>
        <ClientOnly><Icon name="ic:round-plus" /></ClientOnly>
      </UButton>
      <UButton
        label="Delete Product."
        @click="deleteSelectedProducts"
        :class="selected.length ? 'bg-red-500' : 'bg-gray-500'"
      >
        <span class="">{{ isLoading ? "deleting...." : "Delete Product" }}</span>
        <ClientOnly><Icon name="ic:round-delete-forever" /></ClientOnly>
      </UButton>
    </div>
    <div v-if="searching">
      <UTable
        class="mt-4 bg-gray-900"
        v-model="selected"
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
              selected.find((product) => product.id === row.id) &&
                'text-primary-500 dark:text-primary-400',
            ]"
            >{{ row.title }}</span
          >

          <span
            :class="[
              selected.find((product) => product.id === row.id) &&
                'text-primary-500 dark:text-primary-400',
            ]"
            >{{ row.price }}</span
          >
          <span
            :class="[
              selected.find((product) => product.id === row.id) &&
                'text-primary-500 dark:text-primary-400',
            ]"
            >{{ 23 + 3 }}</span
          >

          <span
            :class="[
              selected.find((product) => product.id === row.id) &&
                'text-primary-500 dark:text-primary-400',
            ]"
            >{{ row.id }}</span
          >
        </template>

        <template #actions-data="{ row }">
          <UDropdown :items="items(row)">
            <UButton variant="ghost" icon="i-heroicons-ellipsis-horizontal-20-solid" />
          </UDropdown>
        </template>
      </UTable>
    </div>
    <div class="" v-if="!searching">
      <UTable
        v-model="selected"
        class="mt-4 bg-gray-900"
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
        {{ selected }}
        <template #name-data="{ row }">
          <NuxtImg :src="row.url" class="h-14 w-14 rounded-full" alt="" />
          <span
            :class="[
              selected.find((product) => product.id === row.id) &&
                'text-primary-500 dark:text-primary-400',
            ]"
            >{{ row.title }}</span
          >
        </template>

        <template #actions-data="{ row }">
          <UDropdown :items="items(row)">
            <UButton variant="ghost" icon="i-heroicons-ellipsis-horizontal-20-solid" />
          </UDropdown>
        </template>
      </UTable>
      <UPagination v-model="page" :page-count="pageCount" :total="product.length" />
      <!-- total number of products with tailwindcss -->
      <div class="flex justify-end">
        <span class="text-sm text-gray-500 dark:text-gray-400">
          Showing
          <span class="font-medium">{{ (page - 1) * pageCount + 1 }}</span>
          to
          <span class="font-medium">{{ page * pageCount }}</span>
          of
          <span class="font-medium">{{ product.length }}</span>
          results
        </span>
      </div>
    </div>
    <!-- selected show -->
    <Selected
      :selected="selected"
      :product="product"
      @productUrl="cloudinaryUrl($event)"
    />
  </div>
</template>
