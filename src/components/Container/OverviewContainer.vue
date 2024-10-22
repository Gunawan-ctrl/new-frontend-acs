<template>
  <main class="flex flex-col gap-y-3 pb-8">
    <SpinLoading :loading="isLoading" />
    <section>
      <div class="flex flex-row sm:flex-nowrap flex-wrap gap-3">
        <div class="w-full">
          <DeviceInformation />
        </div>
        <div class="w-full">
          <OpticInformation />
        </div>
      </div>
    </section>
    <section>
      <div class="bg-white px-4 py-3 rounded-md shadow-sm">
        <div class="flex flex-row items-center justify-between">
          <div class="flex flex-row items-center gap-x-3 pb-1.5">
            <h1 class="capitalize font-medium">wifi analyzer</h1>
            <a-button @click="onAnalyze" size="small" type="link">
              <font-awesome-icon :icon="isShowCHart == true ? 'list' : 'chart-line'" />
            </a-button>
          </div>
          <a-popconfirm
            placement="topRight"
            ok-text="Yes"
            cancel-text="No"
            :open="isScan"
            @confirm="onSummon"
            @cancel="onCancel"
          >
            <template #title>
              <div class="text-xs flex flex-col gap-1">
                <p>Are you sure you want to scan neighboring access points?</p>
                <p class="font-medium text-red-700">
                  This may cause a temporary disruption to the WiFi.
                </p>
              </div>
            </template>
            <a-button
              @click="onConfirmSummon"
              type="primary"
              size="small"
              :hidden="isShowCHart == true"
            >
              <font-awesome-icon icon="rotate-right" size="xs" />
            </a-button>
          </a-popconfirm>
        </div>
        <div class="py-1">
          <a-radio-group
            @change="onBandwidth(frequency)"
            v-model:value="frequency"
            button-style="solid"
            size="small"
          >
            <a-radio-button value="2.4GHz">2.4 GHz</a-radio-button>
            <a-radio-button value="5GHz">5 GHz</a-radio-button>
          </a-radio-group>
        </div>
        <div>
          <TableNeighbour
            :columns="column"
            :data="frequency === '5GHz' ? arrayNeighbourB : arrayNeighbourA"
            :class="isShowCHart ? 'hidden' : 'block'"
          />
          <WifiAnalizeChart :isShowCHart="isShowCHart && frequency === '2.4GHz'" />
          <WiFiAnalizeChart5Ghz :isShowCHart="isShowCHart && frequency === '5GHz'" />
        </div>
      </div>
    </section>
    <section>
      <TableHost :columns="titleHost" :data="arrayHost" />
    </section>
  </main>
</template>
<script>
import { getDetailDeviceAcs, taskGenie } from '@/boot/hooks'
import DeviceInformation from '../Card/DeviceInformation.vue'
import OpticInformation from '../Card/OpticInformation.vue'
import TableNeighbour from '../Table/TableNeighbour.vue'
import { mapColumnNeighbour } from '@/boot/helper'
import WifiAnalizeChart from '../Chart/WifiAnalizeChart.vue'
import TableHost from '../Table/TableHost.vue'
import SpinLoading from '../Spin/SpinLoading.vue'
import { notification } from 'ant-design-vue'
import { ParamsDiagnosticsState } from '@/boot/parameters'
import WiFiAnalizeChart5Ghz from '../Chart/WiFiAnalizeChart5Ghz.vue'

