<template>
  <main class="w-full p-4">
    <div class="bg-white min-h-screen rounded-md shadow-sm px-4 py-6">
      <section>
        <SpinLoading :loading="isBolean.loading" />
      </section>
      <section>
        <FormChangeDeviceNet
          :open="isBolean.deviceNet"
          @onCancel="onCancelChangeNet"
          @onSelectRadioNet="onSelecModalNet"
          @onSubmit="onChangeNet"
        />
      </section>
      <section>
        <div class="flex flex-row items-start lg:flex-nowrap md:flex-wrap flex-wrap gap-3">
          <div class="w-full lg:w-2/5">
            <div class="border rounded-md py-4 px-1">
              <ListContainer
                :title="'networks'"
                :data="arr.network"
                @onSearchNet="onSearchNet"
                @onLoadMore="onLoadMore"
                @onSelectRadio="onSelectRadioNet"
              />
            </div>
          </div>
          <div class="w-full lg:w-3/5">
            <div class="border rounded-md py-1.5">
              <TableDeviceProcd
                v-if="isBolean.allDevice == true"
                :title="'Devices Existing'"
                :hide="true"
                :columns="arr.header"
                :data="arr.device"
                :totalItem="pagination.totalPageDevice"
                :pageSize="pagination.limitDevice"
                :currPage="pagination.pageDevice"
                @onPage="onPageDevice"
                @onLimitSelect="onLimitSelectDevice"
                @onSearchDevice="onSearchDevice"
                @onSelectChange="onSelectIdDevice"
              />
              <TableDeviceProcd
                v-else
                :title="`Devices Connect ${forms.net_name}`"
                :hideSearch="true"
                :totalItem="pagination.totalPageDetail"
                :pageSize="pagination.limitDetail"
                :currPage="pagination.pageDetail"
                :columns="arr.header"
                :data="arr.detail"
                @onPage="onPageDetail"
                @onLimitSelect="onLimitSelectDetail"
                @onSelectChange="onSelectIdDevice"
              />
              <div class="px-2">
                <a-checkbox
                  v-model:checked="isBolean.allDevice"
                  size="small"
                  :disabled="forms.net_id == null"
                  @change="onViewAll"
                  >all devices
                </a-checkbox>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section>
        <div class="flex flex-row justify-end pt-2">
          <a-button
            size="small"
            type="primary"
            :disabled="forms.device_id ? false : true"
            :hidden="isBolean.allDevice == false || !forms.net_id"
            @click="onConnect"
            >Connect To {{ forms.net_name }}
          </a-button>
          <a-button
            size="small"
            type="primary"
            :hidden="isBolean.allDevice == true || !forms.device_id"
            @click="openFormChngeNet"
          >
            Change Networks
          </a-button>
        </div>
      </section>
    </div>
  </main>
</template>
<script>
import SpinLoading from '@/components/Spin/SpinLoading.vue'
import FormChangeDeviceNet from '@/components/Form/FormChangeDeviceNet.vue'
import ListContainer from '@/components/Table/ListContainer.vue'
import TableDeviceProcd from '@/components/Table/TableDeviceProcd.vue'
import {
  getDetailDeviceNetworks,
  getDeviceNoConnect,
  getNetwork,
  postDeviceNetworks,
  putDeviceNetwokrs
} from '@/boot/hooks'

