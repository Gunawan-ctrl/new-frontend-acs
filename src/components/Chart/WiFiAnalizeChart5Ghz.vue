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
import { adjustOpacity, convertFrequencyToChannel5GHz, mapDataSetChart5Ghz } from '@/boot/helper'
import colorPalette from '@/boot/colorPalette'

Chart.register(annotationPlugin)
Chart.register(...registerables)

export default {
  props: { isShowCHart: Boolean },
  data: () => ({
    manufacturer: null,
    idDevice: null,
    chart: null,
    array: {
      chart: [],
      xLabels: [
        5000, 5180, 5200, 5220, 5240, 5260, 5280, 5300, 5320, 5500, 5520, 5540, 5560, 5580, 5600,
        5620, 5640, 5660, 5680, 5700, 5745, 5765, 5785, 5805, 5825, 5845, 5865, 5885
      ],
      yLabels: []
    }
  }),
  methods: {
    async getData() {
      this.idDevice = this.$route.params.id
      await getDetailDeviceAcs(this.idDevice)
        .then((res) => {
          this.manufacturer = res.data[0]._deviceId._Manufacturer
          const parseData = JSON.parse(res.data[0].VirtualParameters.WLANNeighborAllFiltered._value)
          const filterArray = parseData.filter((item) => parseInt(item.Channel) > 13)
          this.array.chart = mapDataSetChart5Ghz(filterArray, this.manufacturer)
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
    async initChart() {
      this.getData().then(() => {
        let ctx = this.$refs.chart.getContext('2d')
        this.chart = new Chart(ctx, {
          type: 'line',
          data: {
            labels: convertFrequencyToChannel5GHz(this.array.xLabels),
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
                annotations: this.array.chart?.map((data) => ({
                  type: 'label',
                  xValue: data.dataset[1].x, // Posisi berdasarkan x dari index 1
                  yValue: this.transformY(data.dataset[1].y + 1.5), // Sedikit di atas titik
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
                    this.array.xLabels.includes(value)
                      ? convertFrequencyToChannel5GHz(value)
                      : null,
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
  }
}
</script>
