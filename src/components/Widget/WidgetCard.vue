<template>
  <main :class="bgClass" class="p-[1.5px] rounded-md">
    <div
      class="h-full w-full bg-white/20 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-50 saturate-100 backdrop-contrast-100 rounded-md"
    >
      <div class="py-2.5 px-2">
        <div class="flex flex-row items-center justify-between gap-1">
          <div class="">
            <img :src="icon" class="w-12" alt="" />
          </div>
          <a-divider type="vertical" class="border-slate-300 h-10" />
          <a-statistic :value="value" :value-style="{ color: '#fff' }">
            <template #title>
              <a-tooltip color="white">
                <template #title>
                  <div class="flex flex-row items-start gap-0.5">
                    <i class="bx bx-info-circle text-orange-600"></i>
                    <small class="text-gray-700">{{ desc }}</small>
                  </div>
                </template>
                <div class="flex flex-row gap-1 items-center cursor-pointer">
                  <h1 class="font-normal uppercase text-white">{{ title }}</h1>
                  <i class="bx bx-info-circle text-orange-600"></i>
                </div>
              </a-tooltip>
            </template>
          </a-statistic>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
export default {
  props: {
    title: String,
    icon: String,
    desc: String,
    value: Number,
    bgClass: String,
    txClass: String,
    classHeader: String
  }
}
</script>

<style></style>
