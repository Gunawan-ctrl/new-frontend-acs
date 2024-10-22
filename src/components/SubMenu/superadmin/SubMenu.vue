<template>
  <main>
    <section>
      <div class="p-8 flex flex-row items-center gap-x-4">
        <div class="bg-slate-300 w-fit h-fit p-2 rounded-full">
          <img :src="srcIcon" class="w-10" />
        </div>
        <div class="">
          <h1 class="font-semibold text-lg">{{ localData?.username }}</h1>
          <p class="text-slate-400">{{ localData?.role_name }}</p>
        </div>
      </div>
    </section>
    <a-divider class="mt-4" />
    <section>
      <a-menu
        :open-keys="openKeys"
        @openChange="onOpenChange"
        v-model:selectedKeys="selectedKeys"
        style="width: 260px"
        mode="inline"
      >
        <a-menu-item @click="onPush('dashboard-superadmin')" :key="'dashboard-superadmin'">
          <div class="flex flex-row items-center gap-x-2">
            <font-awesome-icon icon="house" size="sm" />
            <h1 class="capitalize">dashboard</h1>
          </div>
        </a-menu-item>
        <a-menu-item @click="onPush('management')" :key="'management'">
          <div class="flex flex-row items-center gap-x-2">
            <font-awesome-icon icon="list-check" size="sm" />
            <h1 class="capitalize">management</h1>
          </div>
        </a-menu-item>
        <a-sub-menu v-for="item in menuItem" :key="item.key">
          <template #title>
            <div class="flex flex-row items-center gap-x-2">
              <font-awesome-icon :icon="item.icon" size="sm" />
              <h1 class="capitalize">{{ item.name }}</h1>
            </div>
          </template>
          <a-menu-item
            class="capitalize"
            v-for="subItem in item.subMenuItem"
            :key="subItem.key"
            @click="onPush(subItem.directName)"
          >
            {{ subItem.name }}
          </a-menu-item>
        </a-sub-menu>
      </a-menu>
    </section>
    <hr class="py-2" />
    <section>
      <div class="px-6">
        <div
          class="flex flex-row items-center justify-between cursor-pointer pb-4"
          @click="openNet"
        >
          <div class="flex flex-row items-center gap-x-1.5 px-1">
            <font-awesome-icon icon="code-fork" flip="vertical" />
            <h1 class="capitalize">networks</h1>
          </div>
        </div>
        <div>
          <a-input-search
            size="small"
            :placeholder="netId ? netId : 'search network'"
            v-model:value="valueSearch"
            @change="onSearch(valueSearch)"
            @focus="onFocusSearch"
            @blur="onBlurNet"
          />
        </div>
      </div>
    </section>
    <section>
      <div class="px-6 py-2">
        <a-collapse
          v-model:activeKey="collapseValue"
          accordion
          class="lg:max-h-96 overflow-y-auto"
          expand-icon-position="end"
          :bordered="false"
          @change="onExpand"
        >
          <!-- <template #expandIcon="{ collapseValue }">
            <font-awesome-icon :icon="collapseValue ? 'angle-down' : 'angle-up'" />
          </template> -->
          <a-collapse-panel v-for="(region, i) in arrayNet" :key="i">
            <template #header>
              <div class="flex flex-row items-center gap-x-3">
                <font-awesome-icon
                  icon="location-dot"
                  :class="region.regions.name ? 'text-gray-400' : 'text-lightBlue-2'"
                  class="text-gray-400"
                />
                <h1
                  :class="region.regions.name ? 'text-gray-400' : 'text-lightBlue-2'"
                  class="capitalize font-semibold text-gray-400"
                >
                  {{ region.regions.name }}
                </h1>
              </div>
            </template>
            <a-list v-if="region.networks && region.networks.length" size="small">
              <a-list-item
                v-for="network in region.networks"
                class="hover:bg-gray-200 hover:rounded-md my-1 cursor-pointer"
                :class="netId == network.name ? 'bg-[#E6F4FF] rounded-md' : ''"
                :key="network.id"
                @click="onChangeNet(network)"
              >
                {{ network.name }}
              </a-list-item>
            </a-list>
            <p v-else>No networks available</p>
          </a-collapse-panel>
        </a-collapse>
      </div>
    </section>
  </main>
</template>
<script>
import { getNetwork, getNewDevices } from '@/boot/hooks'
export default {
  data: () => ({
    rootSubmenuKeys: ['dashboard-superadmin', 'management', 'information', 'settings', 'devices'],
    openKeys: [''],
    selectedKeys: [''],
    collapseValue: [],
    localData: null,
    srcIcon: null,
    netId: null,
    valueSearch: null,
    arrayNet: [],
    countNet: 0,
    limitNet: 5,
    isOpenNet: false,
    menuItem: [
      {
        key: 'settings',
        name: 'settings',
        icon: 'gears',
        subMenuItem: [
          {
            key: 'session',
            name: 'session',
            directName: 'session'
          }
        ]
      },
      {
        key: 'devices',
        name: 'devices',
        icon: 'server',
        subMenuItem: [
          {
            key: 'list-device',
            name: 'list',
            directName: 'list-device'
          },
          {
            key: 'assignment',
            name: 'assignment',
            directName: 'assignment'
          },
          {
            key: 'new-devices',
            name: `new devices`,
            directName: 'new-devices'
          }
        ]
      }
    ]
  }),
  methods: {
    onPush(directName) {
      this.isOpenNet = false
      this.netId = null
      this.$router.push({ name: directName })
    },
    onOpenChange(openKeys) {
      const latestOpenKey = openKeys.find((key) => this.openKeys.indexOf(key) === -1)
      if (this.rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
        this.openKeys = openKeys
      } else {
        this.openKeys = latestOpenKey ? [latestOpenKey] : []
      }
    },
    async getData() {
      await getNetwork(this.limitNet, 1, this.valueSearch).then((res) => {
        this.arrayNet = res.data.data
        this.countNet = res.data.meta.count
      })
    },
    getDataLocal() {
      this.localData = JSON.parse(localStorage.getItem('dataUser'))
      this.srcIcon = JSON.parse(localStorage.getItem('icon'))
    },
    onFocusSearch() {
      this.isOpenNet = true
      this.openKeys = ['']
    },
    openNet() {
      this.isOpenNet = !this.isOpenNet
      this.openKeys = ['']
    },
    onBlurNet() {
      setTimeout(() => {
        this.isOpenNet = false
      }, 450) // Adjust the delay time as needed
    },
    async onSearch(value) {
      this.valueSearch = value
      this.getData()
    },

    onScroll(event) {
      const element = event.target
      if (element.scrollHeight - element.scrollTop === element.clientHeight) {
        this.limitNet += 5
        this.getData()
      }
    },
    onChangeNet(value) {
      this.netId = value.name
      this.selectedKeys = []
      this.$router.push({ name: 'device-network', params: { id: value.id } })
    },
    async getNewDevice() {
      await getNewDevices().then((res) => {
        this.menuItem[1].subMenuItem[2].name = `new device – ${res.data.meta.count}`
      })
    },
    onExpand(value) {
      this.collapseValue = value
      this.openKeys = ['']
    }
  },

  mounted() {
    this.getDataLocal()
    this.getData()
    this.getNewDevice()
  }
}
</script>
