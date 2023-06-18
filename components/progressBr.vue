<template>
  <div class="min-h-screen py-20 px-10 bg-gray-100">
    <div
      class="flex items-center flex-wrap max-w-md px-10 bg-white shadow-xl rounded-2xl h-20"
    >
      <div
        class="flex items-center justify-center -m-6 overflow-hidden bg-white rounded-full"
      >
        <svg class="w-32 h-32 transform translate-x-1 translate-y-1" aria-hidden="true">
          <circle
            class="text-gray-300"
            stroke-width="10"
            stroke="currentColor"
            fill="transparent"
            r="50"
            cx="60"
            cy="60"
          />
          <circle
            class="text-blue-600"
            stroke-width="10"
            :stroke-dasharray="circumference"
            :stroke-dashoffset="getCircumference()"
            stroke-linecap="round"
            stroke="currentColor"
            fill="transparent"
            r="50"
            cx="60"
            cy="60"
          />
        </svg>
        <span class="absolute text-2xl text-blue-700">{{ percent }}%</span>
      </div>
      <p class="ml-10 font-medium text-gray-600 sm:text-xl">Upload Progress</p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    percent: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      circumference: 50 * 2 * Math.PI,
    };
  },
  methods: {
    getCircumference() {
      return this.circumference - (this.percent / 100) * this.circumference;
    },
  },
};
</script>

<style>
/* Add your custom styles here */
</style>
