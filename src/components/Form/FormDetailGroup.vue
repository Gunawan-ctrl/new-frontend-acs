<template>
  <main>
    <a-modal :open="open" @cancel="onCancel" :title="false" :footer="false">
      <section>
        <h1 class="font-semibold pb-2">Data Detail Group User</h1>
      </section>
      <section>
        <a-table
          size="small"
          rowKey="id"
          :scroll="{ x: 'max-content', y: 400 }"
          :columns="columns"
          :data-source="data"
        >
          <template #headerCell="{ column }">
            <a fixed>{{ column.title }}</a>
          </template>
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'username'">
              <a fixed>
                {{ record.username }}
              </a>
            </template>
            <template v-if="column.key === 'roleName'">
              <a-tag color="green" fixed>
                {{ record.roles.name }}
              </a-tag>
            </template>
            <template v-if="column.key === 'status'">
              <a color="green" fixed>
                {{ record.status === true ? 'active' : 'inactive' }}
              </a>
            </template>
          </template>
        </a-table>
      </section>
    </a-modal>
  </main>
</template>
<script>
export default {
  props: { open: Boolean, data: Array },
  data: () => ({
    columns: [
      {
        title: 'Username',
        dataIndex: 'username',
        key: 'username'
      },
      {
        title: 'Role Name',
        dataIndex: 'roleName',
        key: 'roleName'
      },
      {
        title: 'Status',
        dataIndex: 'status',
        key: 'status'
      }
    ]
  }),
  methods: {
    onCancel() {
      this.$emit('onCancel')
    }
  }
}
</script>
