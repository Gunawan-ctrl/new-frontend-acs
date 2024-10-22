<template>
  <a-layout class="min-h-screen" id="layout-dashboard">
    <a-layout-sider
      style="background: #fff; position: fixed"
      width="260px"
      class="shadow-sm z-50 fixed lg:block min-h-screen"
      :class="isOpen == true ? 'block' : 'hidden'"
    >
      <section>
        <SubMenu />
      </section>
      <section>
        <div class="absolute bottom-3">
          <div class="px-6">
            <h1 class="text-gray-400 font-thin text-xs">NetControl v {{ version }}</h1>
          </div>
        </div>
      </section>
    </a-layout-sider>
    <section id="header" class="fixed z-30 w-full lg:pl-[18rem] md:px-6 lg:px-7 px-5">
      <div class="backdrop-blur-3xl bg-white/20 h-16">
        <div class="rounded-md sticky bg-white py-2 shadow-sm top-4">
          <div class="flex flex-row items-center justify-between">
            <section id="breadcrumb ">
              <div class="flex flex-row items-center gap-x-6 pl-4">
                <div class="border border-gray-200 px-2 py-1 rounded-md" v-if="path.meta.icon">
                  <a-breadcrumb separator="" class="px-0">
                    <a-breadcrumb-item class="text-disable">
                      <font-awesome-icon :icon="path.meta?.icon" />
                    </a-breadcrumb-item>
                  </a-breadcrumb>
                </div>
                <div class="flex flex-col capitalize">
                  <a-breadcrumb separator="/" class="px-0 text-xs">
                    <a-breadcrumb-item>{{ path.meta.title }}</a-breadcrumb-item>
                    <a-breadcrumb-item class="text-disable" v-if="path.meta.breadcrumb">
                      {{ regionName ? regionName : path.meta.breadcrumb }}
                    </a-breadcrumb-item>
                  </a-breadcrumb>
                  <a-breadcrumb separator="" class="px-0">
                    <a-breadcrumb-item
                      class="text-disable font-semibold uppercase text-xs"
                      v-if="path.meta.breadcrumb"
                    >
                      {{ netName ? netName : path.meta.breadcrumb }}
                    </a-breadcrumb-item>
                  </a-breadcrumb>
                </div>
              </div>
            </section>
            <section id="btn">
              <div class="flex flex-row items-center justify-end gap-x-5 pr-4">
                <a-button class="border-none lg:hidden block" @click="onOpenSidebar">
                  <font-awesome-icon icon="bars" size="sm" v-if="isOpen == false" />
                  <font-awesome-icon icon="xmark" size="sm" v-if="isOpen == true" />
                </a-button>
                <a-popconfirm
                  placement="leftBottom"
                  title="Are you sure you want to log out?"
                  ok-text="Yes"
                  cancel-text="No"
                  @confirm="logout"
                >
                  <a-button type="text" size="small">
                    <font-awesome-icon icon="right-from-bracket" size="lg" />
                  </a-button>
                </a-popconfirm>
              </div>
            </section>
          </div>
        </div>
      </div>
    </section>
    <a-layout>
      <a-layout-content
        @click="onCloseSidebar"
        class="pt-[70px] pb-8 lg:pl-[17rem] lg:pr-3 px-2 min-h-screen bg-background"
      >
        <router-view />
      </a-layout-content>
      <div class="w-full h-12 relative bottom-0 bg-background">
        <div class="lg:pl-72 lg:pr-8 lg:text-left text-center">
          <p class="text-gray-400">
            Copyright ⓒ
            <a href="" class="font-medium text-gray-400">NetControl Dashboard</a>
          </p>
        </div>
      </div>
    </a-layout>
  </a-layout>
</template>
<script>
import { getDetailNetwork } from '@/boot/hooks'
import SubMenu from '@/components/SubMenu/superadmin/SubMenu.vue'

export default {
  components: { SubMenu },
  data: () => ({
    path: null,
    localData: null,
    isOpen: false,
    netName: null,
    regionName: null,
    version: __APP_VERSION__
  }),
  methods: {
    async getDetaillNet() {
      await getDetailNetwork(this.$route.params.id).then((res) => {
        this.netName = res.data?.data?.networks[0]?.name
        this.regionName = res.data.data.regions.name
      })
    },
    onOpenSidebar() {
      this.isOpen = !this.isOpen
    },
    onCloseSidebar() {
      this.isOpen = false
    },
    logout() {
      localStorage.clear()
      this.$router.push({ name: 'login' })
    }
  },
  mounted() {},
  unmount() {
    getDetailNetwork()
  },
  watch: {
    $route: {
      immediate: true,
      handler() {
        this.path = this.$route
        if (this.path.name == 'device-network') this.getDetaillNet()
        else {
          this.regionName = null
          this.netName = null
        }
      }
    }
  }
}
</script>
