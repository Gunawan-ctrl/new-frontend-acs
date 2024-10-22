<template>
  <main class="bg-white px-4 py-3 shadow-sm rounded-b-md">
    <section>
      <div class="pb-2">
        <div class="flex flex-row items-center justify-between">
          <p class="uppercase text-xs font-medium">
            {{ manufacturer === 'ALCL' ? 'nokia' : manufacturer }}
          </p>
          <a-tag :color="deviceStatus === 'online' ? 'green' : 'red'" class="uppercase">{{
            deviceStatus
          }}</a-tag>
        </div>
        <p class="text-gray-500 text-xs">{{ serialNumb }}</p>
        <div class="flex flex-row items-center gap-x-2">
          <p class="text-gray-500 text-xs">last update: {{ informDate }}</p>
          <div class="flex flex-row items-center gap-x-1">
            <p class="text-xs text-gray-500">
              {{ tagInform }}
            </p>
            <div
              class="rounded-full w-2 h-2"
              :class="tagInform === 'online' ? 'bg-green-500' : 'bg-orange-500'"
            ></div>
          </div>
        </div>
      </div>
    </section>
    <section>
      <div class="flex flex-row gap-3 items-center">
        <div class="bg-[#EBEBEB] p-1 pb-5 rounded-sm">
          <div class="flex flex-row gap-x-1 items-center">
            <a-tooltip
              v-for="(gpon, i) in wanData"
              :key="i"
              color="white"
              class="bg-[#D7D7D9] rounded-sm p-0.5 h-7 cursor-pointer"
            >
              <template #title>
                <div class="text-black">
                  <a-tag :color="color.statusGpon">{{ gpon.status }}</a-tag>
                  <p class="px-1.5">Rx Power: {{ gpon.rxpower }}</p>
                  <p class="px-1.5">Quality: {{ gpon.fiber }}</p>
                </div>
              </template>
              <div>
                <IconGPON
                  :colorBox="gpon.status !== 'up' ? '#67B346' : '#3D3E40'"
                  :colorCircle="
                    gpon.fiber == 'over'
                      ? '#77E4C8'
                      : gpon.fiber == 'good'
                        ? '#2B7A0B'
                        : gpon.fiber == 'ok'
                          ? '#9BEC00'
                          : gpon.fiber == 'warning'
                            ? '#FFB332'
                            : gpon.fiber == 'bad'
                              ? '#FF7F3E'
                              : 'red'
                  "
                />
                <small class="text-center items-center uppercase text-[#3D3E40]">
                  {{ gpon.type == 'GPON' ? `${gpon.type}  ${i + 1}` : `EPON ${i + 1}` }}
                </small>
              </div>
            </a-tooltip>
            <a-divider type="vertical" />
            <a-tooltip
              v-for="(eth, i) in lanData"
              :key="i"
              color="white"
              class="bg-[#D7D7D9] rounded-sm p-0.5 h-6 cursor-pointer"
            >
              <template #title>
                <section class="text-black">
                  <div class="flex flex-row gap-x-3 justify-between">
                    <a-tag :color="eth.status == 'NoLink' ? 'red' : 'green'">{{
                      eth.status
                    }}</a-tag>
                  </div>
                  <div class="px-1.5 flex flex-row gap-x-3 justify-between">
                    <p>Duplex Mode</p>
                    <p>{{ eth.mode }}</p>
                  </div>
                </section>
              </template>
              <div class="bg-[#D7D7D9] rounded-sm p-0.5 h-[33px]">
                <IconPortEthernet
                  :class="'rotate-180'"
                  :colorPortEth="eth.status !== 'NoLink' ? '#67B346' : '#3D3E40'"
                />
                <small class="text-center items-center uppercase text-xs text-[#3D3E40]">
                  {{ eth.name ? `LAN ${i + 1}` : '' }}
                </small>
              </div>
            </a-tooltip>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script>
import IconPortEthernet from '../Icon/IconPortEthernet.vue'
import IconGPON from '../Icon/IconGPON.vue'
import { getDetailDeviceAcs } from '@/boot/hooks'
import mqttModule from '@/boot/mqtt'
import { convertTime, informMinutes, objectToArray } from '@/boot/helper'

export default {
  components: {
    IconPortEthernet,
    IconGPON
  },
  props: { isLoading: Boolean },
  data: () => ({
    idDevice: null,
    lanData: [],
    wanData: [],
    serialNumb: null,
    manufacturer: null,
    informDate: null,
    tagInform: null,
    color: {
      statusGpon: 'green',
      fiber: '#2B7A0B'
    },
    deviceStatus: 'online', // Add a status property for the device
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
    handleMsg(topic, message) {
      try {
        const parseMsg = JSON.parse(message.toString())

        const resLan = parseMsg.lan_data
        const resWan = parseMsg.wan_data
        this.lanData = []
        this.wanData = []
        objectToArray(resLan, this.lanData)
        objectToArray(resWan, this.wanData)

        this.informDate = convertTime(parseMsg.inform)
        this.tagInform = informMinutes(parseMsg.inform)

        const currentTime = Math.floor(Date.now())
        const diffTime = currentTime - parseMsg.inform
        if (diffTime <= 180000) {
          this.deviceStatus = 'online'
          parseMsg.wan_data['GPON 1'].status = 'UP'
          this.color.statusGpon = 'green'
        } else {
          this.deviceStatus = 'offline'
          parseMsg.wan_data['GPON 1'].status = 'DOWN'
          this.color.statusGpon = 'red'
        }
      } catch (e) {
        console.log(e)
      }
    },

    initMqtt() {
      mqttModule.createConnection(this.connection)
      this.subscription.topic = `acs/live/interface/${this.$route.params.id}`
      mqttModule.doSubcribe(this.subscription)
      mqttModule.client.on('message', this.handleMsg)
    },
    async getData() {
      try {
        const res = await getDetailDeviceAcs(this.$route.params.id)
        const parseRes = JSON.parse(res.data[0].VirtualParameters.InterfaceAll._value)
        const resLan = parseRes.lan_data
        const resWan = parseRes.wan_data
        this.manufacturer = res.data[0]._deviceId._Manufacturer
        this.idDevice = res.data[0]._id

        this.informDate = convertTime(parseRes.inform)
        this.tagInform = informMinutes(parseRes.inform)
        this.serialNumb = res.data[0]._deviceId._SerialNumber

        objectToArray(resLan, this.lanData)
        objectToArray(resWan, this.wanData)
      } catch (e) {
        console.log(e)
      }
    },
    onGetData(idDevice) {
      this.$emit('onGetData', idDevice)
    }
  },
  mounted() {
    this.initMqtt()
  },
  beforeUnmount() {
    try {
      mqttModule.destroyConnection()
    } catch (e) {
      console.error('Error during unmount', e)
    }
  },
  watch: {
    '$route.params.id': {
      immediate: true,
      handler() {
        this.wanData = []
        this.lanData = []
        this.getData()
      }
    }
  }
}
</script>
