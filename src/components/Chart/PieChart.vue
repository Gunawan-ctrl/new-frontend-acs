<template>
  <main class="bg-white px-8 py-4 w-full shadow-sm rounded-md">
    <div>
      <section>
        <div ref="chart" style="height: 400px"></div>
      </section>
    </div>
  </main>
</template>
<script>
import * as echarts from 'echarts'

export default {
  props: {
    data: Array
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$refs.chart)
      const option = {
        title: {
          text: 'pie chart'
        },
        tooltip: {
          trigger: 'item'
        },
        series: [
          {
            name: 'Access From',
            type: 'pie',
            radius: '50%',
            data: this.data,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ],
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        }
      }
      this.chart.setOption(option)
    }
  },
  mounted() {
    this.initChart()
  }
}
</script>
