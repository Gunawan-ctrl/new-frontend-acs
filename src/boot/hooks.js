import axios from '@/boot/axios'
import { message } from 'ant-design-vue'

// auth
export const getMe = async (limit, page) => {
  let url = 'auth/me'
  if (limit && !page) url += `?limit=${limit}`
  if (page && !limit) url += `?page=${page}`
  if (limit && page) url += `?limit=${limit}&page=${page}`
  try {
    const res = await axios.axiosInstance.get(url)
    return res
  } catch (err) {
    return err
  }
}
export const auth = async (form) => {
  try {
    const res = await axios.axiosInstance.post('auth/login', form)
    return res
  } catch (err) {
    return err
  }
}
// user
export const getUser = async (limit, page, name, role_id) => {
  let url = `users?limit=${limit}&page=${page}`
  if (name) url += `&username=${name}`
  if (role_id !== undefined && role_id !== null) url += `&role_id=${role_id}`

  try {
    const res = await axios.axiosInstance.get(url)
    return res
  } catch (err) {
    return err
  }
}
export const getDetailUser = async (id) => {
  try {
    const res = await axios.axiosInstance.get(`users/${id}`)
    return res
  } catch (err) {
    return err
  }
}
export const postUser = async (form) => {
  try {
    const res = await axios.axiosInstance.post('users', form)
    message.success(res.data.message)
    return res
  } catch (err) {
    if (err.response.status === 400) message.error('form must not null')
    return err
  }
}
export const patchChangePassByAdmin = async (id, form) => {
  try {
    const res = await axios.axiosInstance.patch(`users/change-password/${id}`, form)
    message.success(res.data.message)
    return res
  } catch (err) {
    if (err.response.status == 400) message.error('form must not null')
    return err
  }
}
export const patchPassUser = async (id, form) => {
  try {
    const res = await axios.axiosInstance.patch(`profile/change-password/${id}`, form)
    message.success(res.data.message)
    return res
  } catch (err) {
    if (err.response.status == 400) message.error('form must not null')
    return err
  }
}
export const patchStatus = async (id, form) => {
  try {
    const res = await axios.axiosInstance.patch(`users/change-status/${id}`, form)
    message.success('update status success!')
    return res
  } catch (err) {
    return err
  }
}
export const checkDuplicate = async (key) => {
  let form = {
    key: key
  }
  try {
    const res = await axios.axiosInstance.post('users/check-duplicate', form)
    return res
  } catch (err) {
    return err
  }
}
export const delUser = async (form) => {
  try {
    const res = await axios.axiosInstance.delete(`users`, form)
    message.success('deleted success!')
    return res
  } catch (err) {
    return err
  }
}
export const putUserNetworkList = async (id, form) => {
  try {
    const res = await axios.axiosInstance.put(`users/change-network-list/${id}`, form)
    message.success('update network success!')
    return res
  } catch (err) {
    message.error(err.response.data.message)
    return err
  }
}
export const putUserRegionList = async (id, form) => {
  try {
    const res = await axios.axiosInstance.put(`users/change-region-list/${id}`, form)
    message.success('update regions success!')
    return res
  } catch (err) {
    message.error(err.response.data.message)
    return err
  }
}
// devices
export const getDevice = async (query, limit, page) => {
  let url = `devices?limit=${limit}&page=${page}`
  if (query) url += `&ip_address=${query}`
  try {
    const res = await axios.axiosInstance.get(url)
    return res
  } catch (err) {
    return err
  }
}
export const getDeviceNoConnect = async (query, limit, page) => {
  let url = `devices/no-connect?limit=${limit}&page=${page}`
  if (query) url += `&ip_address=${query}`
  try {
    const res = await axios.axiosInstance.get(url)
    return res
  } catch (err) {
    return err
  }
}
export const getDetailDevice = async (id) => {
  try {
    const res = await axios.axiosInstance.get(`devices/${id}`)
    return res
  } catch (err) {
    return err
  }
}
export const postDevice = async (form) => {
  try {
    const res = await axios.axiosInstance.post('devices', form)
    message.success(res.data.message)
    return res
  } catch (err) {
    if (err.response.status === 400) message.error(err.response.data.message)
    if (err.response.status === 500)
      message.error(' duplicate key value violates unique serial number')
  }
}
export const putDevice = async (id) => {
  try {
    const res = await axios.axiosInstance.put('devices', id)
    message.success(res.data.message)
    return res
  } catch (err) {
    message.error(err.response.data.message)
    return err
  }
}
export const delDevice = async (form) => {
  try {
    const res = await axios.axiosInstance.delete(`devices`, form)
    message.success('deleted success!')
    return res
  } catch (err) {
    console.log(err)
    return err
  }
}
// network
export const getNetwork = async (limit, page, name) => {
  let url = `networks?limit=${limit}&page=${page}`
  if (name) url += `&name=${name}`
  try {
    const res = await axios.axiosInstance.get(url)
    return res
  } catch (err) {
    return err
  }
}
export const postNetwork = async (form) => {
  try {
    const res = await axios.axiosInstance.post('networks', form)
    message.success(res.data.message)
    return res
  } catch (err) {
    message.error(err.response.data.message)
    return err
  }
}
export const putNetWork = async (id, form) => {
  try {
    const res = await axios.axiosInstance.put(`networks/${id}`, form)
    message.success(res.data.message)
    return res
  } catch (err) {
    message.error(err.response.data.message)
    return err
  }
}
export const postPutNet = async (form, id) => {
  const endPoint = id ? `networks/${id}` : `networks`
  try {
    const res = await axios.axiosInstance[id ? 'put' : 'post'](endPoint, form)
    message.success(res.data.message)
    return res
  } catch (err) {
    message.error(err.response.data.message)
    return err
  }
}
export const getNetUser = async (id) => {
  try {
    const res = await axios.axiosInstance.get(`networks/users/${id}`)
    return res
  } catch (err) {
    return err
  }
}
export const getDetailNetwork = async (id) => {
  try {
    const res = await axios.axiosInstance.get(`networks/${id}`)
    return res
  } catch (err) {
    return err
  }
}
export const delNetwork = async (form) => {
  try {
    const res = await axios.axiosInstance.delete(`networks`, form)
    message.success('delete success')
    return res
  } catch (err) {
    console.log('err', err)
    message.error(err.response.data.message || 'deleted failed')
    return err
  }
}

