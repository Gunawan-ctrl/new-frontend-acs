<template>
  <div class="bg-white px-8 w-full border border-gray-200 rounded-md">
    <section>
      <div class="flex flex-row justify-between items-center pt-4">
        <h1 class="capitalize font-medium">wifi analyzer</h1>
        <a-button>
          <font-awesome-icon icon="rotate-right" />
        </a-button>
      </div>
    </section>
    <section>
      <div class="py-4">
        <canvas height="120px" ref="chart"></canvas>
      </div>
    </section>
  </div>
</template>

<script>
import { Chart, registerables } from 'chart.js'
Chart.register(...registerables)

export default {
  props: {
    data: Array
  },
  mounted() {
    this.renderChart()
  },
  methods: {
    renderChart() {
      let ctx = this.$refs.chart.getContext('2d')
      this.chart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['a', 'b', 'c'],
          datasets: [
            {
              label: 'Total Users',
              backgroundColor: ['#3392c4', '#3480ed', '#fcc936 ', '#333333'],
              borderWidth: 0,
              borderSkipped: false,
              borderRadius: 6,
              data: this.data,
              maxBarThickness: 40
            }
          ]
        }
      })
    }
  }
}
</script>
