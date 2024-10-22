<template>
  <main class="bg-white py-4 w-full shadow-sm rounded-md">
    <section>
      <SpinLoading :loading="isLoading" />
    </section>
    <section>
      <div class="flex flex-row items-center justify-between px-8 py-1">
        <h1 class="font-semibold text-sm">Networks & Devices Summary</h1>
        <!-- <a-select size="small" class="w-44" v-model:value="value.select" @select="onSelectSankey">
          <a-select-option value="vendor">manufacturer</a-select-option>
          <a-select-option value="serial_number">serial number</a-select-option>
          <a-select-option value="ip_address">ip address</a-select-option>
        </a-select> -->
      </div>
    </section>
    <a-divider class="my-2" />
    <section v-if="nodes && links">
      <div>
        <div ref="chart" class="h-svh"></div>
      </div>
    </section>
    <section v-else>
      <div>
        <a-empty :image="img" />
      </div>
    </section>
  </main>
</template>

<script>
import { Empty } from 'ant-design-vue'
import * as echarts from 'echarts'
import { getSummaryAdmin, getSummarySuperAdmin } from '@/boot/hooks'
import SpinLoading from '../Spin/SpinLoading.vue'

export default {
  components: { SpinLoading },
  data: () => ({
    isLoading: false,
    chart: null, // Chart instance will be stored here
    nodes: [],
    links: [],
    roleName: JSON.parse(localStorage.getItem('dataUser')),
    value: {
      select: 'vendor'
    },
    img: Empty.PRESENTED_IMAGE_SIMPLE
  }),
  methods: {
    async getSummary(params) {
      this.isLoading = true
      const addNode = (name, type, nodes) => {
        if (!nodes.some((node) => node.name === name)) {
          nodes.push({ name, type }) // Simpan jenis node (region, network, atau device)
        }
      }

      try {
        const res =
          this.roleName.role_name === 'super admin'
            ? await getSummarySuperAdmin()
            : await getSummaryAdmin()

        const regionNetworks = res.data.data.region_networks
        const networkDevices = res.data.data.network_devices

        const nodes = []
        const links = []

        // Build region → network links (Group pertama: Regions -> Networks)
        regionNetworks?.forEach((item) => {
          const regionName = item.regions.name
          const networkName = item.networks.name

          addNode(regionName, 'region', nodes)
          addNode(networkName, 'network', nodes)

          links.push({
            source: regionName,
            target: networkName,
            value: 1
          })
        })

        // Build network → device links (Group kedua: Networks -> Devices)
        networkDevices?.forEach((item) => {
          const networkName = item.networks.name
          const deviceVendor = item.devices[`${params}`]

          addNode(networkName, 'network', nodes)
          addNode(deviceVendor, 'device', nodes)

          links.push({
            source: networkName,
            target: deviceVendor,
            value: 1
          })
        })

        // Set the processed nodes and links to data
        this.nodes = nodes
        this.links = links
      } catch (e) {
        console.error(e)
        this.isLoading = true
      } finally {
        this.isLoading = false
      }
    },
    initChart() {
      const tempValue = this.value.select
      this.chart = echarts.init(this.$refs.chart)

      const getColor = (type) => {
        switch (type) {
          case 'region':
            return '#b3d4ff'
          case 'network':
            return '#00bfa0'
          case 'device':
            return '#dc0ab4'
          default:
            return '#ccc'
        }
      }

      const nodesWithColors = this.nodes.map((node) => ({
        ...node,
        itemStyle: { color: getColor(node.type) }
      }))

      const option = {
        tooltip: {
          trigger: 'item',
          triggerOn: 'mousemove',
          formatter: function (params) {
            if (params.dataType === 'node') {
              return `${params.name}`
            } else {
              return `${params.data.source} → ${params.data.target}: ${params.data.value}`
            }
          }
        },
        series: [
          {
            type: 'sankey',
            layoutIterations: 0,
            data: nodesWithColors,
            links: this.links,
            nodeAlign: 'left',
            nodeWidth: 15,
            nodeGap: 20,
            label: {
              show: true,
              formatter: function (params) {
                return tempValue === 'vendor' ? `${params.name}: ${params.value}` : params.name
              }
            },
            itemStyle: {
              borderWidth: 0
            },
            lineStyle: {
              color: 'source',
              curveness: 0.5
            }
          }
        ]
      }
      this.chart.setOption(option)
    },
    async onSelectSankey(value) {
      this.value.select = value
      if (this.chart) {
        this.chart.dispose()
        this.chart = null // Clean up the reference to the chart
      }
      await this.getSummary(value)
      if (this.nodes.length && this.links.length) this.initChart()
    }
  },
  async mounted() {
    await this.getSummary('vendor')
    if (this.nodes.length && this.links.length) this.initChart()
  },
  beforeUnmount() {
    if (this.chart) {
      this.chart.dispose()
      this.chart = null // Clean up the reference to the chart
    }
  }
}
</script>
