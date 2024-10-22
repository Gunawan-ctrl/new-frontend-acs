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
    <section
      id="menu__network"
      :class="
        show.network
          ? 'transition-opacity duration-0 ease-in opacity-100'
          : 'transition-opacity duration-500 ease-out opacity-0'
      "
    >
      <div class="absolute top-56 left-7 z-50">
        <div class="w-60 bg-white border border-slate-200 z-50 rounded-md shadow-lg py-2">
          <div class="py-2">
            <h1 class="px-4 capitalize">list network</h1>
          </div>
          <hr />
          <div class="h-44 overflow-scroll" @scroll="onScroll">
            <div v-for="region in filteredRegions" :key="region.regions.id" class="mb-4">
              <h2
                class="px-3 pb-1 font-semibold capitalize text-gray-400"
                v-if="region.networks != null"
              >
                {{ region.regions.name }}
              </h2>
              <div
                v-for="network in region.networks"
                :key="network.id"
                class="flex flex-col gap-y-1"
              >
                <div @click="onChangeNet(network)">
                  <div class="hover:bg-lightBlue-1 mx-1 rounded-md">
                    <h1 class="px-4 py-1 capitalize cursor-pointer">
                      {{ network.name }}
                    </h1>
                  </div>
                  <a-divider class="my-1" />
                </div>
              </div>
            </div>

            <div v-for="item in array?.network" :key="item" class="flex flex-col gap-y-2">
              <div @click="onChangeNet(item)">
                <div class="hover:bg-lightBlue-1 m-1 rounded-md">
                  <h1 class="px-4 py-1 capitalize cursor-pointer">
                    {{ item.name }}
                  </h1>
                </div>
                <a-divider class="my-1" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section id="menu__sidebar">
      <a-menu mode="inline" style="width: 260px">
        <section>
          <div class="px-6">
            <div class="flex flex-row items-center gap-x-3 cursor-pointer pb-4">
              <font-awesome-icon icon="code-fork" flip="vertical" />
              <h1 class="capitalize">network</h1>
            </div>
            <div>
              <a-input-search
                size="small"
                :placeholder="netId"
                v-model:value="valueSearch"
                @change="onSearch(valueSearch)"
                @focus="onFocusSearch"
                @blur="onBlurNet"
              />
            </div>
          </div>
        </section>
        <section>
          <div class="py-4 px-6 cursor-pointer">
            <div class="flex flex-row items-center justify-between">
              <div class="flex flex-row items-center gap-x-2" @click="onShowList">
                <font-awesome-icon icon="server" size="sm" />
                <h1 class="capitalize">devices</h1>
              </div>
              <div class="flex flex-row items-center gap-x-2">
                <a-dropdown>
                  <template #overlay>
                    <a-menu @click="onFilterDevice">
                      <a-menu-item v-for="item in array?.manufacturer" :key="item">{{
                        item == 'ALCL' ? 'Nokia' : item
                      }}</a-menu-item>
                      <a-menu-item :key="null">clear filter</a-menu-item>
                    </a-menu>
                  </template>
                  <a-button type="text" size="small">
                    <font-awesome-icon class="hover:rotate-12" icon="filter" size="sm" />
                  </a-button>
                </a-dropdown>
                <a-dropdown>
                  <template #overlay>
                    <a-menu @click="onChangeMenu">
                      <a-menu-item key="1">Show Tags</a-menu-item>
                      <a-menu-item key="2">Show SN</a-menu-item>
                      <a-menu-item key="3">Only Tags</a-menu-item>
                    </a-menu>
                  </template>
                  <a-button type="text" size="small">
                    <font-awesome-icon class="hover:rotate-12" icon="gears" size="sm" />
                  </a-button>
                </a-dropdown>
                <a-button type="text" size="small" @click="onShowList">
                  <font-awesome-icon :icon="!show.list ? 'angle-up' : 'angle-down'" />
                </a-button>
              </div>
            </div>
          </div>
          <div
            v-if="array.device"
            class="cursor-pointer"
            :class="!show.list ? 'block transition-opacity' : 'hidden transition-opacity'"
          >
            <a-list
              size="small"
              :data-source="array?.device"
              class="overflow-y-auto lg:h-[400px] md:h-[480px] h-72"
            >
              <template #renderItem="{ item }">
                <a-list-item
                  @click="onPush(item?.serial_number)"
                  :class="[
                    styleListMenu().classHover,
                    item?.serial_number === activeKey
                      ? styleListMenu().classActive
                      : styleListMenu().classInactive
                  ]"
                >
                  <div class="px-5 flex flex-row gap-x-1 items-center">
                    <div
                      :class="[
                        styleListMenu().classBorderIcon,
                        item?.serial_number === activeKey
                          ? styleListMenu().classActive
                          : styleListMenu().classInactive
                      ]"
                    >
                      <font-awesome-icon icon="server" />
                    </div>
                    <div :class="styleListMenu().classContainer">
                      <div class="px-2 w-[85px]">
                        <div
                          class="rounded-md border"
                          :class="
                            item?.serial_number === activeKey
                              ? styleListMenu().classActive
                              : styleListMenu().classInactive
                          "
                        >
                          <div class="px-2 py-0.5 flex flex-row gap-x-2 justify-start items-center">
                            <h1
                              class="text-xs font-semibold truncate capitalize"
                              :class="[
                                item?.serial_number === activeKey
                                  ? styleListMenu().classTextTag
                                  : ''
                              ]"
                            >
                              {{ item?.tags ? item?.tags : 'no tags' }}
                            </h1>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h1
                          class="text-[11px] px-3"
                          :class="[
                            optMenuValue == '3' ? styleListMenu().classTextSn : '',
                            item?.serial_number === activeKey ? styleListMenu().classTextSn : ''
                          ]"
                        >
                          {{ item?.serial_number }}
                        </h1>
                      </div>
                    </div>
                  </div>
                </a-list-item>
                <div
                  :class="
                    item?.serial_number === activeKey ? styleListMenu().classBorder : 'bg-white'
                  "
                ></div>
              </template>
              <div class="flex flex-row justify-center py-1">
                <a-button
                  class="capitalize"
                  size="small"
                  type="text"
                  :hidden="pagination.limitDevice >= pagination.countDevice"
                  @click="onLoadMore"
                >
                  load more
                </a-button>
              </div>
            </a-list>
          </div>
          <div v-else class="flex flex-row items-center justify-center py-8">
            <h1 class="capitalize font-bold text-gray-400">no device</h1>
          </div>
        </section>
      </a-menu>
    </section>
  </main>
