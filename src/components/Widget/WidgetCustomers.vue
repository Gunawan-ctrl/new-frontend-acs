<template>
  <main class="shadow-sm rounded-md">
    <section>
      <div class="h-1.5 rounded-t-md bg-lightGreen-2"></div>
    </section>
    <section>
      <div class="w-full rounded-b-md bg-white px-8 py-2">
        <div class="flex flex-row justify-between items-center">
          <h1 class="font-normal text-gray-400 uppercase">Users</h1>
        </div>
        <div class="py-1 flex flex-row items-center justify-between">
          <div class="flex flex-col gap-1">
            <h1 class="text-xs text-gray-400">Admin</h1>
            <div>
              <a-tag color="orange">{{ countAdmin }}</a-tag>
            </div>
          </div>
          <a-divider type="vertical" class="border-slate-300 h-10" />
          <div class="flex flex-col gap-1">
            <h1 class="text-xs text-gray-400">Customer</h1>
            <div>
              <a-tag color="green">{{ countCustomer }}</a-tag>
            </div>
          </div>
          <a-divider type="vertical" class="border-slate-300 h-10" />
          <div class="flex flex-col gap-1">
            <h1 class="text-xs text-gray-400">Monitoring</h1>
            <div>
              <a-tag color="blue">{{ countMonitoring }}</a-tag>
            </div>
          </div>

          <a-divider type="vertical" class="border-slate-300 h-10" />
          <div class="flex flex-col gap-1">
            <h1 class="text-xs text-gray-400">Super Admin</h1>
            <div>
              <a-tag color="red">{{ countSU }}</a-tag>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>
<script>
import { number } from 'echarts'
export default {
  props: { countAdmin: Number, countCustomer: Number, countMonitoring: Number, countSU: number }
}
</script>
