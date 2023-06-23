<template>
  <div id="wrapper">
    <div class="content-area">
      <div class="container-fluid">
        <div class="main">
          <div class="row sparkboxes mt-4">
            <!-- <div class="row mt-4 md:flex flex-row justify-center gap-x-2">
              <div class="col-md-5">
                <div class="box shadow mt-4">
                  <ClientOnly>
                    <apexchart
                      class="w-full rounded-lg text-black"
                      :options="radialBarOptions"
                      :series="radialBarSeries"
                      type="radialBar"
                    ></apexchart>
                  </ClientOnly>
                </div>
              </div>
              <div class="col-md-5">
                <div class="box shadow mt-4">
                  <ClientOnly>
                    <apexchart
                      class="w-full rounded-lg text-black"
                      :options="radialBarOptions2"
                      :series="radialBarSeries2"
                      type="radialBar"
                    ></apexchart>
                  </ClientOnly>
                </div>
              </div>
            </div> -->
            <div class="col-md-3">
              <div class="box box4">
                <div class="details">
                  <h3>22</h3>
                  <h4>SALES</h4>
                </div>
                <ClientOnly>
                  <apexchart
                    class="w-full rounded-lg text-black"
                    :options="spark4Options"
                    :series="spark4Series"
                    type="area"
                  ></apexchart>
                </ClientOnly>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      spark1Options: {},
      spark1Series: [],
      spark2Options: {},
      spark2Series: [],
      spark3Options: {},
      spark3Series: [],
      spark4Options: {},
      spark4Series: [],
      radialBarOptions: {},
      radialBarSeries: [],
      radialBarOptions2: {},
      radialBarSeries2: [],
      lineAdwordsOptions: {},
      lineAdwordsSeries: [],
      barChartOptions: {},
      barChartSeries: [],
      areaChartOptions: {},
      areaChartSeries: [],
    };
  },
  mounted() {
    this.initializeCharts();
  },
  methods: {
    initializeCharts() {
      this.spark1Options = {
        chart: {
          type: "area",
        },
        // Other options...
      };
      this.spark1Series = [
        {
          name: "Series 1",
          data: [30, 40, 25, 50, 49, 21, 70, 51, 32, 42, 62, 38],
        },
      ];

      this.spark2Options = {
        chart: {
          type: "area",
        },
        // Other options...
      };
      this.spark2Series = [
        {
          name: "Series 1",
          data: [11, 32, 45, 32, 34, 52, 41, 30, 31, 23, 29, 22],
        },
      ];

      this.spark3Options = {
        chart: {
          type: "area",
        },
        // Other options...
      };
      this.spark3Series = [
        {
          name: "Series 1",
          data: [50, 35, 47, 25, 42, 32, 45, 38, 30, 32, 45, 42],
        },
      ];

      this.spark4Options = {
        chart: {
          type: "area",
        },
        // Other options...
      };
      this.spark4Series = [
        {
          name: "Series 1",
          data: [20, 35, 18, 25, 22, 27, 25, 15, 32, 20, 18, 22],
        },
      ];

      this.lineAdwordsOptions = {
        chart: {
          type: "line",
        },
        // Other options...
      };
      this.lineAdwordsSeries = [
        {
          name: "Series 1",
          data: [30, 40, 35, 50, 49, 60, 70, 91, 85, 90, 75, 80],
        },
      ];

      this.barChartOptions = {
        chart: {
          type: "bar",
        },
        // Other options...
      };
      this.barChartSeries = [
        {
          name: "Series 1",
          data: [44, 55, 41, 67, 22, 43, 21],
        },
      ];

      this.areaChartOptions = {
        chart: {
          type: "area",
        },
        // Other options...
      };
      this.areaChartSeries = [
        {
          name: "Series 1",
          data: [30, 40, 25, 50, 49, 21, 70, 51, 32, 42, 62, 38],
        },
        {
          name: "Series 2",
          data: [11, 32, 45, 32, 34, 52, 41, 30, 31, 23, 29, 22],
        },
        {
          name: "Series 3",
          data: [50, 35, 47, 25, 42, 32, 45, 38, 30, 32, 45, 42],
        },
      ];
    },
  },
};
</script>

<style scoped>
/* Add Tailwind CSS classes here */
</style>
