<template>
  <main>
    <SpinLoading :loading="isLoading" />
    <section>
      <div>
        <TabPanel @onTab="onTab" :tabProps="tabData" />
      </div>
    </section>
    <section>
      <div class="bg-white shadow-sm px-4 py-1 pb-4">
        <h1>
          Status:
          <span>
            <a-tag size="small" :color="data?.Status == 'Up' ? 'green' : 'red'">{{
              data?.Status
            }}</a-tag>
          </span>
        </h1>
        <h1>Duplex Mode: {{ data?.DuplexMode }}</h1>
      </div>
    </section>
    <hr />
    <section>
      <div class="bg-white shadow-sm rounded-b-md pt-1 pb-2 max-h-[300px] overflow-y-auto">
        <ul class="even:bg-slate-100" v-for="(item, i) in stats" :key="i">
          <div class="flex flex-row justify-between items-center px-4 py-1.5 text-[13px]">
            <section id="title">
              <li>{{ i }}</li>
            </section>
            <section id="data">
              <li>{{ item }}</li>
            </section>
          </div>
          <hr />
        </ul>
      </div>
    </section>
  </main>
</template>
<script>
import { getDetailDeviceAcs } from '@/boot/hooks'
import TabPanel from '../Tab/TabPanel.vue'
import mqttModule from '@/boot/mqtt'
import SpinLoading from '../Spin/SpinLoading.vue'

export default {
  components: { TabPanel, SpinLoading },
  data: () => ({
    isLoading: false,
    idParams: null,
    titleData: [
      { name: 'Broadcast Packets Recived' },
      { name: 'Broadcast Packets Sent' },
      { name: 'Bytes Recived' },
      { name: 'Bytes Sent' },
      { name: 'Discard Packet Recived' },
      { name: 'Discard Packet Sent' },
      { name: 'Error Sent' },
      { name: 'Error Recived' },
      { name: 'Multicast Packets Received' },
      { name: 'Multicast Packets Sent' },
      { name: 'Packets Recived' },
      { name: 'Packets Sent' },
      { name: 'Unicast Packet Recived' },
      { name: 'Unicast Packet Sent' },
      { name: 'Unknown Proto Packet Recived' }
    ],
    tabData: [{ name: 'LAN 1' }, { name: 'LAN 2' }, { name: 'LAN 3' }, { name: 'LAN 4' }],
    data: {},
    dataMqtt: {},
    stats: null,
    tabPanelValue: 'LAN 1',
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
        const dataTemp = JSON.parse(res.data[0].VirtualParameters.LANAll._value)
        this.data = dataTemp[this.tabPanelValue]
        this.stats = this.data.Stats

        if (this.dataMqtt && this.dataMqtt[this.tabPanelValue] !== undefined) {
          this.data = this.dataMqtt[this.tabPanelValue]
          this.stats = this.data?.Stats
        }
      } catch (err) {
        console.log(err)
      } finally {
        this.isLoading = false
      }
    },
    async onTab(value) {
      this.tabPanelValue = value
      try {
        this.isLoading = true

        const res = await getDetailDeviceAcs(this.idParams)
        const dataTemp = JSON.parse(res.data[0].VirtualParameters.LANAll._value)
        this.data = dataTemp[this.tabPanelValue]
        this.stats = this.data.Stats

        if (this.dataMqtt && this.dataMqtt[this.tabPanelValue] !== undefined) {
          this.data = this.dataMqtt[this.tabPanelValue]
          this.stats = this.data?.Stats
        }
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
      } catch (e) {
        console.log(e)
      }
    },
    initMqtt() {
      mqttModule.createConnection(this.connection)
      this.subscription.topic = `acs/live/lan/${this.idParams}`
      mqttModule.doSubcribe(this.subscription)
      mqttModule.client.on('message', this.handleMsg)
    }
  },
  mounted() {
    this.initMqtt()
    this.getData()
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
