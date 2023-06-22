<template>
  <div>
    <!--h2 Actual Sales -->
    <div class="flex justify-center">
      <h2 class="text-2xl mb-4">Actual Sales</h2>
    </div>

    <ClientOnly>
      <div class="overflow-auto">
        <div class="mt-4 bg-gray-900 sm:-mx-6 lg:-mx-8">
          <apexchart
            class="w-full rounded-lg text-black"
            :key="series"
            height="400"
            width="100%"
            :options="options"
            :series="series"
          ></apexchart>
        </div>
        <div class="flex justify-center my-4">
          <UButton
            @click.prevent="updateChart"
            class="text-white font-medium rounded-md shadow-lg bg-background filter hover:brightness-90 px-6"
            variant="solid"
            color="green"
          >
            Update Chart
          </UButton>
        </div>
      </div>
    </ClientOnly>
  </div>
</template>
<script setup lang="ts">
// const options = ref({
//   chart: {
//     type: "bar",
//   },
//   plotOptions: {
//     bar: {
//       borderRadius: 10,
//       borderRadiusApplication: "around",
//     },
//   },
// });
const options = ref({
  chart: {
    type: "bar",
    height: 350,
    stacked: true,
    toolbar: {
      show: true,
    },
    zoom: {
      enabled: true,
    },
  },
  responsive: [
    {
      breakpoint: 480,
      options: {
        legend: {
          position: "bottom",
          offsetX: -10,
          offsetY: 0,
        },
      },
    },
  ],
  plotOptions: {
    bar: {
      horizontal: false,
    },
  },
  xaxis: {
    type: "datetime",
    categories: [
      "01/01/2011 GMT",
      "01/02/2011 GMT",
      "01/03/2011 GMT",
      "01/04/2011 GMT",
      "01/05/2011 GMT",
      "01/06/2011 GMT",
    ],
  },
  legend: {
    position: "right",
    offsetY: 40,
  },
  fill: {
    opacity: 1,
  },
});

const series = ref([
  {
    name: "Score",
    data: [10, 41, 35, 51, 49, 62, 69, 91, 148, 100],
  },
]);
const updateChart = () => {
  //generate array of random numbers of length 10
  const data = Array.from({ length: 10 }, () => Math.floor(Math.random() * 100));
  //   options.value = {
  //     ...options.value,
  //     xaxis: {
  //       categories: Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i), // array of last 10 years
  //     },
  //   };
  series.value = [
    {
      name: "Score",
      data: data,
    },
  ];
};
onMounted(() => {
  //generate array of random numbers of length 10
  //const data = Array.from({ length: 10 }, () => Math.floor(Math.random() * 100));

  updateChart();
});
</script>
