<template>
  <div class="h-screen bg-white">
    <div class="grid md:grid-cols-2 items-center gap-8 h-full">
      <div class="max-md:order-1 p-4">
        <div class="lg:w-[45%] w-[60%] mx-auto">
          <img :src="randomIcon(img)" class="object-contain block" alt="login-image" />
        </div>
        <div class="flex flex-row justify-center py-3">
          <h1 class="text-gray-400 font-thin text-xs block sm:hidden">
            NetControl v {{ version }}
          </h1>
        </div>
      </div>
      <div
        class="flex items-center md:p-8 p-6 bg-white h-full sm:rounded-tl-[4rem] sm:rounded-bl-[4rem] rounded-none shadow-sm shadow-lightBlue-1"
      >
        <div class="max-w-lg w-full mx-auto">
          <div class="px-12">
            <section>
              <div class="flex flex-col gap-2 items-center justify-center mb-10">
                <div>
                  <img
                    src="/logo_gear.svg"
                    class="object-contain block w-20 h-20"
                    alt="login-image"
                  />
                </div>
                <h2 class="text-2xl font-bold text-center sm:text-3xl md:text-4xl">NetControl</h2>
              </div>
            </section>
            <section>
              <a-form :model="form" @submit="onSubmit" class="flex flex-col gap-y-1">
                <a-form-item name="identify" :rules="rules.identify">
                  <h1 class="font-semibold capitalize pb-1">username</h1>
                  <a-input v-model:value="form.identify" placeholder="username" size="large" />
                </a-form-item>
                <a-form-item name="password" :rules="rules.password">
                  <h1 class="font-semibold capitalize pb-1">password</h1>
                  <a-input-password
                    v-model:value="form.password"
                    type="password"
                    placeholder="password"
                    size="large"
                  />
                </a-form-item>
                <a-form-item>
                  <a-button :loading="loading" type="primary" html-type="submit" block>
                    SIGN IN
                  </a-button>
                  <div class="flex flex-row justify-center py-3">
                    <h1 class="text-gray-400 font-thin text-xs hidden sm:block">
                      NetControl v {{ version }}
                    </h1>
                  </div>
                </a-form-item>
              </a-form>
            </section>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { auth, getMe } from '@/boot/hooks'
import { notification } from 'ant-design-vue'
// import IconLogin from '../../components/Icon/IconLogin.vue'

export default {
  // components: { IconLogin },
  data: () => ({
    version: __APP_VERSION__,
    loading: false,
    form: {
      identify: null,
      password: null
    },
    rules: {
      identify: [{ required: true, message: 'Please input your username!' }],
      password: [{ required: true, message: 'Please input your password!' }]
    },
    icon: [
      '/svg/avatar-1.svg',
      '/svg/avatar-2.svg',
      '/svg/avatar-3.svg',
      '/svg/avatar-4.svg',
      '/svg/avatar-5.svg',
      '/svg/avatar-6.svg'
    ],
    img: [
      '/png/ilustrationNetControl1.png',
      '/png/ilustrationNetControl2.png',
      '/png/ilustrationNetControl3.png',
      '/png/ilustrationNetControl4.png',
      '/png/ilustrationNetControl5.png',
      '/png/ilustrationNetControl6.png'
    ]
  }),
  methods: {
    async onSubmit() {
      this.loading = true
      const form = {
        username: this.form.identify,
        password: this.form.password
      }
      await auth(form)
        .then(async (res) => {
          if (res.status == 201) {
            const iconTemp = this.randomIcon(this.icon)
            localStorage.setItem('dataUser', JSON.stringify(res.data.data))

            await getMe()
              .then((res) => {
                console.log('res', res)
                if (res.data.data.users.roles.name === 'super admin') {
                  this.$router.push({ name: 'dashboard-superadmin' })
                } else if (res.data.data.users.roles.name === 'admin') {
                  this.$router.push({ name: 'dashboard-admin' })
                } else if (res.data.data.users.roles.name === 'monitoring') {
                  const net = res.data.data.networks[0].networks[0]
                  localStorage.setItem('idDefault', net.id)
                  this.$router.push({ name: 'networkMonitor', params: { id: net.id } })
                } else {
                  const net = res.data.data.networks[0].networks[0]
                  localStorage.setItem('idDefault', net.id)
                  this.$router.push({ name: 'networkClient', params: { id: net.id } })
                }
                localStorage.setItem('icon', JSON.stringify(iconTemp))
              })
              .catch((e) => {
                console.log(e)
              })
          } else {
            console.log(res)
            switch (res.response.status) {
              case 401:
                notification.error({
                  message: 'Sign In Failed',
                  description: res.response.data.message
                })
                break
              case 403:
                notification.error({
                  message: 'Sign In Failed',
                  description: res.response.data.message
                })
            }
          }
        })
        .catch((e) => {
          console.log(e)
        })
        .finally(() => {
          this.loading = false
        })
    },
    randomIcon(icon) {
      let random = icon[Math.floor(Math.random() * icon.length)]
      return random
    }
  }
}
</script>
