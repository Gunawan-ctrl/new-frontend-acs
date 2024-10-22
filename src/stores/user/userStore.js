// user with pinia
import axios from '@/boot/axios'
import { defineStore } from 'pinia'

export const useUserStore = defineStore({
  id: 'user',
  state: () => ({
    isLoading: false,
    data: [],
    count: {
      admin: 0,
      customer: 0,
      superAdmin: 0,
      monitoring: 0,
      device: 0,
      network: 0,
    },
    role: {
      admin: 0,
      customer: 0,
      superAdmin: 0,
      monitoring: 0,
    },
    dataRole: []
  }),
  actions: {
    async getCount() {
      this.isLoading = true;
      try {
        const responseRole = await axios.axiosInstance.get('roles');
        this.dataRole = responseRole.data.data;
        this.role.admin = responseRole.data.data[0];
        this.role.customer = responseRole.data.data[1];
        this.role.superAdmin = responseRole.data.data[2];
        this.role.monitoring = responseRole.data.data[3];

        const [adminCount, customerCount, superAdminCount, monitoringCount] = await Promise.all([
          axios.axiosInstance.get('users', { params: { role_id: this.role.admin.id } }),
          axios.axiosInstance.get('users', { params: { role_id: this.role.customer.id } }),
          axios.axiosInstance.get('users', { params: { role_id: this.role.superAdmin.id } }),
          axios.axiosInstance.get('users', { params: { role_id: this.role.monitoring.id } })
        ]);

        this.count.admin = adminCount.data.meta.count;
        this.count.customer = customerCount.data.meta.count;
        this.count.superAdmin = superAdminCount.data.meta.count;
        this.count.monitoring = monitoringCount.data.meta.count;
      } catch (error) {
        console.log(error);
      } finally {
        this.isLoading = false;
      }
    },

    async getAll(limit, page, name, role_id) {
      let url = `users?limit=${limit}&page=${page}`;
      if (name) url += `&username=${name}`;
      if (role_id !== undefined && role_id !== null) url += `&role_id=${role_id}`;
      try {
        this.isLoading = true
        const response = await axios.axiosInstance.get(url);
        this.data = response.data.data;
        console.log('this.data', this.data);
      } catch (error) {
        console.log(error);
      } finally {
        this.isLoading = false;
      }
    }
  }
})

