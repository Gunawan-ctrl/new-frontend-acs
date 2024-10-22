<template>
  <main class="w-full min-h-screen border border-gray-200 rounded-md p-4">
    <div class="flex flex-col gap-y-4">
      <section>
        <TableContainer
          :columns="columDevice"
          :data="dataDevice"
          @onDetail="onDetail"
          :pagination="true"
        />
      </section>
    </div>
  </main>
</template>

<script>
import TableContainer from '@/components/Table/TableContainer.vue'

export default {
  components: {
    TableContainer
  },
  data: () => ({
    columDevice: [
      {
        title: 'Serial Number',
        dataIndex: 'serial_number',
        key: 'serial_number'
      },
      {
        title: 'Vendor',
        dataIndex: 'vendor',
        key: 'vendor'
      },
      {
        title: 'Model Name',
        dataIndex: 'model_name',
        key: 'model_name'
      },
      {
        title: 'Customer',
        dataIndex: 'customer',
        key: 'customer'
      },
      {
        title: 'Group',
        dataIndex: 'group',
        key: 'group'
      },
      {
        title: 'Provisioned',
        dataIndex: 'provisioned',
        key: 'provisioned'
      },
      {
        title: 'Status',
        key: 'status',
        dataIndex: 'status'
      },
      {
        title: 'Detail',
        key: 'detail',
        dataIndex: 'detail'
      }
    ],
    dataDevice: [
      {
        id: '1',
        serial_number: 1233132131,
        vendor: 'mikrotik',
        model_name: '-',
        customer: '-',
        group: '-',
        provisioned: '-',
        status: 'online'
      },
      {
        id: '1',
        serial_number: 1233132131,
        vendor: 'mikrotik',
        model_name: '-',
        customer: '-',
        group: '-',
        provisioned: '-',
        status: 'offline'
      }
    ]
  }),
  methods: {
    onDetail(serial_numb) {
      this.$router.push(`/device/${serial_numb}`)
    }
  }
}
</script>

<style></style>
