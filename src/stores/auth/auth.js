// auth pinia
import axios from '@/boot/axios'
import { defineStore } from 'pinia'

export const useAuthStore = defineStore({
  id: 'auth',
  state: () => ({
    version: __APP_VERSION__,
    loading: false,
    form: {
      identify: null,
      password: null
    }
  }),
  actions: {
    async login() {
      try {
        this.loading = true
        const response = await axios.axiosInstance.post('auth/login', this.form)
        console.log(response)
        this.$router.push('/')
      } catch (e) {
        console.log(e)
      }
    },
    async getMe() {
      try {
        const response = await axios.axiosInstance.get('auth/me')
        console.log(response)
      } catch (e) {
        console.log(e)
      }
    }
  },
})