</template>
<script>
import { getDeviceNetWorks, getMe } from '@/boot/hooks'
export default {
  data: () => ({
    srcIcon: JSON.parse(localStorage.getItem('icon')),
    localData: JSON.parse(localStorage.getItem('dataUser')),
    netId: null,
    user_id: null,
    optMenuValue: '1',
    valueSearch: '',
    activeKey: null,
    filterDevice: null,
    show: {
      list: false,
      network: false
    },
    array: {
      manufacturer: [],
      device: [],
      network: [],
      regions: []
    },
    // regionName: null,
    pagination: {
      limitDevice: 5,
      countDevice: null,
      limitMe: 5,
      pageMe: 1
    }
  }),
  methods: {
    styleListMenu() {
      switch (this.optMenuValue) {
        case '1':
          return {
            classHover: 'hover:bg-lightGreen-1 ',
            classActive: 'bg-lightGreen-1 text-lightGreen-2 border-lightGreen-2  ',
            classInactive: 'bg-white text-[#131842]',
            classTextTag: 'text-lightGreen-2',
            classTextSn: 'text-lightGreen-2',
            classBorder: 'w-full h-[3px] bg-lightGreen-2',
            classContainer: 'flex flex-col',
            classBorderIcon: 'flex flex-row items-center border p-2 rounded-md'
          }
        case '2':
          return {
            classHover: 'hover:bg-lightOrange-1 ',
            classActive: 'bg-lightOrange-1 text-lightOrange-2 border-lightOrange-2  ',
            classInactive: 'bg-white text-[#131842]',
            classTextTag: 'text-lightOrange-2',
            classTextSn: 'text-lightOrange-2',
            classBorder: 'w-full h-[3px] bg-lightOrange-2',
            classContainer: 'flex flex-col-reverse',
            classBorderIcon: 'flex flex-row items-center border p-2 rounded-md'
          }
        case '3':
          return {
            classHover: 'hover:bg-lightBlue-1 ',
            classActive: 'bg-lightBlue-1 text-lightBlue-2 border-lightBlue-2  ',
            classInactive: 'bg-white text-[#131842]',
            classTextTag: 'text-lightBlue-2 ',
            classTextSn: 'hidden',
            classBorder: 'w-full h-[3px] bg-lightBlue-2',
            classContainer: 'flex flex-col-reverse'
          }
      }
    },
    async getDataMe() {
      await getMe(this.pagination.limitMe, this.pagination.pageMe).then((res) => {
        this.user_id = res.data.data.users.id
        this.array.regions = res.data.data.networks
        this.netId = this.array.regions[0].networks[0].name
        console.log(this.filteredRegions)
      })
    },

    async getDataDevice() {
      await getDeviceNetWorks(this.user_id, this.pagination.limitDevice, 1).then((res) => {
        let uniqueVendors = [...new Set(res.data?.data?.map((device) => device.vendor))]
        this.array = {
          ...this.array,
          device: res?.data?.data,
          manufacturer: uniqueVendors
        }
        this.pagination.countDevice = res?.data?.meta?.count
      })
    },
    async onSearch() {},
    onFocusSearch() {
      this.show.network = true
    },
    onBlurNet() {
      setTimeout(() => {
        this.show.network = false
      }, 450)
    },
    onShowList() {
      this.show.list = !this.show.list
    },
    async onFilterDevice(value) {
      this.filterDevice = value.key
      if (this.filterDevice === null) this.getDataDevice()
      await getDeviceNetWorks(this.user_id, this.pagination.limitDevice, 1).then((res) => {
        this.array.device = res.data.data
      })
    },
    onChangeMenu(value) {
      this.optMenuValue = value.key
    },
    onLoadMore() {
      this.pagination.limitDevice += 5
      this.getDataDevice()
    },
    onChangeNet(item) {
      this.activeKey = item?.id
      this.netId = item?.name
      this.$router.push({ name: 'networkClient', params: { id: item.id } })
    },
    onPush(serialNumb) {
      this.activeKey = serialNumb
      this.$router.push({ name: 'detail-devices-customer', params: { id: serialNumb } })
    },
    onScroll(event) {
      const element = event.target
      if (element.scrollHeight - element.scrollTop === element.clientHeight) {
        this.pagination.limitMe += 1
        this.getDataMe()
      }
    }
  },
  computed: {
    filteredRegions() {
      if (!this.valueSearch) {
        return this.array.regions
      }
      const query = this.valueSearch.toLowerCase()
      let filtered = this.array.regions.filter((region) => {
        return (
          region.networks &&
          region.networks.some((network) => network.name.toLowerCase().includes(query))
        )
      })
      if (filtered.length === 0) {
        filtered = this.array.regions.filter((region) =>
          region.regions.name.toLowerCase().includes(query)
        )
      }

      return filtered
    }
  },
  async mounted() {
    await this.getDataMe()
    if (this.user_id) {
      await this.getDataDevice()
    }
  }
}
</script>
