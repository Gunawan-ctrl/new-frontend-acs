<template>
  <div>
    <!-- Bagian Atas: Tombol Register Batch -->
    <section>
      <div class="flex flex-row items-center justify-end py-2">
        <a-button type="primary" class="capitalize" size="small" @click="onRegistBatch">
          register batch
        </a-button>
      </div>
    </section>
    <!-- Bagian Tabel -->
    <section>
      <a-table
        size="small"
        rowKey="_id"
        :scroll="{ x: 1280 }"
        :columns="columns"
        :data-source="data"
        :pagination="pagination"
        :row-selection="{
          selectedRowKeys: arraySelect.map((item) => item._id),
          onChange: onSelectChange,
          getCheckboxProps: getCheckboxProps
        }"
        @change="onTableChange"
      >
        <!-- Template Header Kolom -->
        <template #headerCell="{ column }">
          <a class="text-xs" fixed>{{ column.title }}</a>
        </template>

        <!-- Template Body Kolom -->
        <template #bodyCell="{ column, record, index }">
          <!-- Kolom Index Dinamis -->
          <template v-if="column.key === 'index'">
            <a class="text-xs" fixed>
              {{ (currentPage - 1) * pageSize + index + 1 }}
            </a>
          </template>

          <!-- Kolom Serial Number -->
          <template v-if="column.key === 'serialNumber'">
            <a class="text-xs" fixed>
              {{ record?._deviceId?._SerialNumber }}
            </a>
          </template>

          <!-- Kolom Manufacturer -->
          <template v-if="column.key === 'manufacturer'">
            <a class="text-xs" fixed>
              {{
                record?._deviceId?._Manufacturer === 'ALCL'
                  ? 'Nokia'
                  : record?._deviceId?._Manufacturer
              }}
            </a>
          </template>

          <!-- Kolom IP Address -->
          <template v-if="column.key === 'ipAddr'">
            <a class="text-xs" fixed>
              {{
                record?.InternetGatewayDevice?.WANDevice[1]?.WANConnectionDevice[1]
                  ?.WANIPConnection[1]?.ExternalIPAddress._value
              }}
            </a>
          </template>

          <!-- Kolom Product Class -->
          <template v-if="column.key === 'productClass'">
            <a class="text-xs" fixed>
              {{ record?._deviceId?._ProductClass }}
            </a>
          </template>

          <!-- Kolom OUI -->
          <template v-if="column.key === 'oui'">
            <a class="text-xs" fixed>
              {{ record?._deviceId?._OUI }}
            </a>
          </template>

          <!-- Kolom Hardware Version -->
          <template v-if="column.key === 'hardwareVersion'">
            <a class="text-xs" fixed>
              {{ record?.InternetGatewayDevice?.DeviceInfo?.HardwareVersion?._value }}
            </a>
          </template>

          <!-- Kolom Software Version -->
          <template v-if="column.key === 'softwareVersion'">
            <a class="text-xs" fixed>
              {{ record?.InternetGatewayDevice?.DeviceInfo?.SoftwareVersion?._value }}
            </a>
          </template>

          <!-- Kolom Action -->
          <template v-else-if="column.key === 'action'">
            <a-button size="small" type="primary" class="capitalize" @click="onRegister(record)">
              register
            </a-button>
          </template>
        </template>
      </a-table>
    </section>
  </div>
</template>

<script>
import { postDevice } from '@/boot/hooks'

export default {
  props: {
    columns: Array,
    data: Array
  },
  data() {
    return {
      arraySelect: [],
      bulkForms: null,
      currentPage: 1,
      pageSize: 20,
      pagination: {
        pageSize: 20,
        total: 0,
        showSizeChanger: true,
        pageSizeOptions: ['20', '50', '100']
      }
    }
  },
  methods: {
    // Handle perubahan pada pagination atau halaman
    onTableChange(pagination) {
      this.currentPage = pagination.current
      this.pageSize = pagination.pageSize
      this.pagination = { ...this.pagination, ...pagination }

      console.log(pagination)
    },

    // Fungsi untuk memproses data production
    async onDbProduction(record) {
      const encId = encodeURIComponent(record._id)
      const form = [
        {
          hardware_version: record.InternetGatewayDevice.DeviceInfo.HardwareVersion?._value,
          koordinat: null,
          model_name: record._deviceId._ProductClass,
          serial_number: record._deviceId._SerialNumber,
          software_version: record.InternetGatewayDevice.DeviceInfo.SoftwareVersion?._value,
          vendor: record._deviceId._Manufacturer,
          device_id_genie: encId,
          ip_address:
            record.InternetGatewayDevice.WANDevice[1].WANConnectionDevice[1].WANIPConnection[1]
              .ExternalIPAddress._value
        }
      ]
      await postDevice(form)
      this.$emit('onDbProduction')
    },

    // Fungsi untuk register batch
    async onRegistBatch() {
      await postDevice(this.bulkForms)
      this.$emit('onRegisterBatch')
    },

    // Fungsi untuk register satu data
    async onRegister(record) {
      const form = {
        hardware_version: record.InternetGatewayDevice.DeviceInfo.HardwareVersion?._value,
        koordinat: null,
        model_name: record._deviceId._ProductClass,
        serial_number: record._deviceId._SerialNumber,
        software_version: record.InternetGatewayDevice.DeviceInfo.SoftwareVersion?._value,
        vendor: record._deviceId._Manufacturer,
        device_id_genie: encodeURIComponent(record._id),
        ip_address:
          record?.InternetGatewayDevice?.WANDevice[1]?.WANConnectionDevice[2]?.WANIPConnection[1]
            ?.ExternalIPAddress._value
      }
      await postDevice([form])
      this.$emit('onRegisterBatch')
    },

    // Fungsi untuk perubahan seleksi baris
    onSelectChange(selectedRowKeys, selectedRows) {
      this.arraySelect = selectedRows
      this.bulkForms = this.generateBulkForms(selectedRows)
    },

    // Fungsi untuk menghasilkan form untuk register batch
    generateBulkForms(selectedRows) {
      return selectedRows.map((record) => ({
        hardware_version: record.InternetGatewayDevice.DeviceInfo.HardwareVersion?._value,
        koordinat: null,
        model_name: record._deviceId._ProductClass,
        serial_number: record._deviceId._SerialNumber,
        software_version: record.InternetGatewayDevice.DeviceInfo.SoftwareVersion?._value,
        vendor: record._deviceId._Manufacturer,
        device_id_genie: encodeURIComponent(record._id),
        ip_address:
          record.InternetGatewayDevice.WANDevice[1].WANConnectionDevice[1].WANIPConnection[1]
            .ExternalIPAddress._value
      }))
    },

    // Fungsi untuk memutuskan apakah checkbox harus dinonaktifkan
    getCheckboxProps(record) {
      return {
        disabled:
          record.InternetGatewayDevice?.WANDevice[1]?.WANConnectionDevice[1]?.WANIPConnection[1]
            ?.ExternalIPAddress._value === undefined,
        name: record._deviceId?._SerialNumber
      }
    }
  }
}
</script>
