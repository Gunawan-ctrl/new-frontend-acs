<template>
  <main class="w-full min-h-screen rounded-md p-4">
    <SpinLoading :loading="isLoading" />
    <div class="flex flex-col gap-4">
      <section>
        <div class="shadow-sm">
          <TabPanel @onTab="onTab" :tabProps="tabData" />
        </div>
        <InterfaceContainer @onGetData="onGetData" :isLoading="isLoading" />
      </section>
      <section v-if="tabPanelValue === 'Overview'">
        <OverviewContainer />
      </section>
      <section v-if="tabPanelValue === 'WAN'">
        <section>
          <WanContainer />
        </section>
      </section>
      <section v-if="tabPanelValue === 'LAN'">
        <LanContainer />
      </section>
      <section v-if="tabPanelValue === 'WiFi'">
        <WiFiContainer />
      </section>
    </div>
  </main>
</template>

<script>
import TabPanel from '@/components/Tab/TabPanel.vue'
import InterfaceContainer from '@/components/Container/InterfaceContainer.vue'
import WanContainer from '@/components/Container/WanContainer.vue'
import LanContainer from '@/components/Container/LanContainer.vue'
import WiFiContainer from '@/components/Container/WiFiContainer.vue'
import OverviewContainer from '@/components/Container/OverviewContainer.vue'
import { taskGenie } from '@/boot/hooks'
import { message } from 'ant-design-vue'
import SpinLoading from '@/components/Spin/SpinLoading.vue'

export default {
  components: {
    TabPanel,
    InterfaceContainer,
    WanContainer,
    LanContainer,
    WiFiContainer,
    OverviewContainer,
    SpinLoading
  },
  data: () => ({
    isLoading: false,
    tabPanelValue: 'Overview',
    tabData: [
      { name: 'Overview' },
      { name: 'WAN' },
      { name: 'LAN' },
      { name: 'WiFi' },
      { name: 'Tools' }
    ]
  }),
  methods: {
    onTab(item) {
      this.tabPanelValue = item
    },
    async onGetData(id) {
      this.isLoading = true
      await taskGenie(id, '{"name": "getParameterValues", "parameterNames": ["VirtualParameters"]}')
        .then(async (res) => {
          if (res.status == 200) {
            this.isLoading = false
            message.success('update success').then(() => {
              window.location.reload()
            })
          } else {
            message.error('task faulted')
          }
        })
        .catch((e) => {
          console.log(e)
          message.error('fault')
          this.isLoading = false
        })
        .finally(() => (this.isLoading = false))
    }
  }
}
</script>
