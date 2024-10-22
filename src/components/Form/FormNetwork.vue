<template>
  <main>
    <a-modal :open="open" @cancel="onCancel" :title="false" :footer="false">
      <section>
        <h1 class="font-semibold">Form Network</h1>
      </section>
      <a-form layout="vertical">
        <a-form-item name="name" class="mb-0 mt-2">
          <h1>Name</h1>
          <a-input :value="name" @change="onName($event.target.value)" />
        </a-form-item>
        <a-form-item name="name" class="mb-0 mt-2">
          <h1>Region</h1>
          <a-select
            allowClear
            :value="region_id"
            :filter-option="false"
            :options="dataRegion?.map((item) => ({ value: item?.id, label: item?.name }))"
            @select="onSelectRegion"
          />
        </a-form-item>
        <a-form-item class="my-2 flex flex-row items-center justify-end">
          <a-button size="small" type="primary" @click="createNetwork">Submit</a-button>
        </a-form-item>
      </a-form>
    </a-modal>
  </main>
</template>

<script>
export default {
  props: { open: Boolean, name: String, dataRegion: Array, region_id: String },
  components: {},
  data: () => ({
    isLoading: false
  }),
  methods: {
    onCancel() {
      this.$emit('onCancel')
    },
    async createNetwork() {
      this.$emit('createNetwork')
    },
    async editNetwork() {
      this.$emit('editNetwork')
    },
    onSelectRegion(value) {
      this.$emit('onSelectRegion', value)
    },
    onName(value) {
      this.$emit('onName', value)
    },
    onRegion(value) {
      this.$emit('onRegion', value)
    }
  },
  mounted() {}
}
</script>
