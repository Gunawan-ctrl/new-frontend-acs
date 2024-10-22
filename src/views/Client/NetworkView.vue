<template>
  <main class="w-full min-h-screen p-4">
    <SpinLoading :loading="isLoading" />
    <div class="flex flex-col gap-y-4">
      <section>
        <div class="flex flex-row gap-4 flex-wrap sm:flex-nowrap">
          <div :class="array.device?.length <= 1 ? 'w-full' : 'sm:w-1/3 w-full'">
            <WidgetCarousel
              :title="'devices'"
              :data="array.device"
              :count="pagination.totalDevice"
            />
          </div>
          <div
            :class="array.network?.length <= 1 ? 'w-full' : 'sm:w-1/3 w-full'"
            v-if="localData.role_name === 'customer'"
          >
            <WidgetCarousel :title="'networks'" :data="array.network" :count="count.network" />
          </div>
          <div class="w-full">
            <WidgetStat
              :onlineCount="count.online"
              :offlineCount="count.offline"
              :alertCount="count.alert"
              @onOnline="onOnline"
              @onOffline="onOffline"
              @onAlert="onAlert"
            />
          </div>
        </div>
      </section>

      <section>
        <div class="bg-white min-h-screen shadow-sm px-4 py-3 rounded-md">
          <div class="py-4 flex flex-row justify-between flex-wrap sm:flex-nowrap">
            <h1 class="font-bold">List Devices</h1>
            <a-button
              size="small"
              type="primary"
              danger
              class="capitalize"
              :hidden="isFilter == false"
              @click="onClearFilter"
            >
              clear filter
            </a-button>
          </div>
          <TableDeviceClient
            :columns="column"
            :data="array.deviceNetwork"
            :totalItem="pagination.totalDevice"
            :currPage="pagination.currPageDevice"
            :pageSize="pagination.limitDevice"
            @onPage="onPageDevice"
            @onLimitSelect="onLimitSelect"
            @onSubmitTag="onSubmitTag"
            @onDetail="onDetail"
          />
        </div>
      </section>
    </div>
  </main>
</template>

<script>
import WidgetCarousel from '@/components/Widget/WidgetCarousel.vue'
import WidgetStat from '@/components/Widget/WidgetStat.vue'
import { getDetailDeviceNetworks, getDetailNetwork, getMe } from '@/boot/hooks'
import SpinLoading from '@/components/Spin/SpinLoading.vue'
import TableDeviceClient from '@/components/Table/TableDeviceClient.vue'
import mqttModule from '@/boot/mqtt'

