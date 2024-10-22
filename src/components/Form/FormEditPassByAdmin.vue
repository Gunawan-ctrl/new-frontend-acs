<template>
  <a-modal :open="open" @cancel="onCancel" :title="'Edit Password'" :footer="false">
    <a-form layout="vertical">
      <a-form-item label="password" name="password" class="mb-0 mt-2">
        <a-input-password :value="password" @change="onChangePass($event.target.value)" />
      </a-form-item>
      <a-form-item class="my-2 flex flex-row justify-end">
        <a-button size="small" type="primary" @click="onSubmit(password)">Submit</a-button>
      </a-form-item>
    </a-form>
  </a-modal>
</template>
<script>
export default {
  props: { open: Boolean, password: String },
  methods: {
    onCancel() {
      this.$emit('onCancel')
    },
    onChangePass(value) {
      this.$emit('onChangePass', value)
    },
    async onSubmit() {
      this.$emit('onSubmit')
    }
  }
}
</script>
