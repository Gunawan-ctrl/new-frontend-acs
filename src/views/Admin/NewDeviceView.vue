<template>
  <main class="w-full min-h-screen p-4">
    <div class="bg-white min-h-screen shadow-sm rounded-md px-4 py-6">
      <section>
        <SpinLoading :loading="isLoading" />
      </section>
      <section>
        <div class="border rounded-md p-3">
          <TableDeviceAcs
            :columns="array.header"
            :data="array.device"
            @onDbProduction="onDbProduction"
            @onRegisterBatch="onRegisterBatch"
          />
        </div>
      </section>
    </div>
  </main>
</template>
<script>
import SpinLoading from '@/components/Spin/SpinLoading.vue'
import TableDeviceAcs from '@/components/Table/TableDeviceAcs.vue'
import { getAllDeviceAcs } from '@/boot/hooks'
export default {
  components: { SpinLoading, TableDeviceAcs },
  data: () => ({
    isLoading: false,
    array: {
      header: [
        {
          title: 'No',
          dataIndex: 'index',
          key: 'index',
          width: 50
        },
        {
          title: 'Serial Number',
          dataIndex: 'serialNumber',
          key: 'serialNumber'
        },
        {
          title: 'Manufacturer',
          dataIndex: 'manufacturer',
          key: 'manufacturer'
        },
        {
          title: 'Ip Address',
          dataIndex: 'ipAddr',
          key: 'ipAddr'
        },
        {
          title: 'Product Class',
          dataIndex: 'productClass',
          key: 'productClass'
        },
        {
          title: 'OUI',
          dataIndex: 'oui',
          key: 'oui'
        },
        {
          title: 'Hardware Version',
          dataIndex: 'hardwareVersion',
          key: 'hardwareVersion'
        },
        {
          title: 'Software Version',
          dataIndex: 'softwareVersion',
          key: 'softwareVersion'
        },
        {
          title: 'Action',
          dataIndex: 'action',
          key: 'action'
        }
      ],
      device: []
    }
  }),
  methods: {
    async getDeviceAcs() {
      try {
        this.isLoading = true
        await getAllDeviceAcs('new').then((res) => {
          this.array.device = res.data
        })
      } catch (err) {
        this.isLoading = true
      } finally {
        this.isLoading = false
      }
    },
    onDbProduction() {
      this.getDeviceAcs()
    },
    onRegisterBatch() {
      this.getDeviceAcs()
    }
  },
  mounted() {
    this.getDeviceAcs()
  }
}
</script>
