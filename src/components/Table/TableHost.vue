<template>
  <main class="bg-white shadow-sm rounded-md">
    <div class="p-4">
      <section>
        <h1 class="capitalize font-medium pb-2">device connected</h1>
      </section>
      <section>
        <a-table
          size="small"
          rowKey="id"
          :scroll="{ y: 400 }"
          :columns="columns"
          :data-source="data"
          :pagination="false"
        >
          <template #headerCell="{ column }">
            <a fixed>{{ column.title }}</a>
          </template>
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'hostName'">
              <a fixed>
                {{ record?.HostName }}
              </a>
            </template>
            <template v-if="column.key === 'ipAddr'">
              <a fixed :class="record?.IPAddress ? 'text-black' : 'text-slate-400'">
                {{ record?.IPAddress ? record?.IPAddress : 'blank' }}
              </a>
            </template>
            <template v-if="column.key === 'macAddr'">
              <a fixed>
                {{ record?.MACAddress }}
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
