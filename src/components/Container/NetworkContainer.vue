<template>
  <main class="w-full border rounded-md p-4">
    <SpinLoading :loading="isLoading" />
    <div class="flex flex-col gap-y-3">
      <section>
        <FormNetwork
          :open="open"
          :name="name"
          :region_id="region_id"
          :dataRegion="dataRegion"
          @onSelectRegion="onSelectRegion"
          @onName="onName"
          @onCancel="onCancel"
          @createNetwork="createNetwork"
        />
      </section>
      <section>
        <div
          class="flex flex-row items-center gap-2 justify-center sm:justify-between lg:flex-nowrap flex-wrap"
        >
          <div>
            <a-input-search
              v-model:value="searchValue"
              size="small"
              @input="onSearchNet(searchValue)"
              placeholder="search networks"
            >
              <template #enterButton>
                <font-awesome-icon icon="magnifying-glass" />
              </template>
            </a-input-search>
          </div>
          <a-button type="primary" class="shadow-sm" @click="onModal" size="small">
            + add network
          </a-button>
        </div>
      </section>

      <section>
        <a-table
          size="small"
          rowKey="id_net"
          :scroll="{ x: 1280, y: 480 }"
          :columns="columns"
          :dataSource="tableData"
          :pagination="false"
          :row-selection="{ selectedRowKeys: selectedTable, onChange: onSelectChange }"
        >
          <template #bodyCell="{ column, record, index }">
            <template v-if="column.key === 'index'">
              <a class="text-xs" fixed>
                {{ (currPageNet - 1) * limitNet + index + 1 }}
              </a>
            </template>
            <template v-if="column.key === 'action'">
              <span>
                <a-button size="small" @click="onEdit(record.id_net)">
                  <font-awesome-icon icon="pen-to-square" />
                </a-button>
                <a-divider type="vertical" />
                <a-button size="small" danger @click="onDelete(record.id_net)">
                  <font-awesome-icon icon="trash" />
                </a-button>
              </span>
            </template>
          </template>
        </a-table>
      </section>
      <section>
        <div class="pt-2 pb-3 flex flex-row justify-end gap-1 items-center">
          <a-pagination
            size="small"
            :total="totalPageNet"
            :current="currPageNet"
            :page-size="limitNet"
            :show-size-changer="false"
            @change="onPage"
          />
          <a-select
            size="small"
            :placeholder="`${limitNet} / page`"
            @select="onLimitSelect"
            v-model="limitNet"
            style="width: 100px"
          >
            <a-select-option v-for="(optLimit, i) in options" :key="i" :value="optLimit.value">{{
              optLimit.label
            }}</a-select-option>
          </a-select>
        </div>
      </section>
    </div>
  </main>
</template>

<script>
import FormNetwork from '@/components/Form/FormNetwork.vue'
import { delNetwork, getAllRegion, getDetailNetwork, getNetwork, postPutNet } from '@/boot/hooks'
import SpinLoading from '@/components/Spin/SpinLoading.vue'

export default {
  components: { FormNetwork, SpinLoading },
  data: () => ({
    idNetwork: null,
    isLoading: false,
    open: false,
    searchValue: null,
    limitNet: 20,
    currPageNet: 1,
    totalPageNet: 0,
    selectedTable: [],
    columns: [
      {
        title: 'No',
        dataIndex: 'index',
        key: 'index',
        width: 50
      },
      {
        title: 'Region Name',
        dataIndex: 'regionName',
        key: 'regionName'
      },
      {
        title: 'Network Name',
        dataIndex: 'networkName',
        key: 'networkName'
      },
      {
        title: 'Network Code',
        dataIndex: 'networkCode',
        key: 'networkCode'
      },
      {
        title: 'Action ',
        dataIndex: 'action',
        key: 'action'
      }
    ],
    data: [],
    dataRegion: [],
    options: [
      { value: 20, label: '20 / page' },
      { value: 30, label: '30 / page' },
      { value: 40, label: '40 / page' },
      { value: 50, label: '50 / page' }
    ],
    name: null,
    region_id: null
  }),
  methods: {
    clearForm() {
      this.name = null
      this.region_id = ''
      this.idNetwork = null
    },
    onLimitSelect(value) {
      this.limitNet = value
      this.currPageNet = 1
      this.getData()
    },
    onPage(page) {
      this.currPageNet = page
      this.getData()
    },
    async onSearchNet(name) {
      this.currPageNet = 1
      this.searchValue = name
      this.getData()
    },
    onSelectRegion(value) {
      this.region_id = value
    },
    onModal() {
      this.open = true
    },
    onCancel() {
      this.clearForm()
      this.open = false
    },
    onName(value) {
      this.name = value
    },
    async createNetwork() {
      const form = {
        name: this.name,
        region_id: this.region_id
      }
      await postPutNet(form, this.idNetwork).then(() => {
        this.getData()
        this.clearForm()
        this.open = false
      })
    },
    async onEdit(value) {
      await getDetailNetwork(value)
        .then((res) => {
          const dataDetail = res.data.data

          this.idNetwork = dataDetail.networks[0].id
          this.name = dataDetail.networks[0].name
          this.region_id = dataDetail.regions.id
          this.open = true
        })
        .catch((e) => {
          console.log(e)
        })
    },
    async getData() {
      this.isLoading = true
      await getNetwork(this.limitNet, this.currPageNet, this.searchValue)
        .then((res) => {
          this.data = res.data.data
          if (this.currPageNet === 1) this.totalPageNet = res.data.meta.count
        })
        .catch((err) => console.log(err))
        .finally(() => (this.isLoading = false))
    },
    async getRegion() {
      await getAllRegion(1, 200)
        .then((res) => {
          this.dataRegion = res.data.data
        })
        .catch((e) => console.log(e))
    },
    async onDelete(id) {
      this.isLoading = true

      await delNetwork({
        data: {
          network_id: [id]
        }
      })
      this.getData()
      this.isLoading = false
    },
    onSelectChange(selectedRowKeys) {
      this.selectedTable = selectedRowKeys
    }
  },

  mounted() {
    this.getData()
    this.getRegion()
  },
  computed: {
    tableData() {
      // Menggabungkan data region dan network ke dalam format tabel
      return this.data?.flatMap((region) => {
        // Jika network ada, buat array dari network, jika tidak buat array kosong
        return region.networks
          ? region.networks.map((network) => ({
              id_region: region.regions.id,
              id_net: network.id,
              regionName: region.regions.name,
              networkName: network.name,
              networkCode: network.code
            }))
          : []
      })
    }
  }
}
</script>
