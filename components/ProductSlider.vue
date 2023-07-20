<script setup></script>

<template>
  <!-- UButton to store.isViewProduct = false -->

  <div @click="store.isViewProduct = false" class="overflow-auto">
    <USlideover v-model="store.isViewProduct" class="md:max-w-xl mx-auto overflow-auto">
      <p class="flex justify-start items-start p-5">
        <button
          class="inline-flex items-center focus:outline-none mr-4 bg-[#f40808] text-white py-2 px-4 rounded"
          variant="solid"
          @click="store.isViewProduct = false"
        >
          <Icon name="ic:round-close" class="mr-2" />
          Close
        </button>
      </p>
      <div class="bg-gray-950 p-4 rounded-lg shadow-lg flex py-5 my-auto flex-col">
        <NuxtImg
          :src="selectedProduct.image?.url"
          alt="Ace Shoe 2"
          class="w-full h-auto mb-4 rounded-lg"
        />
        <h2 class="text-xl font-semibold mb-2 text-gray-200">
          {{ selectedProduct.name }}
        </h2>
        <p class="text-gray-200 mb-2">{{ selectedProduct.description }}</p>
        <div class="flex items-center justify-between">
          <p class="text-gray-200 font-bold text-lg">{{ selectedProduct.price }}</p>
          <!-- <p class="text-gray-200 font-bold text-lg">{{ selectedProduct.price }}</p> -->
        </div>
      </div>
    </USlideover>
  </div>
</template>

<script>
import { userStore } from "@/store/user";
export default {
  props: {
    selectedProduct: {
      type: Object,
      required: true,
    },
  },
  setup(props, { emit }) {
    const store = userStore();
    const { selectedProduct } = toRefs(props);
    return {
      selectedProduct,
      store,
    };
  },
};
</script>
