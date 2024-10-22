<template>
  <div class="bg-white rounded-md">
    <section>
      <a-table
        size="small"
        rowKey="id"
        :scroll="{ x: 800, y: 400 }"
        :columns="columns"
        :data-source="data"
        :pagination="false"
        :row-selection="{
          selectedRowKeys: arraySelect,
          onChange: onSelectChange,
          getCheckboxProps: getCheckboxProps
        }"
      >
        <template #headerCell="{ column }">
          <a fixed>{{ column.title }}</a>
        </template>
        <template #bodyCell="{ column, record, index }">
          <template v-if="column.key === 'index'">
            <a class="text-xs" fixed>
              {{ (currPage - 1) * pageSize + index + 1 }}
            </a>
          </template>
          <template v-if="column.key === 'name'">
            <a fixed>
              {{ record.name }}
            </a>
          </template>
          <template v-if="column.key === 'role'">
            <a-tag
              class="capitalize"
              :color="
                record.roles.name === 'admin'
                  ? 'orange'
                  : record.roles.name === 'super admin'
                    ? 'red'
                    : record.roles.name === 'customer'
                      ? 'green'
                      : 'blue'
              "
            >
              {{ record.roles.name }}
            </a-tag>
          </template>
          <template v-else-if="column.key === 'status'">
            <a-switch
              v-model:checked="record.status"
              @change="updateStatus(record.id)"
              size="small"
            />
          </template>
          <template v-else-if="column.key === 'group'">
            <a fixed :class="record.group ? '' : 'text-gray-400'">
              {{ record.group ? record.group : '_no group' }}
            </a>
          </template>
          <template v-else-if="column.key === 'action'">
            <span>
              <a-button size="small" @click="changePassAdmin(record.id)">
                <font-awesome-icon icon="unlock" />
              </a-button>
              <a-divider type="vertical" />
              <a-button
                size="small"
                @click="onEdit(record.id)"
                :disabled="record.roles.name == 'admin' || record.roles.name == 'super admin'"
              >
                <font-awesome-icon icon="pencil" />
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
          placeholder="20 / page"
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
    pageSize: Number
  },
  data: () => ({
    arraySelect: [],
    limitSelect: null,
    options: [
      { value: 5, label: '5 / page' },
      { value: 20, label: '20 / page' },
      { value: 30, label: '30 / page' },
      { value: 40, label: '40 / page' },
      { value: 50, label: '50 / page' }
    ]
  }),
  methods: {
    changePassAdmin(id) {
      this.$emit('changePassAdmin', id)
    },
    onDelete(id) {
      this.$emit('onDelete', id)
    },
    onEdit(id) {
      this.$emit('onEdit', id)
    },
    onSelectChange(selectedRowKeys) {
      this.arraySelect = selectedRowKeys
      this.$emit('onSelectChange', selectedRowKeys)
    },
    getCheckboxProps(record) {
      return {
        disabled: record.roles.name === 'admin' || record.roles.name === 'super admin',
        name: record.roles.name
      }
    },
    onLimitSelect(value) {
      this.$emit('onLimitSelect', value)
    },
    onPage(page) {
      this.$emit('onPage', page)
    },
    updateStatus(id) {
      this.$emit('onUpdateStatus', id)
    }
  }
}
</script>
