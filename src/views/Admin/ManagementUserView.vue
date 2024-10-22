<template>
  <main class="w-full p-4">
    <div class="min-h-screen bg-white shadow-sm rounded-md">
      <section>
        <TabPanel :tabProps="tabData" @onTab="onTab" />
      </section>
      <div>
        <section v-if="tabValue === 'list users'">
          <div class="lg:px-4 px-2">
            <ListUserContainer />
          </div>
        </section>
        <section v-if="tabValue === 'list networks'">
          <div class="lg:px-4 px-2">
            <NetworkContainer />
          </div>
        </section>
        <section v-if="tabValue === 'list regions'">
          <div class="lg:px-4 px-2">
            <RegionContainer />
          </div>
        </section>
      </div>
    </div>
  </main>
</template>

<script>
import TabPanel from '@/components/Tab/TabPanel.vue'
import ListUserContainer from '@/components/Container/ListUserContainer.vue'
import NetworkContainer from '@/components/Container/NetworkContainer.vue'
import RegionContainer from '@/components/Container/RegionContainer.vue'

export default {
  components: {
    TabPanel,

    NetworkContainer,
    ListUserContainer,
    RegionContainer
  },
  data: () => ({
    tabValue: 'list users',
    tabData: [{ name: 'list users' }, { name: 'list networks' }, { name: 'list regions' }]
  }),
  methods: {
    onTab(value) {
      this.tabValue = value
    }
  }
}
</script>
