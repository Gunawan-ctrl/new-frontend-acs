<template>
  <div class="bg-white rounded-md">
    <section>
      <a-table
        size="small"
        rowKey="id"
        :scroll="{ x: 'max-content', y: 400 }"
        :columns="columns"
        :data-source="data"
        :pagination="false"
        :row-selection="{ selectedRowKeys: arraySelect, onChange: onSelectChange }"
      >
        <template #headerCell="{ column }">
          <a fixed>{{ column.title }}</a>
        </template>

        <template #bodyCell="{ column, record, index }">
          <template v-if="column.key === 'index'">
            <a class="text-xs" fixed>
              {{ (currPage - 1) * pageSize + (index + 1) }}
            </a>
          </template>
          <template v-if="column.key === 'name'">
            <a fixed>
              {{ record.name }}
            </a>
          </template>
          <template v-if="column.key === 'region'">
            <a fixed>
              {{ record.region.name }}
            </a>
          </template>
          <template v-if="column.key === 'role'">
            <a-tag :color="record.roles.name === 'admin' ? 'green' : 'blue'">
              {{ record.roles.name }}
            </a-tag>
          </template>
          <template v-if="column.key === 'status'">
            <a-tag :color="record.status === 'online' ? 'green' : 'red'">
              {{ record.status ? record.status : 'offline' }}
            </a-tag>
          </template>
          <template v-else-if="column.key === 'tags'">
            <span>
              <a-tag v-for="tag in record.tags" :key="tag">
                {{ tag.toUpperCase() }}
              </a-tag>
            </span>
          </template>

          <template v-else-if="column.key === 'action'">
            <span>
              <a-button size="small" @click="onEdit(record.id)">
                <font-awesome-icon icon="pen-to-square" />
              </a-button>
              <a-divider type="vertical" />
              <a-button size="small" danger @click="onDelete(record.id)">
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
    pagination: Boolean,
    isChecked: Boolean,
    totalItem: Number,
    currPage: Number,
    pageSize: Number
  },
  data: () => ({
    arraySelect: [],
    statusDelete: false,
    limitSelect: null,
    options: [
      { value: 20, label: '20 / page' },
      { value: 30, label: '30 / page' },
      { value: 40, label: '40 / page' },
      { value: 50, label: '50 / page' }
    ]
  }),
  methods: {
    onEdit(value) {
      this.$emit('onEdit', value)
    },
    onDelete(id) {
      this.$emit('onDelete', id)
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
    }
  }
}
</script>
