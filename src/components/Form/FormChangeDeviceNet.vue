<template>
  <main>
    <section>
      <a-modal :open="open" @cancel="onCancel" title="Detail Network" :footer="false">
        <div class="border p-2 rounded-md">
          <ListContainer
            :data="dataNetwork"
            @onLoadMore="onLoadMore"
            @onSelectRadio="onSelectRadio"
          />
        </div>
        <div class="flex flex-row items-center gap-x-2 justify-end py-2">
          <a-button class="capitalize" type="primary" size="small" @click="onSubmit">
            submit
          </a-button>
        </div>
      </a-modal>
    </section>
  </main>
</template>
<script>
import { getNetwork } from '@/boot/hooks'
import ListContainer from '../Table/ListContainer.vue'
export default {
  components: { ListContainer },
  props: {
    open: Boolean,
    columns: Array,
    data: Array,
    totalItem: Number,
    currPage: Number,
    pageSize: Number
  },
  data: () => ({
    dataNetwork: [],
    deviceId: null,
    idNet: null,
    limitNet: 5
  }),
  methods: {
    onCancel() {
      this.$emit('onCancel')
    },
    onSelectRadio(value) {
      this.$emit('onSelectRadioNet', value)
    },
    async onSubmit() {
      this.$emit('onSubmit')
    },
    async getData() {
      const res = await getNetwork(this.limitNet, 1)
      this.dataNetwork = res.data.data
    },
    onLoadMore() {
      this.limitNet += 1
      this.getData()
    }
  },
  mounted() {
    this.getData()
  }
}
</script>
