<template>
  <div class="bg-white rounded-md">
    <section>
      <a-table
        size="small"
        :columns="column"
        :data-source="dataTable"
        :scroll="{ y: 400 }"
        :pagination="false"
        :showHeader="false"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'title'">
            <p fixed>
              {{ record.title }}
            </p>
          </template>
          <template v-if="column.key === 'value' && record.title == 'Setting Auth WiFi'">
            <a-button
              size="small"
              type="primary"
              @click="onAuthWifi"
              class="flex flex-row gap-x-2 items-center"
            >
              <font-awesome-icon icon="gear" size="xs" />
              <span>Setting</span>
            </a-button>
          </template>
          <template v-if="column.key === 'value' && record.title == 'Enable WiFi'">
            <a-switch
              size="small"
              v-model:checked="record.value"
              checked-children="on"
              un-checked-children="off"
              @change="onEnableSSID"
            />
          </template>
          <template v-if="column.key === 'value' && record.title == 'WiFi Broadcast'">
            <a-switch
              size="small"
              v-model:checked="record.value"
              checked-children="on"
              un-checked-children="off"
              @change="onEnableWifiBroadcast"
            />
          </template>
          <template v-if="column.key === 'value' && record.title == 'WiFi Issolation'">
            <a-switch
              size="small"
              v-model:checked="record.value"
              checked-children="on"
              un-checked-children="off"
              @change="onEnableIssolation"
            />
          </template>
          <template v-if="column.key === 'value' && record.title == 'WiFi Name'">
            <div class="flex flex-row gap-x-2 items-center">
              <a>{{ record.value }}</a>
              <font-awesome-icon
                icon="pencil"
                class="cursor-pointer"
                size="xs"
                @click="onTaskWifi(record.value)"
              />
            </div>
          </template>
        </template>
      </a-table>
    </section>
  </div>
</template>
<script>
export default {
  props: { dataTable: Array },
  data: () => ({
    column: [
      {
        title: 'Title',
        dataIndex: 'title',
        key: 'title'
      },
      {
        title: 'Value',
        dataIndex: 'value',
        key: 'value'
      }
    ]
  }),
  methods: {
    onTaskWifi(value) {
      this.$emit('onTaskWifi', value)
    },
    onEnableSSID(value) {
      this.$emit('onEnableSSID', value)
    },
    onEnableWifiBroadcast(value) {
      this.$emit('onEnableWifiBroadcast', value)
    },
    onEnableIssolation(value) {
      this.$emit('onEnableIssolation', value)
    },
    onAuthWifi() {
      this.$emit('onAuthWifi')
    }
  }
}
</script>
