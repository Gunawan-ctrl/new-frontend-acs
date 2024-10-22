<template>
  <main>
    <div class="flex flex-col gap-4">
      <section>
        <EthInformation />
      </section>
      <section>
        <LanInformation />
      </section>
    </div>
  </main>
</template>

<script>
import EthInformation from '../Card/EthInformation.vue'
import LanInformation from '../Card/LanInformation.vue'

export default {
  components: {
    EthInformation,
    LanInformation
  },
  data: () => ({
    idDevice: null,
    dataDetail: null
  })
}
</script>