export default {
  components: {
    DeviceInformation,
    OpticInformation,
    TableNeighbour,
    WifiAnalizeChart,
    TableHost,
    SpinLoading,
    WiFiAnalizeChart5Ghz
  },
  data: () => ({
    isScan: false,
    isLoading: false,
    idParams: null,
    idDevice: null,
    isShowCHart: false,
    frequency: '2.4GHz',
    column: [],
    arrayNeighbourA: [],
    arrayNeighbourB: [],
    arrayHost: [],
    titleHost: [
      { title: 'Host Name', dataIndex: 'hostName', key: 'hostName' },
      { title: 'IP Address', dataIndex: 'ipAddr', key: 'ipAddr' },
      { title: 'Mac Address', dataIndex: 'macAddr', key: 'macAddr' }
    ]
  }),
  methods: {
    async onAnalyze() {
      this.isShowCHart = !this.isShowCHart
    },
    async getData() {
      this.idParams = this.$route.params.id
      try {
        this.isLoading = true
        const res = await getDetailDeviceAcs(this.idParams)

        this.idDevice = res.data[0]._id
        const tempData = res.data[0]
        const manufacturerName = tempData?._deviceId?._Manufacturer
        const neighbourParse = JSON?.parse(
          tempData?.VirtualParameters?.WLANNeighborAllFiltered?._value
        )
        const hostParse = JSON.parse(tempData?.VirtualParameters?.HostAll?._value)
        this.arrayHost = hostParse
        this.arrayNeighbourA = neighbourParse.filter(
          (item) => parseInt(item.Channel) >= 1 && parseInt(item.Channel) <= 13
        )
        this.arrayNeighbourB = neighbourParse.filter((item) => parseInt(item?.Channel) >= 13)

        const tempCol = this.arrayNeighbourA[0] ? this.arrayNeighbourA[0] : this.arrayNeighbourB[0]
        const keyColumn = Object.keys(tempCol)

        this.column = mapColumnNeighbour(manufacturerName, keyColumn)
      } catch (err) {
        console.log(err)
      } finally {
        this.isLoading = false
      }
    },
    onBandwidth(value) {
      if (value == '2.4Ghz') {
        this.getData()
      } else {
        this.getData()
      }
    },
    async onSummon() {
      let duration = 3
      const form = JSON.stringify({
        name: 'setParameterValues',
        parameterValues: [ParamsDiagnosticsState('Requested')]
      })
      this.isScan = false
      const notificationKey = 'wifiScan'

      // Menampilkan notifikasi
      notification.warn({
        key: notificationKey,
        message: 'Scanning Neighboring WiFi',
        description: `Please wait... `,
        duration: 0 // Notifikasi tidak auto-close
      })

      try {
        // Memulai task dengan taskGenie
        const res = await taskGenie(this.idDevice, form)

        // Cek jika respons berhasil
        if (res.status === 200 || res.statusText === 'OK') {
          let resDiagnostic = null
          for (let i = 0; i < duration; i++) {
            await taskGenie(
              this.idDevice,
              '{"name": "getParameterValues", "parameterNames": ["InternetGatewayDevice.X_ALU-COM_NeighboringWiFiDiagnostic.DiagnosticsState"]}'
            )
            await getDetailDeviceAcs(this.idParams).then((res) => {
              resDiagnostic =
                res.data[0].InternetGatewayDevice['X_ALU-COM_NeighboringWiFiDiagnostic']
                  .DiagnosticsState._value
            })
            if (resDiagnostic === 'Completed') {
              break
            }
            await new Promise((resolve) => setTimeout(resolve, 2000))
          }

          // Tutup notifikasi dan tampilkan sukses
          notification.close(notificationKey)
          notification.success({
            message: resDiagnostic,
            description: 'Neighboring WiFi scan is complete!'
          })
        } else {
          throw new Error(res.message || 'Unknown error')
        }
      } catch (error) {
        // Tangani jika gagal dan tampilkan error
        notification.close(notificationKey)
        notification.error({
          message: 'Scan Failed',
          description: error.message
        })
      } finally {
        // Dapatkan data baru setelah proses selesai
        await this.getData()
      }
    },
    onConfirmSummon() {
      this.isScan = true
    },
    onCancel() {
      this.isScan = false
    }
  },
  mounted() {
    this.getData()
  },
  watch: {
    '$route.params.id': {
      immediate: false,
      handler() {
        this.getData()
        this.isShowCHart = false
      }
    }
  }
}
</script>