export default {
  components: { SpinLoading, FormChangeDeviceNet, ListContainer, TableDeviceProcd },
  data: () => ({
    isBolean: {
      deviceNet: false,
      loading: false,
      allDevice: true
    },
    forms: {
      net_name: null,
      net_id: null,
      net_edit_id: null,
      searchDevice: null,
      searchNet: null,
      device_id: []
    },
    pagination: {
      limitNetwork: 20,
      limitDevice: 20,
      limitDetail: 20,
      pageNetwork: 1,
      pageDevice: 1,
      totalPageDevice: 0,
      totalPageNetwork: 0,
      pageDetail: 1,
      totalPageDetail: 0
    },
    arr: {
      detail: [],
      network: [],
      device: [],
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
          title: 'Ip Address',
          dataIndex: 'ipAddrr',
          key: 'ipAddrr'
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
        }
      ]
    }
  }),
  methods: {
    openFormChngeNet() {
      this.isBolean.deviceNet = true
      this.pagination.pageDevice = 1
    },
    async getNetwork() {
      await getNetwork(
        this.pagination.limitNetwork,
        this.pagination.pageNetwork,
        this.forms.searchNet
      ).then((res) => {
        this.arr.network = res.data.data
      })
    },
    async getDevice() {
      this.isBolean.loading = true
      await getDeviceNoConnect(
        this.forms.searchDevice,
        this.pagination.limitDevice,
        this.pagination.pageDevice
      )
        .then((res) => {
          this.arr.device = res.data.data
          console.log(res.data.data)
          if (this.pagination.pageDevice === 1)
            this.pagination.totalPageDevice = res.data.meta.count
          this.isBolean.loading = false
        })
        .catch(() => (this.isBolean.loading = false))
        .finally(() => (this.isBolean.loading = false))
    },
    async getDetailDevice(netId) {
      this.isBolean.loading = true
      await getDetailDeviceNetworks(netId, this.pagination.pageDetail, this.pagination.limitDetail)
        .then((res) => {
          this.arr.detail = res.data.data.devices
          if (this.pagination.pageDetail === 1)
            this.pagination.totalPageDetail = res.data.meta.count
          this.isBolean.loading = false
        })
        .catch(() => (this.isBolean.loading = false))
        .finally(() => (this.isBolean.loading = false))
    },
    onPageDevice(value) {
      this.pagination.pageDevice = value
      if (this.isBolean.allDevice == true) this.getDevice()
      else this.getDetailDevice(this.forms.net_id)
    },
    onLimitSelectDevice(value) {
      this.pagination.limitDevice = value
      this.pagination.pageDevice = 1
      if (this.isBolean.allDevice == true) this.getDevice()
      else this.getDetailDevice(this.forms.net_id)
    },
    onPageDetail(value) {
      this.pagination.pageDetail = value
      if (this.isBolean.allDevice == true) this.getDevice()
      else this.getDetailDevice(this.forms.net_id)
    },
    onLimitSelectDetail(value) {
      this.pagination.limitDetail = value
      this.pagination.pageDetail = 1
      if (this.isBolean.allDevice == true) this.getDevice()
      else this.getDetailDevice(this.forms.net_id)
    },
    onLoadMore() {
      this.pagination.limitNetwork += 1
      this.getNetwork()
    },
    onCancelChangeNet() {
      this.isBolean.deviceNet = false
      this.forms.net_edit_id = null
    },
    onSelectRadioNet(value, name) {
      this.isBolean.allDevice = false
      this.forms = {
        ...this.forms,
        net_id: value,
        net_name: name
      }
      this.getDetailDevice(value)
    },
    onSelecModalNet(value) {
      this.forms.net_edit_id = value
    },
    onViewAll() {
      if (this.isBolean.allDevice === true) this.getDevice()
      else this.getDetailDevice(this.forms.net_id)
    },
    onSearchNet(value) {
      this.forms.searchNet = value
      this.getNetwork()
    },
    onSearchDevice(value) {
      this.pagination.pageDevice = 1
      this.forms.searchDevice = value
      this.getDevice()
    },
    // onSearchDetail(value) {
    //   // this.forms.searchDetail = value
    //   this.getDetailDevice()
    // },
    onSelectIdDevice(value) {
      this.forms.device_id = value
    },
    async onConnect() {
      const form = {
        network_id: this.forms.net_id,
        device_id: this.forms.device_id
      }
      await postDeviceNetworks(form).then(() => {
        this.getDevice(this.forms.net_id)
        this.forms.device_id = null
      })
    },
    async onChangeNet() {
      const form = {
        network_id: this.forms.net_edit_id,
        device_id: this.forms.device_id
      }
      await putDeviceNetwokrs(form).then(() => {
        this.isBolean.deviceNet = false
        this.forms = {
          ...this.forms,
          net_edit_id: null,
          device_id: null
        }
        this.getDevice()
        this.getDetailDevice(this.forms.net_id)
      })
    }
  },
  mounted() {
    this.getNetwork()
    this.getDevice()
  }
}
</script>
