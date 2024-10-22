<template>
  <main>
    <a-modal :open="open" @cancel="onCancel" :title="false" :footer="false">
      <section>
        <h1 class="font-semibold">Form Regions</h1>
      </section>
      <section>
        <a-form layout="vertical">
          <a-form-item name="name" class="mb-0 mt-2">
            <h1>Name</h1>
            <a-input :value="name" @change="onName($event.target.value)" />
          </a-form-item>
          <a-form-item class="my-2 flex flex-row items-center justify-end">
            <a-button size="small" type="primary" @click="createRegion">Submit</a-button>
          </a-form-item>
        </a-form>
      </section>
    </a-modal>
  </main>
</template>
<script>
export default {
  props: { open: Boolean, name: String },
  methods: {
    onCancel() {
      this.$emit('onCancel')
    },
    onName(value) {
      this.$emit('onName', value)
    },
    createRegion() {
      this.$emit('createRegion')
    }
  }
}
</script>
