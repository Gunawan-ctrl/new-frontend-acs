<template>
  <main class="shadow-sm bg-white rounded-md h-60">
    <section>
      <div class="px-4 py-2">
        <h1 class="font-medium">Device Information</h1>
      </div>
    </section>
    <section>
      <div v-for="(data, i) in data" :key="i">
        <ul v-for="(title, j) in titleData" :key="j" class="even:bg-slate-100">
          <div v-if="i == j" class="flex flex-row justify-between px-5 py-1.5 text-[13px]">
            <li class="">{{ title }}</li>
            <li>{{ data == 'ALCL' ? 'Nokia' : data }}</li>
          </div>
        </ul>
        <hr />
      </div>
    </section>
  </main>
</template>
<script>
import { getDetailDeviceAcs } from '@/boot/hooks'

export default {
  data: () => ({
    idParams: null,
    titleData: [
      'Manufacturer',
      'Serial Number',
      'Hardware Version',
      'Software Version',
      'Product Class',
      'OUI'
    ],
    data: [],
    manufacturerName: null,
    serialNumb: null,
    hwVersion: null,
    swVersion: null,
    productClass: null,
    oui: null
  }),
  methods: {
    async getData() {
      this.idParams = this.$route.params.id
      const res = await getDetailDeviceAcs(this.idParams)
      const dataDetail = res.data[0]

      this.data = [
        (this.manufacturerName = dataDetail?._deviceId?._Manufacturer),
        (this.serialNumb = dataDetail?._deviceId?._SerialNumber),
        (this.hwVersion = dataDetail?.InternetGatewayDevice?.DeviceInfo?.HardwareVersion?._value),
        (this.swVersion = dataDetail?.InternetGatewayDevice?.DeviceInfo?.SoftwareVersion?._value),
        (this.productClass = dataDetail?._deviceId._ProductClass),
        (this.oui = dataDetail?._deviceId._OUI)
      ]
    }
  },
  mounted() {
    this.getData()
  },
  watch: {
    '$route.params.id': {
      immediate: true,
      handler() {
        this.getData()
      }
    }
  }
}
</script>
