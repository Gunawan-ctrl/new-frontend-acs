<template>
  <main class="shadow-sm bg-white rounded-md h-60">
    <section>
      <div class="px-4 py-2">
        <h1 class="font-medium">Optic Information</h1>
      </div>
    </section>
    <section>
      <div v-for="(data, i) in data" :key="i">
        <ul v-for="(title, j) in titleData" :key="j" class="even:bg-slate-100">
          <div v-if="i == j" class="flex flex-row justify-between px-5 py-1.5 text-[13px]">
            <li>{{ title }}</li>
            <li>{{ data }}</li>
          </div>
        </ul>
        <hr />
      </div>
    </section>
  </main>
</template>

<script>
import { getDetailDeviceAcs } from '@/boot/hooks'
import mqttModule from '@/boot/mqtt'
export default {
  data: () => ({
    idParams: null,
    titleData: [
      'Status',
      'Rx Power',
      'Tx Power',
      'Bias Current',
      'Optics Module Voltage',
      'Optic Module Temperature'
    ],
    data: [],
    dataMqtt: [],
    statusOptic: null,
    rxPower: null,
    txpower: null,
    biasCurr: null,
    opticVoltage: null,
    temperatur: null,
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
        this.dataMqtt = parseMsg
        this.data = [
          (this.statusOptic = this.dataMqtt.status),
          (this.rxPower = this.dataMqtt.rxpower),
          (this.txpower = this.dataMqtt.txpower),
          (this.biasCurr = this.dataMqtt.bias),
          (this.opticVoltage = this.dataMqtt.voltage),
          (this.temperatur = this.dataMqtt.temperature)
        ]
      } catch (e) {
        console.log(e)
      }
    },
    initMqtt() {
      mqttModule.createConnection(this.connection)
      this.subscription.topic = `acs/live/optic/${this.$route.params.id}`
      mqttModule.doSubcribe(this.subscription)
      mqttModule.client.on('message', this.handleMsg)
    },
    async getData() {
      this.idParams = this.$route.params.id
      const res = await getDetailDeviceAcs(this.idParams)
      const dataDetail = JSON.parse(res.data[0].VirtualParameters.OpticAll._value)

      this.data = [
        (this.statusOptic = dataDetail.status),
        (this.rxPower = dataDetail.rxpower),
        (this.txpower = dataDetail.txpower),
        (this.biasCurr = dataDetail.bias),
        (this.opticVoltage = dataDetail.voltage),
        (this.temperatur = dataDetail.temperature)
      ]
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