// device-networks
export const getDeviceNetWorks = async (id, limit, page, net_id) => {
  let url = `customer/device-networks/${id}?limit=${limit}&page=${page}`
  if (net_id) url += `&network_id=${net_id}`
  try {
    const res = axios.axiosInstance.get(url)
    return res
  } catch (err) {
    return err
  }
}
export const postDeviceNetworks = async (form) => {
  try {
    const res = await axios.axiosInstance.post('device-networks', form)
    message.success(res.data.message)
    return res
  } catch (err) {
    if (err.response.status === 400) message.error(err.response.data.message)
    if (err.response.status === 500)
      message.error('This device is already connected to another network.')

    return err
  }
}
export const putDeviceNetwokrs = async (form) => {
  try {
    const res = await axios.axiosInstance.put(`device-networks`, form)
    message.success(res.data.message)
    return res
  } catch (err) {
    message.error(err.response.data.message)
    return err
  }
}
export const getDetailDeviceNetworks = async (id, page, limit) => {
  try {
    const res = await axios.axiosInstance(`device-networks/${id}?limit=${limit}&page=${page}`)
    return res
  } catch (err) {
    return err
  }
}

// roles
export const getUserRole = async () => {
  try {
    const res = await axios.axiosInstance.get('roles')
    return res
  } catch (err) {
    return err
  }
}
export const getDetailUserRole = async (id) => {
  try {
    const res = await axios.axiosInstance.get(`roles/${id}`)
    return res
  } catch (err) {
    return err
  }
}
// tags
export const postTags = async (id, form) => {
  try {
    const res = await axios.axiosInstance.post(`devices/tags/${id}`, form)
    return res
  } catch (err) {
    message.error(err.response.data.message)
    return err
  }
}
// sessions
export const getAllSession = async () => {
  try {
    const res = await axios.axiosInstance.get('sessions')
    return res
  } catch (err) {
    return err
  }
}
export const putSession = async (id, form) => {
  try {
    const res = await axios.axiosInstance.put(`sessions/${id}`, form)
    return res
  } catch (err) {
    message.error(err.response.data.message)
    return err
  }
}
// region
export const getAllRegion = async (page, limit) => {
  let url = `regions?limit=${limit}&page=${page}`
  try {
    const res = await axios.axiosInstance.get(url)
    return res
  } catch (err) {
    return err
  }
}
export const getDetailRegion = async (id) => {
  try {
    const res = await axios.axiosInstance.get(`regions/${id}`)
    return res
  } catch (err) {
    return err
  }
}
export const delRegion = async (id) => {
  try {
    const res = await axios.axiosInstance.delete(`regions/${id}`)
    return res
  } catch (err) {
    return err
  }
}
export const postRegion = async (form) => {
  try {
    const res = await axios.axiosInstance.post('regions', form)
    message.success(res.data.message)
    return res
  } catch (err) {
    message.error(err.response.data.message)
    return err
  }
}
export const putRegion = async (id, form) => {
  try {
    const res = await axios.axiosInstance.put(`regions/${id}`, form)
    message.success(res.data.message)
    return res
  } catch (err) {
    message.error(err.response.data.message)
    return err
  }
}
export const postPutRegion = async (form, id) => {
  const endPoint = id ? `regions/${id}` : `regions`
  try {
    const res = await axios.axiosInstance[id ? 'put' : 'post'](endPoint, form)
    message.success(res.data.message)
    return res
  } catch (err) {
    message.error(err.response.data.message)
    return err
  }
}
// summary
export const getSummarySuperAdmin = async () => {
  try {
    const res = await axios.axiosInstance.get('summary/super-admin')
    return res
  } catch (e) {
    return e
  }
}
export const getSummaryAdmin = async () => {
  try {
    const res = await axios.axiosInstance.get('summary/admin')
    return res
  } catch (e) {
    return e
  }
}
//  device acs
export const getAllDeviceAcs = async (params) => {
  const query = encodeURIComponent(JSON.stringify({ _tags: params }))

  try {
    const res = await axios.axiosInstance2.get(`devices?query=${query}`)
    return res
  } catch (err) {
    return err
  }
}
export const getDetailDeviceAcs = async (serialNumber) => {
  // const projection = `projection=${params}`
  const queryStringify = encodeURIComponent(
    JSON.stringify({ '_deviceId._SerialNumber': serialNumber })
  )
  try {
    const res = await axios.axiosInstance2.get(`devices?query=${queryStringify}`)
    return res
  } catch (err) {
    return err
  }
}

export const taskGenie = async (id, params) => {
  const idTemp = encodeURIComponent(id)
  try {
    const res = await axios.axiosInstance2.post(
      `devices/${idTemp}/tasks?connection_request`,
      params
    )
    return res
  } catch (err) {
    return err
  }
}

export const getNewDevices = async () => {
  try {
    const res = await axios.axiosInstance(
      `${import.meta.env.VITE_APP_ACS_CONNECT_URL}/devices?tags=new`
    )
    return res
  } catch (e) {
    console.log(e)
  }
}
