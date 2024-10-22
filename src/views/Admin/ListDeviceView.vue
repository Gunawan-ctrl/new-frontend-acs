<template>
  <main class="w-full p-4">
    <div class="bg-white min-h-screen rounded-md shadow-sm px-4 py-6">
      <section>
        <SpinLoading :loading="isLoading" />
      </section>
      <section>
        <div class="border rounded-md">
          <TableDeviceProcd
            :title="'All Devices'"
            :columns="array.header"
            :data="array.device"
            :pagination="true"
            :totalItem="pagination.total"
            :currPage="pagination.currpage"
            :pageSize="pagination.limit"
            @onLimitSelect="onLimitSelect"
            @onPage="onPageDevice"
            @onSelectChange="onSelectChange"
            @onDelete="onDeleteDevice"
            @onSearchDevice="onSearchDevice"
          />
        </div>
      </section>
    </div>
  </main>
</template>

<script>
import SpinLoading from '@/components/Spin/SpinLoading.vue'
import TableDeviceProcd from '@/components/Table/TableDeviceProcd.vue'
import { delDevice, getDevice } from '@/boot/hooks'

export default {
  components: {
    SpinLoading,
    TableDeviceProcd
  },
  data: () => ({
    isLoading: false,
    searchQuery: null,
    selectedTable: [],
    pagination: {
      limit: 20,
      currpage: 1,
      total: 0
    },
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
          title: 'Product Class',
          dataIndex: 'productClass',
          key: 'productClass'
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
          title: 'ip address',
          dataIndex: 'ipAddrr',
          key: 'ipAddrr'
        }
      ],
      device: []
    }
  }),
  methods: {
    onSelectChange(selectedRowKeys) {
      this.selectedTable = selectedRowKeys
    },
    async getData() {
      this.isLoading = true
      await getDevice(this.searchQuery, this.pagination.limit, this.pagination.currpage)
        .then((res) => {
          this.array.device = res.data.data
          if (this.pagination.currpage === 1) this.pagination.total = res.data.meta.count
        })
        .catch(() => (this.isLoading = true))
        .finally(() => (this.isLoading = false))
    },
    async onDeleteDevice() {
      this.isLoading = true
      await delDevice({
        data: {
          devices_id: this.selectedTable
        }
      })
        .then(() => {
          this.getData()
        })
        .catch(() => (this.isLoading = true))
        .finally(() => (this.isLoading = false))
    },
    onSearchDevice(value) {
      this.pagination.currpage = 1
      this.searchQuery = value
      this.getData()
    },
    onLimitSelect(value) {
      this.pagination.limit = value
      this.pagination.currpage = 1
      this.getData()
    },
    onPageDevice(value) {
      this.pagination.currpage = value
      this.getData()
    }
  },
  mounted() {
    this.getData()
  }
}
</script>
