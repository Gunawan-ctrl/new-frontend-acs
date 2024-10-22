import axios from '@/boot/axios'
import { defineStore } from 'pinia'

export const useDeviceStore = defineStore({
  id: 'device',
  state: () => ({
    loading: false,
    count: {
      device: 0,
      network: 0,
    },
  }),
  actions: {
    async getCount() {
      this.loading = true;
      try {
        const [deviceCount, networkCount] = await Promise.all([
          axios.axiosInstance.get('devices'),
          axios.axiosInstance.get('networks')
        ]);

        this.count.device = deviceCount.data.meta.count;
        this.count.network = networkCount.data.meta.count;
      } catch (error) {
        console.log(error);
      } finally {
        this.loading = false;
      }
    },
  }
})
