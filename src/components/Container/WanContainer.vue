<template>
  <main>
    <div class="flex flex-col gap-4">
      <!-- <section>
        <div class="">
          <a-radio-group v-model:value="ipvalue" button-style="solid" size="small">
            <a-radio-button value="a">IPv4</a-radio-button>
            <a-radio-button value="b">IPv6</a-radio-button>
          </a-radio-group>
        </div>
      </section> -->
      <section>
        <div class="flex flex-row lg:flex-nowrap flex-wrap gap-3 justify-between">
          <div class="lg:w-1/2 w-full">
            <WanInformation />
          </div>
          <div class="lg:w-1/2 w-full">
            <TableWanStats />
          </div>
        </div>
      </section>
    </div>
  </main>
</template>

<script>
import WanInformation from '../Card/WanInformation.vue'
import TableWanStats from '../Table/TableWanStats.vue'

export default {
  components: {
    WanInformation,
    TableWanStats
  },
  data: () => ({
    bandwith: 'a',
    ipvalue: 'a'
  })
}
</script>
