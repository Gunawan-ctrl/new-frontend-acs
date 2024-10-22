<template>
  <div class="shadow-sm rounded-md">
    <div class="h-1.5 rounded-t-md bg-lightGreen-2"></div>
    <div class="w-full rounded-b-md bg-white px-8 py-2">
      <section>
        <div class="flex flex-row justify-between items-center">
          <h1 class="font-medium text-gray-400 uppercase">Stats</h1>
        </div>
      </section>
      <section>
        <div class="py-1 flex flex-row items-center justify-between">
          <div class="flex flex-row items-center gap-x-4">
            <div class="flex flex-col gap-y-0.5">
              <h1 class="uppercase font-light text-lightGreen-2">online</h1>
              <div>
                <a-tooltip color="#F5F5F7" placement="bottom">
                  <template #title>
                    <h1 class="text-gray-800 capitalize">filter online devices</h1>
                  </template>
                  <a-button
                    class="bg-[#13DEB9] hover:bg-[#13DEB9] border-[#13DEB9] active:ring-2 !text-white"
                    :class="
                      btnDisabled == true ? '!text-[#13DEB9] hover:!text-white' : '!text-white'
                    "
                    size="small"
                    :disabled="btnDisabled"
                    @click="onOnline"
                  >
                    {{ onlineCount }}
                  </a-button>
                </a-tooltip>
              </div>
            </div>
          </div>
          <a-divider type="vertical" class="h-10 border-slate-300" />
          <div class="flex flex-row items-center gap-x-4">
            <div class="flex flex-col gap-y-0.5">
              <h1 class="uppercase font-light text-lightRed-2">offline</h1>
              <div>
                <a-tooltip color="#F5F5F7" placement="bottom">
                  <template #title>
                    <h1 class="text-gray-800 capitalize">filter offline devices</h1>
                  </template>
                  <a-button
                    class="bg-[#FA9377] hover:bg-[#FA9377] border-[#FA9377] active:ring-2 !text-white"
                    :class="
                      btnDisabled == true ? '!text-[#FA9377] hover:!text-white' : '!text-white'
                    "
                    size="small"
                    :disabled="btnDisabled"
                    @click="onOffline"
                  >
                    {{ offlineCount }}
                  </a-button>
                </a-tooltip>
              </div>
            </div>
          </div>
          <a-divider type="vertical" class="h-10 border-slate-300" />
          <div class="flex flex-row items-center gap-x-4">
            <div class="flex flex-col gap-y-0.5">
              <h1 class="uppercase font-light text-[#FABC3F]">Alert</h1>
              <div>
                <a-tooltip color="#F5F5F7" placement="bottom">
                  <template #title>
                    <h1 class="text-gray-800 capitalize">filter alert devices</h1>
                  </template>
                  <a-button
                    class="bg-[#FABC3F] hover:bg-[#FABC3F] border-[#FABC3F] active:ring-2 !text-white"
                    :class="
                      btnDisabled == true ? '!text-[#FABC3F] hover:!text-white' : '!text-white'
                    "
                    size="small"
                    :disabled="btnDisabled"
                    @click="onAlert"
                  >
                    {{ alertCount }}
                  </a-button>
                </a-tooltip>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
export default {
  props: { onlineCount: Number, offlineCount: Number, alertCount: Number, btnDisabled: Boolean },
  methods: {
    onOnline() {
      this.$emit('onOnline')
    },
    onOffline() {
      this.$emit('onOffline')
    },
    onAlert() {
      this.$emit('onAlert')
    }
  }
}
</script>
