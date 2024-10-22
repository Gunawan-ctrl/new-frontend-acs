<template>
  <main>
    <a-modal :title="false" :open="open" :footer="false" @cancel="onCancel" :closable="false">
      <section>
        <div class="flex flex-row items-center justify-between">
          <h1>{{ title }}</h1>
        </div>
      </section>
      <section>
        <a-form layout="vertical" class="">
          <a-form-item class="mb-0 mt-2">
            <a-input size="small" :value="value" @change="onInput($event.target.value)" />
          </a-form-item>
          <a-form-item class="my-2 flex flex-row justify-end items-end">
            <a-button size="small" type="primary" :loading="isLoading" @click="onSubmit"
              >{{ isLoading == false ? 'confirm' : 'loading' }}
            </a-button>
          </a-form-item>
        </a-form>
      </section>
    </a-modal>
  </main>
</template>
<script>
export default {
  props: { title: String, open: Boolean, value: String, isLoading: Boolean },

  methods: {
    onCancel() {
      this.$emit('onCancel')
    },
    onInput(value) {
      this.$emit('onInput', value)
    },
    onSubmit() {
      this.$emit('onSubmit')
    }
  }
}
</script>
