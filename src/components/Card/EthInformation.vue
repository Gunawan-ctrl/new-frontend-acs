<template>
  <main class="shadow-sm bg-white rounded-md">
    <SpinLoading :loading="isLoading" />
    <section>
      <div class="px-4 py-2">
        <h1 class="font-medium">Ethernet Information</h1>
      </div>
    </section>

    <section>
      <div v-for="(data, i) in data" :key="i">
        <ul class="even:bg-slate-100" v-for="(title, j) in titleData" :key="j">
          <div v-if="i == j" class="flex flex-row justify-between px-5 py-1.5 text-[13px]">
            <li class="capitalize">{{ title }}</li>
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
import SpinLoading from '../Spin/SpinLoading.vue'
export default {
  components: { SpinLoading },
  data: () => ({
    isLoading: false,
    idParams: null,
    data: [],
    status: null,
    dhcpServer: null,
    subNet: null,
    macAddr: null,
    maxAddr: null,
    minAddr: null,
    titleData: [
      'ethernet status',
      'DHCP server enable',
      'ethernet subnet mask',
      'ethernet MAC address',
      'maximal address',
      'minimal address'
    ]
  }),
  methods: {
    async getData() {
      this.idParams = this.$route.params.id

      try {
        this.isLoading = true

        const res = await getDetailDeviceAcs(this.idParams)
        const dataDetail = res.data[0]
        this.status =
          dataDetail?.InternetGatewayDevice?.LANDevice[1]?.WLANConfiguration[1]?.Status?._value
        this.macAddr =
          dataDetail?.InternetGatewayDevice?.LANDevice[1]?.LANHostConfigManagement?.MACAddress?._value
        this.subNet =
          dataDetail?.InternetGatewayDevice?.LANDevice[1]?.LANHostConfigManagement?.SubnetMask?._value
        this.dhcpServer =
          dataDetail?.InternetGatewayDevice?.LANDevice[1]?.LANHostConfigManagement?.DHCPServerEnable?._value
        this.maxAddr =
          dataDetail?.InternetGatewayDevice?.LANDevice[1]?.LANHostConfigManagement?.MaxAddress?._value
        this.minAddr =
          dataDetail?.InternetGatewayDevice?.LANDevice[1]?.LANHostConfigManagement?.MinAddress?._value
        this.data = [
          this.status,
          this.dhcpServer,
          this.subNet,
          this.macAddr,
          this.maxAddr,
          this.minAddr
        ]
      } catch (err) {
        console.log(err)
      } finally {
        this.isLoading = false
      }
    }
  },
  mounted() {
    this.getData()
  }
}
</script>
