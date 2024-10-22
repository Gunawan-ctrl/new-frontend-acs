<template>
  <main class="w-full min-h-screen p-4">
    <SpinLoading :loading="isLoading" />
    <div class="flex flex-col gap-y-4">
      <section id="widget-count">
        <div class="flex flex-row gap-4 flex-wrap lg:flex-nowrap">
          <div class="lg:w-1/2 w-full" v-if="data.local.role_name === 'super admin'">
            <WidgetCustomers
              :countAdmin="userStore.count.admin"
              :countCustomer="userStore.count.customer"
              :countMonitoring="userStore.count.monitoring"
              :countSU="userStore.count.superAdmin"
            />
          </div>
          <div class="w-full flex flex-row gap-2 flex-wrap lg:flex-nowrap md:flex-nowrap">
            <div class="lg:w-2/3 w-full">
              <WidgetCard
                :title="'DEVICES'"
                :desc="'Information about the device registered to the customer.'"
                :classHeader="'bg-lightBlue-2'"
                :bgClass="'bg-[radial-gradient(ellipse_at_left,_var(--tw-gradient-stops))] from-cyan-300 via-blue-500 to-blue-800'"
                :value="deviceStore.count.device"
                :icon="'https://cdn-icons-png.flaticon.com/512/16920/16920026.png'"
              />
            </div>
            <div class="lg:w-2/3 w-full">
              <WidgetCard
                :title="'REGIONS'"
                :desc="'Regions registered in the system.'"
                :classHeader="'bg-lightGreen-2'"
                :bgClass="'bg-[radial-gradient(ellipse_at_left,_var(--tw-gradient-stops))] from-yellow-200 via-lime-500 to-green-800'"
                :value="deviceStore.count.network"
                :icon="'https://cdn-icons-png.flaticon.com/512/2655/2655797.png'"
              />
            </div>
            <div class="lg:w-2/3 w-full">
              <WidgetCard
                :title="'ALERTS'"
                :desc="'The device may be experiencing an issue or malfunction.'"
                :bgClass="'bg-[radial-gradient(ellipse_at_left,_var(--tw-gradient-stops))] from-amber-200 via-yellow-600 to-orange-600'"
                :classHeader="'bg-lightOrange-2'"
                :value="count.alert"
                :icon="'/icons/alert.png'"
              />
            </div>
          </div>
        </div>
      </section>
      <section>
        <SankeyChart />
      </section>
    </div>
  </main>
</template>

<script>
import WidgetCard from '@/components/Widget/WidgetCard.vue'
// import { getDevice, getNetwork, getUser, getUserRole } from '@/boot/hooks'
import SpinLoading from '@/components/Spin/SpinLoading.vue'
import SankeyChart from '@/components/Chart/SankeyChart.vue'
import mqttModule from '@/boot/mqtt'
import WidgetCustomers from '@/components/Widget/WidgetCustomers.vue'
// Store pinia
import { useUserStore } from '@/stores/user/userStore'
import { useDeviceStore } from '@/stores/device/deviceStore'

export default {
  components: { WidgetCard, SpinLoading, SankeyChart, WidgetCustomers },
  data: () => ({
    userStore: useUserStore(),
    deviceStore: useDeviceStore(),
    isLoading: false,
    count: {
      // admin: this.userStore.count.admin,
      // monitoring: 0,
      // superAdmin: 0,
      // customer: 0,
      // device: 0,
      // network: 0,
      alert: 0
    },
    data: {
      nodes: [],
      links: [],
      local: JSON.parse(localStorage.getItem('dataUser'))
    },
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
      topic: 'acs/live/last-inform/all', // Updated to a string for simplicity
      qos: 0
    }
  }),
  methods: {
    initMqtt() {
      mqttModule.createConnection(this.connection)
      mqttModule.doSubcribe(this.subscription)
      mqttModule.client.on('message', this.handleMsg)
    },
    handleMsg(topic, message) {
      try {
        const parseMsg = JSON.parse(message.toString())
        this.count.alert = parseMsg?.filter(
          (device) =>
            !device.RXPower ||
            parseFloat(device.RXPower) <= -25 ||
            device.RXPower === '' ||
            device.RXPower === '' ||
            isNaN(device.RXPower)
        )?.length
      } catch (e) {
        console.log(e)
      }
    }
    // async getData() {
    //   try {
    //     this.isLoading = true
    //     if (this.data.local.role_name === 'super admin') {
    //       const resRole = await getUserRole()

    //       const roleAdmin = resRole.data.data[0]
    //       const roleCust = resRole.data.data[1]
    //       const roleSU = resRole.data.data[2]
    //       const roleMonitoring = resRole.data.data[3]
    //       await getUser(20, 1, null, roleAdmin.id).then(
    //         (res) => (this.count.admin = res.data.meta.count)
    //       )
    //       await getUser(20, 1, null, roleCust.id).then(
    //         (res) => (this.count.customer = res.data.meta.count)
    //       )
    //       await getUser(20, 1, null, roleSU.id).then(
    //         (res) => (this.count.superAdmin = res.data.meta.count)
    //       )
    //       await getUser(20, 1, null, roleMonitoring.id).then(
    //         (res) => (this.count.monitoring = res.data.meta.count)
    //       )
    //     }

    //     const resDevice = await getDevice(null, 20, 1)
    //     const resNet = await getNetwork(20, 1, null)
    //     this.count.device = resDevice.data.meta.count
    //     this.count.network = resNet.data.meta.count
    //   } catch (e) {
    //     this.isLoading = true
    //   } finally {
    //     this.isLoading = false
    //   }
    // }
  },
  mounted() {
    // this.getData()
    this.initMqtt()
    this.userStore.getCount()
    this.deviceStore.getCount()
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
  }
}
</script>
