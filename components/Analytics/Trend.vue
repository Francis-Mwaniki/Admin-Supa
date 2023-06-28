<template>
  <div class="grid grid-cols-1 gap-6 lg:grid-cols-3 mb-6">
    <div
      v-for="(card, index) in cards"
      :key="index"
      :class="[card.color, 'p-4 border border-gray-300 rounded-md']"
    >
      <div class="flex items-center mb-2">
        <i :class="[card.icon, 'text-2xl mr-2']"></i>
        <h3 class="text-lg font-semibold">{{ card.number }}</h3>
      </div>
      <div class="flex items-center">
        <div
          :class="[
            card.trendType === 'up'
              ? 'text-green-500'
              : card.trendType === 'down'
              ? 'text-red-500'
              : 'text-yellow-500',
            'text-sm flex items-center',
          ]"
        >
          <i v-if="card.trendType === 'up'" class="mdi mdi-arrow-up-bold mr-1"></i>
          <i v-if="card.trendType === 'down'" class="mdi mdi-arrow-down-bold mr-1"></i>
          <span>{{ card.trend }}</span>
        </div>
        <span class="ml-2 text-gray-600">{{ card.label }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      cards: [
        {
          trend: "12%",
          trendType: "up",
          color: "text-emerald-500",
          icon: "mdi mdi-account-multiple",
          number: 512,
          label: "Clients",
        },
        {
          trend: "12%",
          trendType: "down",
          color: "text-blue-500",
          icon: "mdi mdi-cart-outline",
          number: 7770,
          prefix: "$",
          label: "Sales",
        },
        {
          trend: "Overflow",
          trendType: "alert",
          color: "text-red-500",
          icon: "mdi mdi-chart-timeline-variant",
          number: 256,
          suffix: "%",
          label: "Performance",
        },
      ],
    };
  },
};
</script>

<style scoped>
.text-emerald-500 {
  color: #10b981;
}

.text-blue-500 {
  color: #3b82f6;
}

.text-red-500 {
  color: #ef4444;
}

.text-green-500 {
  color: #22c55e;
}

.text-yellow-500 {
  color: #f59e0b;
}
</style>
