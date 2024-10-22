<template>
  <main>
    <section id="header__sidebar">
      <div class="p-8 flex flex-row items-center gap-x-4">
        <div class="bg-slate-200 w-fit h-fit p-2 rounded-full">
          <img :src="srcIcon" class="w-10" />
        </div>
        <div>
          <h1 class="font-semibold text-lg">{{ localData?.username }}</h1>
          <p class="text-slate-400">{{ localData?.role_name }}</p>
        </div>
      </div>
    </section>
    <a-divider class="mt-4" />
    <section>
      <a-menu mode="inline" style="width: 260px">
        <section>
          <div class="px-6 flex flex-col gap-y-2">
            <div
              @click="onPush"
              class="flex flex-row items-center gap-x-3 cursor-pointer px-2 py-3"
              :class="activeKey === 'dashboard-admin' ? 'bg-lightBlue-1 rounded-md' : 'bg-white'"
            >
              <font-awesome-icon icon="house" />
              <h1 class="capitalize">dashboard</h1>
            </div>
            <div class="flex flex-row items-center gap-x-3 cursor-pointer px-2 py-3">
              <font-awesome-icon icon="map-location-dot" size="lg" />
              <h1 class="capitalize">regions</h1>
            </div>
            <div>
              <a-input-search
                v-model:value="value.search"
                size="small"
                allow-clear
                placeholder="search "
                @input="onSearch"
              >
                <template #enterButton>
                  <font-awesome-icon icon="magnifying-glass" />
                </template>
              </a-input-search>
            </div>
          </div>
        </section>

        <section>
          <div class="py-4 px-4 cursor-pointer">
            <a-collapse
              v-model:activeKey="value.collapse"
              accordion
              class="lg:max-h-96 overflow-y-auto"
              expand-icon-position="end"
              :bordered="false"
            >
              <a-collapse-panel v-for="(item, i) in filteredRegions" :key="i">
                <template #header>
                  <div class="flex flex-row items-center gap-x-3">
                    <font-awesome-icon
                      icon="location-dot"
                      :class="
                        item.regions.name.toLowerCase().includes(value.search.toLowerCase())
                          ? 'text-gray-400'
                          : 'text-lightBlue-2'
                      "
                      class="text-gray-400"
                    />
                    <h1
                      :class="
                        item.regions.name.toLowerCase().includes(value.search.toLowerCase())
                          ? 'text-gray-400'
                          : 'text-lightBlue-2'
                      "
                      class="capitalize font-semibold text-gray-400"
                    >
                      {{ item.regions.name }}
                    </h1>
                  </div>
                </template>
                <a-list v-if="item.networks && item.networks.length" size="small">
                  <a-list-item
                    v-for="network in item.networks"
                    :key="network.id"
                    :class="
                      activeKey === network.id ? 'bg-blue-200 text-white rounded-md shadow-md' : ''
                    "
                    class="hover:bg-blue-100 hover:rounded-md my-1 active:text-blue-700"
                    @click="onChangeNet(network)"
                  >
                    {{ network.name }}
                  </a-list-item>
                </a-list>
                <p v-else>No networks available</p>
              </a-collapse-panel>
              <div
                v-if="pagination.limit < pagination.count"
                class="py-2 flex flex-row items-center justify-center"
              >
                <a-button type="text" class="text-lightBlue-2" @click="onLoadMoreReg"
                  >load more</a-button
                >
              </div>
            </a-collapse>
          </div>
        </section>
      </a-menu>
    </section>
  </main>
</template>

<script>
import { getMe } from '@/boot/hooks'

export default {
  data: () => ({
    srcIcon: JSON.parse(localStorage.getItem('icon')),
    localData: JSON.parse(localStorage.getItem('dataUser')),
    activeKey: null,
    netId: null,
    value: {
      collapse: [0],
      search: ''
    },
    pagination: {
      limit: 8,
      page: 1,
      count: 0
    },
    data: {
      regions: [],
      local: JSON.parse(localStorage.getItem('dataUser'))
    }
  }),

  methods: {
    async getDataRegion() {
      if (this.data.local.role_name == 'admin') this.activeKey = 'dashboard-admin'
      await getMe(this.pagination.limit, this.pagination.page).then((res) => {
        this.data.regions = res.data.data.networks
        this.pagination.count = res.data.meta.count
        this.activeKey = this.$route.params.id
      })
    },
    onLoadMoreReg() {
      this.pagination.limit += 2
      this.getDataRegion()
    },
    onPush() {
      this.activeKey = 'dashboard-admin'
      this.$router.push({ name: this.activeKey })
    },
    onChangeNet(item) {
      this.activeKey = item.id
      this.netId = item.name
      if (this.data.local.role_name == 'admin')
        this.$router.push({ name: 'network-admin', params: { id: item.id } })
      else
        this.$router.push({
          name: 'network',
          params: {
            id: this.activeKey
          }
        })
    },
    onSearch() {}
  },
  mounted() {
    this.getDataRegion()
  },
  computed: {
    filteredRegions() {
      if (!this.value.search) {
        return this.data.regions
      }
      const query = this.value.search.toLowerCase()
      let filtered = this.data.regions.filter((region) => {
        return (
          region.networks &&
          region.networks.some((network) => network.name.toLowerCase().includes(query))
        )
      })
      if (filtered.length === 0) {
        filtered = this.data.regions.filter((region) =>
          region.regions.name.toLowerCase().includes(query)
        )
      }
      return filtered
    }
  }
}
</script>
