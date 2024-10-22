<template>
  <main>
    <a-modal :open="open" title="Change Password" @cancel="onCancel" :footer="false">
      <section>
        <a-form :model="form" layout="vertical" @submit="onSubmit">
          <a-form-item
            :rules="rules.old_password"
            label="old password"
            name="old_password"
            class="mb-0 mt-2"
          >
            <a-input-password v-model:value="form.old_password" />
          </a-form-item>
          <a-form-item
            :rules="rules.new_password"
            label="new password"
            name="new_password"
            class="mb-0 mt-2"
          >
            <a-input-password v-model:value="form.new_password" />
          </a-form-item>
          <a-form-item
            label="confirm password"
            name="re_password"
            class="mb-0 mt-2"
            @change="onRePass"
          >
            <a-input-password
              v-model:value="form.re_password"
              @change="onRePass(form.re_password)"
            />
            <label class="text-red-500" :hidden="form.re_password == null ? true : false">{{
              msg
            }}</label>
          </a-form-item>
          <a-form-item class="my-2 flex flex-row items-center justify-end">
            <a-button
              size="small"
              type="primary"
              :disabled="form.old_password && form.new_password && form.re_password ? false : true"
              @click="onSubmit(form)"
              >Confirm</a-button
            >
          </a-form-item>
        </a-form>
      </section>
    </a-modal>
  </main>
</template>

<script>
import { patchPassUser } from '@/boot/hooks'
import router from '@/router'
export default {
  props: { open: Boolean },
  data: () => ({
    idUser: null,
    form: {
      old_password: null,
      new_password: null,
      re_password: null
    },
    rules: {
      old_password: [{ required: true, message: 'Please input old password!' }],
      new_password: [{ required: true, message: 'Please input new password!' }]
    },
    msg: null,
    dataRole: []
  }),
  methods: {
    onCancel() {
      this.form.old_password = null
      this.form.new_password = null
      this.form.re_password = null
      this.$emit('onCancel')
    },
    getLocalData() {
      const res = JSON.parse(localStorage.getItem('dataUser'))
      this.idUser = res.users_id
    },
    async onSubmit() {
      await patchPassUser(this.idUser, this.form)
        .then(() => {
          localStorage.clear()
          router.push({ name: 'login' })
        })
        .catch((e) => console.log(e))
    },
    onRePass(value) {
      if (value !== this.form.new_password) {
        this.msg = 'password incorect'
      } else {
        this.msg = null
      }
    }
  },
  mounted() {
    this.getLocalData()
  }
}
</script>
