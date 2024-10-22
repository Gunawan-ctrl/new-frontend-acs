<template>
  <main class="bg-white rounded-md shadow-sm">
    <SpinLoading :loading="isLoading" />
    <section class="px-4 py-3">
      <div>
        <h1 class="font-medium">Wan Information</h1>
      </div>
    </section>
    <section class="px-4 py-2">
      <a-tabs
        size="small"
        class="capitalize text-xs font-medium"
        @change="onTab"
        :activeKey="activeKey"
      >
        <a-tab-pane
          force-render
          v-for="(item, i) in tabData"
          :key="i"
          :tab="item.index == '1' ? 'TR 069' : item.index == '2' ? 'Internet' : 'Voip'"
          :disabled="item.index == '1' ? true : false"
        />
      </a-tabs>
    </section>
    <section>
      <div class="pb-6 h-[400px] overflow-y-auto">
        <ul v-for="(item, i) in dataDetail" :key="i" class="even:bg-slate-100">
          <div class="flex flex-row justify-between items-center px-4 py-1.5 text-[13px]">
            <section id="title">
              <li class="capitalize" v-if="i == 'ConnectionStatus'">Connection Status</li>
              <li class="capitalize" v-if="i == 'ConnectionTrigger'">Connection Trigger</li>
              <li class="capitalize" v-if="i == 'ConnectionType'">Connection Type</li>
              <li class="capitalize" v-if="i == 'CurrentMRUSize'">Current MRU Size</li>
              <li class="capitalize" v-if="i == 'DNSServers'">DNS Server</li>
              <li class="capitalize" v-if="i == 'DefaultGateway'">Default Gateway</li>
              <li class="capitalize" v-if="i == 'ExternalIPAddress'">IP Address</li>
              <li class="capitalize" v-if="i == 'InterfaceMtu'">Interface MTU</li>
              <li class="capitalize" v-if="i == 'MACAddress'">MAC Address</li>
              <li class="capitalize" v-if="i == 'MaxMRUSize'">Maximum MRU Size</li>
              <li class="capitalize" v-if="i == 'Name'">Name</li>
              <li class="capitalize" v-if="i == 'PPPoEACName'">PPPoEC Name</li>
              <li class="capitalize" v-if="i == 'PPPoEServiceName'">PPPoE Service Name</li>
              <li class="capitalize" v-if="i == 'RemoteIPAddress'">Remote IP Address</li>
              <li class="capitalize" v-if="i == 'TransportType'">Transport Type</li>
              <li class="capitalize" v-if="i == 'SubnetMask'">Subnet Mask</li>
              <li class="capitalize" v-if="i == 'Uptime'">Up Time</li>
            </section>
            <section id="data">
              <a-badge
                :color="item == 'Connected' ? 'green' : 'red'"
                size="small"
                v-if="i == 'ConnectionStatus'"
                :text="item"
              />
              <li class="capitalize" v-if="i == 'ConnectionTrigger'">{{ item }}</li>
              <li class="capitalize" v-if="i == 'ConnectionType'">{{ item }}</li>
              <li class="capitalize" v-if="i == 'CurrentMRUSize'">{{ item }}</li>
              <li class="capitalize" v-if="i == 'DNSServers'">{{ item }}</li>
              <li class="capitalize" v-if="i == 'DefaultGateway'">{{ item }}</li>
              <li class="capitalize" v-if="i == 'ExternalIPAddress'">{{ item }}</li>
              <li class="capitalize" v-if="i == 'InterfaceMtu'">{{ item }}</li>
              <li class="capitalize" v-if="i == 'MACAddress'">{{ item }}</li>
              <li class="capitalize" v-if="i == 'MaxMRUSize'">{{ item }}</li>
              <li class="capitalize" v-if="i == 'Name'">{{ item }}</li>
              <li class="capitalize" v-if="i == 'PPPoEACName'">{{ item }}</li>
              <li class="capitalize" v-if="i == 'PPPoEServiceName'">{{ item }}</li>
              <li class="capitalize" v-if="i == 'RemoteIPAddress'">{{ item }}</li>
              <li class="capitalize" v-if="i == 'TransportType'">{{ item }}</li>
              <li class="capitalize" v-if="i == 'SubnetMask'">{{ item }}</li>
              <li class="capitalize" v-if="i == 'Uptime'">{{ upTime }}</li>
            </section>
          </div>
          <hr :hidden="i === 'index'" />
        </ul>
      </div>
    </section>
  </main>
</template>

<script>
import { getDetailDeviceAcs } from '@/boot/hooks'
import { convertTime } from '@/boot/helper'
import mqttModule from '@/boot/mqtt'
import SpinLoading from '../Spin/SpinLoading.vue'

export default {
  components: { SpinLoading },
  data: () => ({
    isLoading: false,
    tabData: [],
    dnsSplit: null,
    dataDetail: {},
    dataMqtt: [],
    idParams: null,
    activeKey: 1,
    upTime: null,
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
      topic: null,
      qos: 0
    }
  }),
  methods: {
    async getData() {
      this.idParams = this.$route.params.id
      try {
        this.isLoading = true
        const res = await getDetailDeviceAcs(this.idParams)
        const dataTemp = JSON.parse(res.data[0].VirtualParameters.WANInformation._value)
        this.dataDetail = dataTemp[1]
        this.dnsSplit = this.dataDetail.DNSServers.split(',')
        this.tabData = dataTemp
        this.upTime = convertTime(this.dataDetail.Uptime * 100000)
      } catch (err) {
        console.log(err)
      } finally {
        this.isLoading = false
      }
    },
    async onTab(value) {
      console.log(value)
      this.activeKey = value
      try {
        this.isLoading = true
        const res = await getDetailDeviceAcs(this.idParams)
        const dataTemp = JSON.parse(res.data[0].VirtualParameters.WANInformation._value)
        this.dataDetail = dataTemp[this.activeKey]
      } catch (err) {
        console.log(err)
      } finally {
        this.isLoading = false
      }
    },
    handleMsg(topic, message) {
      try {
        const parseMSg = JSON.parse(message.toString())
        this.dataMqtt = parseMSg
        if (this.dataMqtt && this.dataMqtt[this.activeKey] != undefined) {
          this.dataDetail = this.dataMqtt[this.activeKey]
          this.upTime = convertTime(this.dataDetail.Uptime)
        }
      } catch (e) {
        console.log(e)
      }
    },
    initMqtt() {
      mqttModule.createConnection(this.connection)
      this.subscription.topic = `acs/live/wan-information/${this.idParams}`
      mqttModule.doSubcribe(this.subscription)
      mqttModule.client.on('message', this.handleMsg)
    }
  },
  beforeUnmount() {
    try {
      if (mqttModule.client) {
        if (mqttModule.client.connected) {
          mqttModule.doUnsubcribe(this.subscription)
        }
        mqttModule.destroyConnection()
      }
    } catch (e) {
      console.error('error durin unmount', e)
    }
  },
  mounted() {
    this.initMqtt()
    this.getData()
  },
  watch: {
    '$route.params.id': {
      immediate: true,
      handler() {
        this.initMqtt()
        this.getData()
      }
    }
  }
}
</script>
