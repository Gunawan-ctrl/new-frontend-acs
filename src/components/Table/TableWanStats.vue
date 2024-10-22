<template>
  <main class="bg-white shadow-sm rounded-md">
    <SpinLoading :loading="isLoading" />
    <section class="px-4 py-3">
      <div>
        <h1 class="font-medium">Statistics Wan</h1>
      </div>
    </section>
    <section>
      <div class="px-4 py-2">
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
            :disabled="item.index == 1 ? true : false"
          />
        </a-tabs>
      </div>
    </section>
    <section>
      <div class="pb-4 h-[400px] overflow-y-auto">
        <div v-for="(title, i) in title" :key="i">
          <ul class="even:bg-slate-100" v-for="(item, j) in dataDetail" :key="j">
            <div
              v-if="i == j"
              class="flex flex-row items-center justify-between py-1.5 px-4 text-[13px]"
              :class="i == 0 && j == 0 ? 'hidden' : 'block'"
            >
              <li>{{ title }}</li>
              <li>{{ item }}</li>
            </div>
          </ul>
          <hr :class="i == 0 ? 'hidden' : 'block'" />
        </div>
      </div>
    </section>
  </main>
</template>

<script>
import { getDetailDeviceAcs } from '@/boot/hooks'
import mqttModule from '@/boot/mqtt'
import SpinLoading from '../Spin/SpinLoading.vue'
import { mapDataWanStats } from '@/boot/helper'

export default {
  components: { SpinLoading },
  data: () => ({
    idParams: null,
    tabData: [],
    activeKey: 1,
    dataDetail: null,
    dataMqtt: null,
    title: null,
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
        const temp = JSON.parse(res?.data[0]?.VirtualParameters?.WANStats?._value)
        const manufacturer = res.data[0]._deviceId._Manufacturer
        this.tabData = temp
        const dataObj = temp[1]
        const tempData = Object.values(dataObj)
        this.dataDetail = Object.assign({}, tempData)
        this.title = mapDataWanStats(dataObj, manufacturer)
      } catch (err) {
        console.log(err)
      } finally {
        this.isLoading = false
      }
    },
    async onTab(value) {
      this.activeKey = value
      try {
        this.isLoading = true
        const res = await getDetailDeviceAcs(this.idParams)
        const temp = JSON.parse(res.data[0].VirtualParameters.WANStats._value)
        this.tabData = temp
        const dataObj = temp[this.activeKey]
        const tempData = Object.values(dataObj)
        this.dataDetail = Object.assign({}, tempData)
      } catch (err) {
        console.log(err)
      } finally {
        this.isLoading = false
      }
    },
    handleMsg(topic, message) {
      try {
        const parseMsg = JSON.parse(message.toString())
        this.dataMqtt = parseMsg

        if (this.dataMqtt && this.dataMqtt[this.activeKey] != undefined) {
          const dataObj = this.dataMqtt[this.activeKey]
          const tempData = Object.values(dataObj)
          this.dataDetail = Object.assign({}, tempData)
        }
      } catch (err) {
        console.log(err)
      }
    },
    initMqtt() {
      mqttModule.createConnection(this.connection)
      this.subscription.topic = `acs/live/wan-stats/${this.idParams}`
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