export default {
  components: {
    WidgetCarousel,
    WidgetStat,
    SpinLoading,
    TableDeviceClient
  },
  data() {
    return {
      localData: JSON.parse(localStorage.getItem('dataUser')),
      codeNet: null,
      isFilter: false,
      count: {
        online: 0,
        offline: 0,
        alert: 0,
        device: 0,
        network: 0
      },
      array: {
        device: [],
        network: [],
        deviceNetwork: [],
        inform: []
      },
      isLoading: false,
      pagination: {
        limitDevice: 20,
        totalDevice: 0,
        currPageDevice: 1,
        limitMe: 100
      },
      column: [
        // { title: '', dataIndex: 'index', key: 'index', width: 30, class: 'index' },
        { title: '', dataIndex: 'dot', key: 'dot', width: 30 },
        { title: 'Status', dataIndex: 'status', key: 'status' },
        { title: 'Serial Number', dataIndex: 'serialNumber', key: 'serialNumber' },
        { title: 'Manufacturer', dataIndex: 'manufacturer', key: 'manufacturer' },
        { title: 'Product Class', dataIndex: 'productClass', key: 'productClass' },
        { title: 'Software Version', dataIndex: 'softwareVersion', key: 'softwareVersion' },
        { title: 'Tags', dataIndex: 'tags', key: 'tags' },
        { title: 'Rx Power', dataIndex: 'rxPower', key: 'rxPower' },
        { title: 'Ip Address', dataIndex: 'ipAddr', key: 'ipAddr' }
      ],
      connection: {
        protocol: import.meta.env.VITE_APP_BROKER_PROTOCOL,
        host: import.meta.env.VITE_APP_BROKER_HOST,
        port: import.meta.env.VITE_APP_BROKER_PORT,
        endpoint: '',
        clean: true,
        connectTimeout: import.meta.env.VITE_APP_BROKER_TIMEOUT, // ms
        reconnectPeriod: import.meta.env.VITE_APP_BROKER_TIMEOUT, // ms
        clientId: 'emqx_vue_' + Math.random().toString(16).substring(2, 8),
        username: import.meta.env.VITE_APP_BROKER_USRNAME,
        password: import.meta.env.VITE_APP_BROKER_PASSWORD
      },
      subscription: {
        topic: '', // Updated to a string for simplicity
        qos: 0
      }
    }
  },
  methods: {
    initMqtt() {
      mqttModule.createConnection(this.connection)
      mqttModule.doSubcribe(this.subscription)
      mqttModule.client.on('message', this.handleMsg)
    },
    handleMsg(topic, message) {
      const currentTime = Math.floor(Date.now() / 1000)
      try {
        const parseMsg = JSON.parse(message.toString())
        this.array.inform = parseMsg

        if (this.array.inform && this.array.deviceNetwork?.length > 0) {
          let combined = this.array.deviceNetwork.map((device) => {
            const inform = this.array.inform.find(
              (info) => info.SerialNumber === device.serial_number
            )
            if (inform) {
              return {
                ...device,
                LastInform: inform.LastInform,
                RXPower: parseFloat(inform.RXPower).toFixed(2),
                ip_address: inform.IPAddress || device.ip_address
              }
            }
            return device
          })

          this.array.deviceNetwork = combined.map((device) => {
            const isOnline = currentTime - device.LastInform
            return {
              ...device,
              status:
                isOnline <= 180
                  ? 'online'
                  : isOnline <= 3600
                    ? 'past 1 hour ago'
                    : isOnline <= 86400
                      ? 'past 1 day ago'
                      : 'offline'
            }
          })
          this.count = {
            online: this.array.deviceNetwork.filter((device) => device.status === 'online').length,
            offline: this.array.deviceNetwork.filter(
              (device) => device.status.includes('offline') || device.status.includes('past')
            ).length,
            alert: this.array.deviceNetwork.filter(
              (device) =>
                !device.RXPower ||
                parseFloat(device.RXPower) <= -25 ||
                device.RXPower === '' ||
                device.RXPower === '' ||
                isNaN(device.RXPower)
            ).length
          }
        }
      } catch (e) {
        console.error('Error processing MQTT message:', e)
      }
    },
    async onDetail(id) {
      if (this.localData.role_name === 'super admin') this.$router.push(`/super-admin/device/${id}`)
      else if (this.localData.role_name === 'admin') this.$router.push(`/admin/device/${id}`)
      else if (this.localData.role_name === 'monitoring') this.$router.push(`/monitor/device/${id}`)
      else if (this.localData.role_name === 'customer') this.$router.push(`/device/${id}`)
    },
    async getNetwork() {
      try {
        this.isLoading = true
        await getMe(this.pagination.limitMe).then((res) => {
          let tempNet = []
          if (res.data.data.networks) {
            res.data.data.networks.map((item) => {
              item.networks?.map((net) => {
                tempNet.push({
                  name: net.name
                })
              })
            })
          }
          this.count.network = res.data.data.networks?.length || 0
          this.array.network = tempNet
        })
      } catch (err) {
        console.error('Error fetching network data:', err)
      } finally {
        this.isLoading = false
      }
    },
    async getDeviceNetwork() {
      this.isLoading = true
      await getDetailDeviceNetworks(
        this.$route.params.id,
        this.pagination.currPageDevice,
        this.pagination.limitDevice
      )
        .then((res) => {
          this.array.deviceNetwork = res.data.data.devices
          if (this.pagination.currPageDevice === 1)
            this.pagination.totalDevice = res.data.meta.count
          this.array.device = [...new Set(res.data.data.devices?.map((device) => device.vendor))]
        })
        .catch((err) => {
          this.isLoading = false
          console.log(err)
        })
        .finally(() => (this.isLoading = false))
    },
    onLimitSelect(value) {
      this.pagination.limitDevice = value
      this.pagination.currPageDevice = 1
      this.getDeviceNetwork()
    },
    onPageDevice(value) {
      this.pagination.currPageDevice = value
      this.getDeviceNetwork()
    },
    onSubmitTag() {
      this.getNetwork()
    },
    async getDetailNet() {
      await this.unSubscribeTopic()
      const res = await getDetailNetwork(this.$route.params.id)
      this.subscription.topic = `acs/live/last-inform/${res.data.data.networks[0].code}`
      if (this.subscription.topic) {
        this.initMqtt()
      }
    },
    async unSubscribeTopic() {
      try {
        if (mqttModule.client?.connected) {
          mqttModule.doUnsubcribe(this.subscription)
        }
        mqttModule.destroyConnection()
      } catch (e) {
        console.error('Error during unsubscribe', e)
      }
    },
    onOnline() {
      this.isFilter = true
      this.array.deviceNetwork = this.array.deviceNetwork.filter(
        (device) => device.status === 'online'
      )
    },
    async onOffline() {
      this.isFilter = true
      if (this.isFilter == true) {
        this.array.deviceNetwork = this.array.deviceNetwork.filter(
          (device) => device.status?.includes('offline') || device.status?.includes('past')
        )
      }
    },
    onAlert() {
      this.isFilter = true
      this.array.deviceNetwork = this.array.deviceNetwork.filter(
        (device) =>
          !device.RXPower ||
          parseFloat(device.RXPower) <= -25 ||
          device.RXPower === '' ||
          device.RXPower === '' ||
          isNaN(device.RXPower)
      )
    },
    async onClearFilter() {
      this.isFilter = false
      this.getDeviceNetwork()
    }
  },
  async mounted() {
    if (this.subscription.topic) {
      this.initMqtt()
    }
  },
  watch: {
    '$route.params.id': {
      immediate: true,
      handler() {
        this.getNetwork()
        this.getDeviceNetwork()
        this.count = {
          offline: 0,
          online: 0,
          alert: 0
        }
        this.getDetailNet()
      }
    }
  }
}
</script>
