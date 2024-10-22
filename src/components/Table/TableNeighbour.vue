<template>
  <main class="bg-white rounded-md">
    <div class="p-4">
      <section>
        <a-table
          size="small"
          rowKey="id"
          :scroll="{ x: 1000, y: 400 }"
          :columns="columns"
          :data-source="data"
          :pagination="false"
        >
          <template #headerCell="{ column }">
            <a class="text-xs" fixed>{{ column.title }}</a>
          </template>
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'ssid'">
              <a class="text-xs" fixed>
                {{ record.SSID }}
              </a>
            </template>
            <template v-if="column.key === 'signalstregth'">
              <a class="text-xs" fixed>
                {{ record.SignalStrength }}
              </a>
            </template>
            <template v-if="column.key === 'noise'">
              <a fixed>
                {{ record.Noise }}
              </a>
            </template>
            <template v-if="column.key === 'channel'">
              <a class="text-xs" fixed>
                {{ record.Channel }}
              </a>
            </template>
            <template v-if="column.key === 'frequency'">
              <a class="text-xs" fixed>
                {{ record.OperatingFrequencyBand }}
              </a>
            </template>
            <template v-if="column.key === 'bandwidth'">
              <a class="text-xs" fixed>
                {{ record.OperatingChannelBandwidth }}
              </a>
            </template>
          </template>
        </a-table>
      </section>
    </div>
  </main>
</template>

<script>
export default {
  props: {
    columns: Array,
    data: Array
  }
}
</script>
