<template>
  <a-layout class="min-h-screen" id="layout-dashboard">
    <section>
      <FormChangePass :open="isModalPass" @onCancel="onClosePass" />
    </section>
    <a-layout-sider
      style="background: #fff; position: fixed"
      width="260px"
      class="shadow-sm z-50 fixed lg:block min-h-screen"
      :class="isOpen == true ? 'fixed' : 'hidden'"
    >
      <section>
        <SubMenuClient />
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
            <section id="breadcrumb">
              <div class="flex flex-row items-center gap-x-6 pl-4">
                <div
                  class="border border-gray-200 px-2 py-1 rounded-md cursor-pointer"
                  v-if="path.meta.icon"
                  @click="onClickBreadCrumb"
                >
                  <a-breadcrumb separator="" class="px-0">
                    <a-breadcrumb-item class="text-disable">
                      <font-awesome-icon :icon="path.meta?.icon" />
                    </a-breadcrumb-item>
                  </a-breadcrumb>
                </div>
                <div class="flex flex-col">
                  <a-breadcrumb separator="/" class="px-0 text-xs capitalize">
                    <a-breadcrumb-item>{{ path.meta?.title }}</a-breadcrumb-item>
                    <a-breadcrumb-item class="text-disable" v-if="path.meta.breadcrumb">{{
                      regionName ? regionName : path.meta.breadcrumb
                    }}</a-breadcrumb-item>
                  </a-breadcrumb>
                  <a-breadcrumb separator="" class="px-0">
                    <a-breadcrumb-item
                      class="text-disable font-semibold uppercase text-xs"
                      v-if="path.params.id"
                    >
                      {{ networkName ? networkName : path.params.id }}
                    </a-breadcrumb-item>
                  </a-breadcrumb>
                </div>
              </div>
            </section>
            <section id="btn">
              <div class="flex flex-row items-center justify-end gap-x-5 pr-4">
                <a-button class="border-none lg:hidden block" @click="onOpenSidebar" size="small">
                  <font-awesome-icon :icon="isOpen == false ? 'bars' : 'xmark'" />
                </a-button>
                <a-dropdown>
                  <template #overlay>
                    <a-menu @click="onChangeMenuUsr" class="capitalize">
                      <a-menu-item :key="1">change password</a-menu-item>
                      <a-menu-item :key="2">log out</a-menu-item>
                    </a-menu>
                  </template>
                  <a-button type="text" size="small">
                    <font-awesome-icon icon="user" />
                  </a-button>
                </a-dropdown>
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
import { Modal } from 'ant-design-vue'
import FormChangePass from '@/components/Form/FormChangePass.vue'
import SubMenuClient from '@/components/SubMenu/customer/SubMenu.vue'
import router from '@/router'
import { getDetailNetwork } from '@/boot/hooks'

export default {
  components: {
    SubMenuClient,
    FormChangePass
  },
  data: () => ({
    path: null,
    networkName: null,
    regionName: null,
    localData: null,
    isOpen: false,
    isModalPass: false,
    version: __APP_VERSION__
  }),
  methods: {
    onOpenSidebar() {
      this.isOpen = !this.isOpen
    },
    onCloseSidebar() {
      this.isOpen = false
    },
    onChangeMenuUsr(value) {
      const key = value.key
      if (key === 1) {
        this.isModalPass = true
      } else {
        Modal.confirm({
          title: 'Logout',
          content: 'Would you like to log out ?',
          onOk() {
            localStorage.clear()
            router.push({ name: 'login' })
          }
        })
      }
    },
    onClickBreadCrumb() {
      const netIdLocal = localStorage.getItem('idDefault')
      this.$router.push({ name: 'networkClient', params: { id: netIdLocal } })
    },
    async getData() {
      await getDetailNetwork(this.$route.params.id).then((res) => {
        this.regionName = res.data.data.regions.name
        this.networkName = res.data.data.networks[0].name
        console.log(this.networkName)
      })
    },
    onClosePass() {
      this.isModalPass = false
    }
  },
  watch: {
    $route: {
      immediate: true,
      handler() {
        this.path = this.$route
        this.getData()
        this.regionName = null
      }
    }
  }
}
</script>
