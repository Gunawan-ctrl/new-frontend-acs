import axios from 'axios'
import router from '@/router'
import { Modal } from 'ant-design-vue'
import { secondToMinute } from './helper'

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_URL,
  timeout: import.meta.env.VITE_APP_TIMEOUT
  // withCredentials: true
})
const axiosInstance2 = axios.create({
  baseURL: import.meta.env.VITE_APP_ACS_URL,
  timeout: 150000
})

async function extend(token) {
  const form = {
    refresh_token: token
  }
  try {
    const res = await axiosInstance.patch('auth/refresh', form)
    return res.data.data
  } catch (e) {
    console.log('failed to extend session :', e)
  }
}

let isModalShow = false

function modalExtSession() {
  if (isModalShow) return

  let countTime = 3600
  isModalShow = true
  const modal = Modal.confirm({
    title: 'session expired',
    content: 'Your session has expired. Would you like to extend it ?',
    okText: 'Extend Session',
    async onOk() {
      try {
        const res = JSON.parse(localStorage.getItem('dataUser'))
        const token = res.access_token.refresh_token
        const newToken = await extend(token)
        localStorage.setItem('dataUser', JSON.stringify(newToken))
      } catch (e) {
        console.log(e)
        localStorage.removeItem('dataUser')
        localStorage.removeItem('idDefault')
        router.push({ name: 'login' })
      } finally {
        isModalShow = false
      }
      window.location.reload()
    },
    onCancel() {
      localStorage.removeItem('dataUser')
      localStorage.removeItem('idDefault')
      router.push({ name: 'login' })
      isModalShow = false
    }
  })
  const interval = setInterval(() => {
    countTime -= 1
    modal.update({
      content: `Session will be destroyed after ${secondToMinute(countTime)}.`
    })
  }, 1000)
  setTimeout(() => {
    clearInterval(interval)
    localStorage.removeItem('dataUser')
    localStorage.removeItem('idDefault')
    router.push({ name: 'login' })
    modal.destroy()
  }, countTime * 1000)
}

axiosInstance.interceptors.request.use(
  (config) => {
    config.headers['Content-Type'] = 'application/json'
    const dataUser = JSON.parse(localStorage?.getItem('dataUser'))
    if (dataUser) {
      config.headers['Authorization'] = `Bearer ${dataUser?.access_token?.token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

axiosInstance.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    axiosInstance.isWarningShown = true
    if (error.response.data.message === 'Invalid token') modalExtSession()
    if (error.response.status === 401) return error
    return Promise.reject(error)
  }
)

axiosInstance2.interceptors.request.use(
  (config) => {
    config.headers['Content-Type'] = 'application/x-www-form-urlencoded'
    config.headers['Authorization'] = import.meta.env.VITE_APP_BASICAUTH
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

axiosInstance2.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    axiosInstance.isWarningShown = true
    return Promise.reject(error)
  }
)

export default { axiosInstance, axiosInstance2 }
