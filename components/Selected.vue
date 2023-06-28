<template>
  <!-- <div class="container mx-auto py-8 bg-gray-950 text-white">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="(product, index) in selected"
        :key="product.id"
        class="bg-gray-800 shadow-lg rounded-lg p-6"
      >
        <div class="mb-4">
          <span class="text-primary-500 dark:text-primary-400">{{ product.name }}</span>
        </div>
        <div class="flex justify-end">
          <UDropdown :items="items(product)">
            <UButton
              color="gray"
              variant="ghost"
              icon="i-heroicons-ellipsis-horizontal-20-solid"
            />
          </UDropdown>
          <UButton
            @click="deleteProduct(index)"
            color="red"
            variant="solid"
            icon="i-heroicons-trash-20-solid"
            class="ml-2"
          />
          <UButton
            @click="editProduct(index)"
            color="green"
            variant="solid"
            icon="i-heroicons-pencil-square-20-solid"
            class="ml-2"
          />
        </div>
      </div>
    </div>
  
    <div
      v-if="showPopup"
      class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
    >
      <div class="bg-gray-800 rounded-lg p-8">
        <h2 class="text-2xl font-bold mb-4">
          {{ isEditing ? "Edit product" : "Add Product" }}
        </h2>
        <form @submit.prevent="saveProduct">
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
            <label for="size" class="block text-white">size:</label>
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
              {{ isLoading ? "Save Changes" : "Add" }}
            </UButton>
            <UButton @click="cancelEdit" variant="solid" class="ml-2 bg-green-400"
              >Cancel</UButton
            >
          </div>
        </form>
      </div>
    </div>

  </div> -->
</template>

<script>
import LoadingComp from "~/components/LoadingComp.vue";
import CloudUpload from "~/components/CloudUpload.vue";
import axios from "axios";
export default {
  // props: {
  //   selected: {
  //     type: Array,
  //     required: true,
  //   },
  //   product: {
  //     type: Array,
  //     required: true,
  //   },
  // },
  components: {
    LoadingComp,
    CloudUpload,
  },
  data() {
    return {
      columns: [
        { key: "name", label: "Name" },
        { key: "size", label: "size" },
        { key: "desc", label: "desc" },
        { key: "actions", label: "Actions" },
      ],
      isLoading: false,
      showPopup: false,
      selectedFile: null,
      isLoading: false,
      isEditing: false,
      toast: useToast(),
      isSaving: false,
      productData: { id: null, url: "", name: "", size: "", desc: "" },
    };
  },
  methods: {
    items(product) {
      return [
        [
          {
            label: "Edit",
            icon: "i-heroicons-pencil-square-20-solid",
            click: () => this.editProduct(product.id),
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
            click: () => this.deleteProduct(product.id),
          },
        ],
      ];
    },
    deleteProduct(index) {
      this.selected.splice(index, 1);
    },

    handleUrl(url) {
      this.productData.url = url;
      this.$emit("productUrl", url);
    },
    editProduct(product) {
      this.isLoading = true;
      this.productData = {
        id: product.id,
        name: product.name,
        size: product.size,
        desc: product.desc,
      };

      this.showPopup = true;
    },
    saveProduct() {
      this.isSaving = true;
      console.log("this.productData", this.productData);
      if (this.isEditing) {
        // Update existing product
        const index = this.product.findIndex((p) => p.id === this.productData.id);
        if (index !== -1) {
          this.product.splice(index, 1, this.productData);
        }
      } else {
        // Add new product
        const newId = this.product.length + 1;
        this.productData.id = newId;
        this.product.push(this.productData);
      }
    },

    cancelEdit() {
      this.showPopup = false;
      this.isLoading = false;
      this.productData = { id: null, name: "", size: "", desc: "" };
      this.isSaving = false;
    },
  },
};
</script>
