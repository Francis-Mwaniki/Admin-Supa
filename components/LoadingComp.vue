<template>
  <div v-if="isLoading" class="flex items-center justify-center h-full pt-20">
    <span class="text-sm font-bold flex inset-0 z-20 text-white">
      <div class="loader"></div>
    </span>
  </div>
</template>

<script>
export default {
  props: {
    isLoading: {
      type: Boolean,
    },
    isEditing: {
      type: Boolean,
    },
    isSaving: {
      type: Boolean,
    },
  },
  data() {
    return {};
  },

  // Other methods for people and popup
};
</script>

<style>
.loader {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  animation: spin 2s linear infinite;
  margin: auto;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
