<template>
  <section>
    <div class="px-2" :class="isShowCHart == true ? 'block ease-in' : 'hidden ease-out'">
      <div class="py-4">
        <canvas class="h-screen object-contain" ref="chart"></canvas>
      </div>
    </div>
  </section>
</template>

<script>
import { Chart, registerables } from 'chart.js'
import annotationPlugin from 'chartjs-plugin-annotation'
import { getDetailDeviceAcs } from '@/boot/hooks'
import { adjustOpacity, convertFrequencyToChannel, mapDataSetChart } from '@/boot/helper'
import colorPalette from '@/boot/colorPalette'

Chart.register(annotationPlugin)
Chart.register(...registerables)

export default {
  props: { isShowCHart: Boolean },
  data() {
    return {
      manufacturer: null,
      idDevice: null,
      chart: null,
      array: {
        chart: [],
        yLabels: [],
        xLabels: [
          2400, 2412, 2417, 2422, 2427, 2432, 2437, 2442, 2447, 2452, 2457, 2462, 2467, 2472, 2484,
          2500
        ]
      }
    }
  },
  methods: {
    async getData() {
      this.idDevice = this.$route.params.id

      await getDetailDeviceAcs(this.idDevice)
        .then((response) => {
          const parseData = JSON.parse(
            response.data[0].VirtualParameters.WLANNeighborAllFiltered._value
          )
          this.manufacturer = response.data[0]._deviceId._Manufacturer
          const filterArray = parseData.filter(
            (item) => parseInt(item.Channel) >= 1 && parseInt(item.Channel) <= 13
          )
          this.array.chart = mapDataSetChart(filterArray, this.manufacturer)
          let tempSignalStreght = []
          this.array.chart.map((data) => {
            tempSignalStreght.push(data.SignalStrength)
          })
          this.array.yLabels = tempSignalStreght
        })
        .catch((e) => console.log(e))
    },
    transformY(value) {
      return value + 100
    },
    retransformY(value) {
      return value - 100
    },
    randomHex(size) {
      return [...Array(size)].map(() => Math.floor(Math.random() * 16).toString(16)).join('')
    },
    calculateStepSize() {
      let stepSizes = []
      for (let i = 1; i < this.array.xLabels.length; i++) {
        const stepSize = this.array.xLabels[i] - this.array.xLabels[i - 1]
        stepSizes.push(stepSize)
      }
      // Return the smallest step size, or you can average them if you want consistency
      return Math.min(...stepSizes)
    },
    async initChart() {
      this.getData().then(() => {
        let ctx = this.$refs.chart.getContext('2d')

        this.chart = new Chart(ctx, {
          type: 'line',
          data: {
            labels: convertFrequencyToChannel(this.array.xLabels),
            datasets: this.array.chart?.map((item) => ({
              borderColor: colorPalette.areaPalette,
              backgroundColor: colorPalette.areaPalette.map((color) => adjustOpacity(color, 0.18)),
              fill: 'origin',
              borderWidth: 1.5,
              tension: 0.27,
              pointStyle: false,
              data: item.dataset
                .map((data) => {
                  return {
                    x: data.x, // Ambil x dari indeks 1
                    y: this.transformY(data.y)
                  }
                })
                .filter(Boolean) // Hilangkan nilai undefined
            }))
          },
          options: {
            layout: {
              padding: 2
            },
            responsive: true,
            plugins: {
              legend: {
                display: false
              },
              tooltip: {
                enabled: false
              },
              annotation: {
                annotations: this.array.chart.map((data) => ({
                  type: 'label',
                  xValue: data.dataset[1].x, // Posisi berdasarkan x dari index 1
                  yValue: this.transformY(data.dataset[1].y + 1.2), // Sedikit di atas titik
                  content: data.SSID,
                  backgroundColor: 'rgba(0,0,0,0)',
                  font: {
                    size: 10
                  },
                  color: '#131842',
                  position: 'top'
                }))
              }
            },
            scales: {
              x: {
                type: 'linear',
                position: 'bottom',
                grid: {
                  display: true,
                  borderDash: [6],
                  borderDashOffset: [6]
                },
                autoSkip: false,
                ticks: {
                  callback: (value) =>
                    this.array.xLabels.includes(value) ? convertFrequencyToChannel(value) : null,
                  stepSize: 1, // Bisa juga dikustom untuk step yang diinginkan
                  display: true,
                  font: {
                    size: 12,
                    lineHeight: 1.5,
                    weight: '400',
                    family: 'Open Sans'
                  }
                }
              },
              y: {
                beginAtZero: false,
                ticks: {
                  callback: (value) =>
                    this.array.yLabels.includes(value - 100) ? value - 100 : null,
                  stepSize: 1
                }
              }
            }
          }
        })
      })
    },
    onInit() {
      if (this.chart) {
        this.chart.destroy()
      }
      this.initChart()
    }
  },
  mounted() {
    this.initChart()
  },
  beforeUnmount() {
    this.chart.destroy()
    this.array.chart = []
    this.array.yLabels = []
  },
  watch: {
    '$route.params.id': {
      immediate: false,
      handler() {
        if (this.chart) {
          this.chart.destroy()
          this.array.chart = []
          this.array.yLabels = []
        }
        this.initChart()
      }
    }
  }
}
</script>
