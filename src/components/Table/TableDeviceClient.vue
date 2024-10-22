<template>
  <div class="bg-white rounded-md">
    <section>
      <a-modal v-model:open="openTag" :footer="false" :closable="false" style="width: 20em">
        <div class="flex flex-col gap-y-2">
          <h1 class="font-semibold text-sm">Add Tag</h1>
          <a-input size="small" v-model:value="tagsValue" />
          <div class="flex flex-row items-center justify-end gap-x-2">
            <a-button
              @click="onCancel"
              class="border-0 text-white hover:bg-white bg-red-500"
              size="small"
            >
              cancel
            </a-button>
            <a-button @click="onSubmitTag" type="primary" size="small">submit</a-button>
          </div>
        </div>
      </a-modal>
    </section>
    <section>
      <a-table
        size="small"
        rowKey="id"
        :scroll="{ x: 1280 }"
        :columns="columns"
        :data-source="data"
        :pagination="false"
      >
        <template #headerCell="{ column }">
          <a class="text-xs">{{ column.title }}</a>
        </template>
        <template #bodyCell="{ column, record, index }">
          <template v-if="column.key === 'index'">
            {{ index + 1 }}
          </template>
          <template v-if="column.key === 'dot'">
            <div class="flex flex-row items-center gap-x-1">
              <a class="text-xs" fixed>
                <div class="w-2.5 h-2.5 rounded-full" :class="getStatusColor(record.status)"></div>
              </a>
            </div>
          </template>
          <template v-if="column.key === 'status'">
            <div class="flex flex-row items-center gap-x-2">
              <small :class="record.status ? 'text-black' : 'text-gray-400'">
                {{ record?.status ? record.status : 'updating' }}
              </small>
            </div>
          </template>
          <template v-if="column.key === 'serialNumber'">
            <div class="flex flex-row items-center gap-x-1">
              <a class="text-lightBlue-2 text-xs" fixed @click="onDetail(record?.serial_number)">
                {{ record?.serial_number }}
              </a>
            </div>
          </template>
          <template v-if="column.key === 'manufacturer'">
            <a class="text-xs" fixed>
              {{ record?.vendor === 'ALCL' ? 'Nokia' : record?.vendor }}
            </a>
          </template>
          <template v-if="column.key === 'productClass'">
            <a class="text-xs" fixed>
              {{ record?.model_name }}
            </a>
          </template>
          <template v-if="column.key === 'tags'">
            <div class="w-28 cursor-pointer" @click="onOpenTagModal(record)">
              <div class="rounded-md bg-orange-100 border-[1.8px] border-dashed border-orange-200">
                <div class="px-2 py-0.5">
                  <div class="flex flex-row items-center gap-x-2 justify-center">
                    <h1 class="text-xs text-orange-400 truncate">
                      {{ record.tags ? record.tags : 'new tags' }}
                    </h1>
                    <font-awesome-icon
                      :hidden="localData.role_name === 'monitor'"
                      class="text-orange-400"
                      :icon="record.tags ? 'pen-to-square' : 'plus'"
                      size="xs"
                    />
                  </div>
                </div>
              </div>
            </div>
          </template>
          <template v-if="column.key === 'rxPower'">
            <div class="flex flex-row gap-x-1 items-center">
              <font-awesome-icon icon="spinner" class="text-gray-400" spin v-if="!record.RXPower" />
              <p
                fixed
                class="text-xs"
                :class="
                  record.RXPower == undefined || record.RXPower == null || !record.RXPower
                    ? 'text-gray-400 '
                    : ''
                "
              >
                {{ record?.RXPower ? `${record?.RXPower} dBm` : 'updating' }}
              </p>
              <i
                v-if="record.RXPower"
                class="bx bxs-error"
                :class="styleRxPower(record.RXPower).color"
              ></i>
            </div>
          </template>
          <template v-if="column.key === 'ipAddr'">
            <div class="flex flex-row gap-x-1 items-center">
              <font-awesome-icon
                icon="spinner"
                class="text-gray-400"
                spin
                v-if="!record.ip_address"
              />
              <p
                fixed
                class="text-xs"
                :class="
                  record.ip_address == undefined || record.ip_address == null || !record.ip_address
                    ? 'text-gray-400 '
                    : ''
                "
              >
                {{ record?.ip_address }}
              </p>
            </div>
          </template>
          <template v-if="column.key === 'softwareVersion'">
            <a class="text-xs" fixed>
              {{ record?.software_version }}
            </a>
          </template>
        </template>
      </a-table>
    </section>
    <section :hidden="hidePagination">
      <div class="pt-5 flex flex-row justify-between items-center">
        <a-select
          size="small"
          :placeholder="`${pageSize} / page`"
          @select="onLimitSelect"
          v-model="limitSelect"
          style="width: 120px"
        >
          <a-select-option v-for="(optLimit, i) in options" :key="i" :value="optLimit.value">{{
            optLimit.label
          }}</a-select-option>
        </a-select>
        <a-pagination
          size="small"
          :total="totalItem"
          :current="currPage"
          :page-size="pageSize"
          :show-size-changer="false"
          @change="onPage"
        />
      </div>
    </section>
  </div>
</template>

<script>
import { postTags } from '@/boot/hooks'

export default {
  props: {
    columns: Array,
    data: Array,
    totalItem: Number,
    currPage: Number,
    pageSize: Number,
    hidePagination: Boolean
  },
  data: () => ({
    idDevice: null,
    openTag: false,
    tagsValue: null,
    arraySelect: [],
    limitSelect: null,
    localData: JSON.parse(localStorage.getItem('dataUser')),
    options: [
      { value: 20, label: '20 / page' },
      { value: 30, label: '30 / page' },
      { value: 40, label: '40 / page' },
      { value: 50, label: '50 / page' }
    ]
  }),
  methods: {
    onDetail(serial_numb) {
      this.$emit('onDetail', serial_numb)
    },
    onOpenTagModal(record) {
      if (this.localData.role_name === 'customer') {
        this.idDevice = record.id
        this.tagsValue = record.tags ? record.tags : null
        this.openTag = true
      }
    },
    onCancel() {
      this.tagsValue = null
      this.openTag = false
    },
    async onSubmitTag() {
      const form = {
        id: this.idDevice,
        tags: this.tagsValue
      }
      await postTags(this.idDevice, form)

      this.openTag = false
      this.tagsValue = null
      this.$emit('onSubmitTag')
    },
    onSelectChange(selectedRowKeys) {
      this.arraySelect = selectedRowKeys
      this.$emit('onSelectChange', selectedRowKeys)
    },
    onLimitSelect(value) {
      this.$emit('onLimitSelect', value)
    },
    onPage(page) {
      this.$emit('onPage', page)
    },
    getStatusColor(status) {
      if (status == 'online') {
        return 'bg-lightGreen-2'
      } else if (status?.search('past') == -1) {
        return 'bg-lightRed-2'
      } else {
        return 'bg-gray-300'
      }
    },

    styleRxPower(params) {
      const temp = parseFloat(params).toFixed(2)
      if (temp > -8)
        return {
          color: 'text-white'
        }
      // over
      else if (temp > -20)
        return {
          color: 'text-white'
        }
      // good
      else if (temp > -25)
        return {
          color: 'text-white'
        }
      // ok
      else if (temp > -28)
        return {
          color: 'text-[#FFB332]'
        }
      //warning
      else
        return {
          color: 'text-[#FF7F3E]'
        } //bad
    }
  }
}
</script>
