<template>
  <main class="bg-white px-4 pt-2 rounded-t-md">
    <section>
      <a-tabs
        :activeKey="activeKey"
        @change="onTab"
        size="small"
        class="text-xs font-medium capitalize"
      >
        <a-tab-pane
          force-render
          v-for="item in tabProps"
          :key="item.name ? item.name : item.ssidNumber"
          :tab="item.name ? `${item.name}` : `SSID ${item.ssidNumber}`"
          :disabled="item.name == 'Tools' ? true : false"
        />
      </a-tabs>
    </section>
  </main>
</template>

<script>
export default {
  props: { tabProps: Array, activeKey: String, classTabPanel: String, count: Number },
  methods: {
    onTab(item) {
      this.$emit('onTab', item)
    }
  }
}
</script>
