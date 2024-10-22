<template>
  <div class="px-2">
    <section>
      <div
        class="flex flex-row py-4 items-center justify-center sm:justify-between gap-2 lg:flex-nowrap flex-wrap"
      >
        <div>
          <h1 class="font-semibold px-2">{{ title }}</h1>
        </div>
        <div class="flex flex-row flex-wrap sm:flex-nowrap gap-1 sm:justify-between justify-center">
          <a-input-search
            :hidden="hideSearch"
            v-model:value="searchDevice"
            size="small"
            placeholder="search device"
            @input="onSearchDevice(searchDevice)"
          >
            <template #enterButton>
              <font-awesome-icon icon="magnifying-glass" />
            </template>
          </a-input-search>
          <a-button size="small" type="primary" danger @click="onDelete" :hidden="hide"
            >delete batch</a-button
          >
        </div>
      </div>
    </section>
    <section>
      <a-table
        class="min-h-60"
        size="small"
        rowKey="id"
        :scroll="{ x: 1280 }"
        :columns="columns"
        :data-source="data"
        :pagination="false"
        :row-selection="{ selectedRowKeys: arraySelect, onChange: onSelectChange }"
      >
        <template #headerCell="{ column }">
          <a class="text-xs">{{ column.title }}</a>
        </template>
        <template #bodyCell="{ column, record, index }">
          <template v-if="column.key === 'index'">
            <a class="text-xs" fixed>
              {{ (currPage - 1) * pageSize + (index + 1) }}
            </a>
          </template>
          <template v-if="column.key === 'serialNumber'">
            <a class="text-xs" fixed>
              {{ record?.serial_number }}
            </a>
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
          <template v-if="column.key === 'ipAddrr'">
            <a class="text-xs" fixed>
              {{ record?.ip_address }}
            </a>
          </template>
          <template v-if="column.key === 'hardwareVersion'">
            <a class="text-xs" fixed>
              {{ record?.hardware_version }}
            </a>
          </template>
          <template v-if="column.key === 'softwareVersion'">
            <a class="text-xs" fixed>
              {{ record?.software_version }}
            </a>
          </template>
          <template v-if="column.key === 'action'">
            <a-button type="primary" size="small" @click="onDelete(record.id)">
              <font-awesome-icon icon="trash" size="sm" />
            </a-button>
          </template>
        </template>
      </a-table>
    </section>
    <section>
      <div class="pt-2 pb-3 flex flex-row justify-end gap-1 items-center">
        <a-pagination
          size="small"
          :total="totalItem"
          :current="currPage"
          :page-size="pageSize"
          :show-size-changer="false"
          @change="onPage"
        />
        <a-select
          size="small"
          :placeholder="`${pageSize} / page`"
          @select="onLimitSelect"
          v-model="limitSelect"
          style="width: 100px"
        >
          <a-select-option v-for="(optLimit, i) in options" :key="i" :value="optLimit.value">{{
            optLimit.label
          }}</a-select-option>
        </a-select>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  props: {
    columns: Array,
    data: Array,
    totalItem: Number,
    currPage: Number,
    pageSize: Number,
    hide: Boolean,
    title: String,
    hideSearch: Boolean
  },
  data: () => ({
    idDevice: null,
    searchDevice: null,
    arraySelect: [],
    limitSelect: null,
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
    onSearchDevice(value) {
      this.$emit('onSearchDevice', value)
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
    onDelete(id) {
      this.$emit('onDelete', id)
    }
  }
}
</script>
