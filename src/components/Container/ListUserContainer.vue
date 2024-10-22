<template>
  <main class="w-full border rounded-md p-4">
    <SpinLoading :loading="isLoading" />
    <div class="flex flex-col gap-y-3">
      <section>
        <FormEditPassByAdmin
          :open="openPass"
          :password="valuePass"
          @onCancel="onCancelPass"
          @onChangePass="onChangePass"
          @onSubmit="onSubmitPass"
        />
        <FormCreateUser
          :open="openUser"
          :id_user="idUser"
          :role_id="forms.role_id"
          :role_name_props="forms.role_name"
          :username="forms.username"
          :password="forms.password"
          :network_id="forms.network_id"
          :region_id="forms.region_id"
          :optRole="array.role"
          :optNetwork="array.network"
          :optRegion="array.region"
          @onCancel="onCancelUser"
          @onSubmit="onSubmitUser"
          @onSelectRole="onSelectRole"
          @onInputUsername="onInputUsername"
          @onInputPass="onInputPass"
          @onSelectNet="onSelectNet"
          @onSelectRegion="onSelectRegion"
        />
      </section>
      <section>
        <div
          class="flex flex-row items-center gap-2 justify-center sm:justify-between lg:flex-nowrap flex-wrap"
        >
          <div>
            <a-input-search
              v-model:value="searchUsername"
              placeholder="search user"
              size="small"
              @input="onSearcUsername(searchUsername)"
            >
              <template #enterButton>
                <font-awesome-icon icon="magnifying-glass" />
              </template>
            </a-input-search>
          </div>
          <div
            class="flex flex-row items-center justify-center sm:justify-between gap-2 flex-wrap sm:flex-nowrap"
          >
            <div class="flex flex-row items-center gap-x-2">
              <a-button
                type="primary"
                class="shadow-sm capitalize"
                @click="onModalUser"
                size="small"
              >
                + create user
              </a-button>
              <a-button
                type="primary"
                danger
                class="shadow-sm capitalize"
                @click="onDeleteBatch"
                size="small"
              >
                delete batch
              </a-button>
            </div>
          </div>
        </div>
      </section>
      <section>
        <div class="">
          <TableUser
            :columns="columns"
            :data="this.userStore.data"
            :pagination="true"
            :totalItem="totalUser"
            :currPage="currPageUser"
            :pageSize="limitUser"
            @onPage="onPage"
            @onLimitSelect="onLimitSelect"
            @onEdit="onEdit"
            @onDelete="onDelete"
            @onSelectChange="onSelectChange"
            @changePassAdmin="changePassAdmin"
          />
        </div>
      </section>
    </div>
  </main>
</template>
<script>
import {
  delUser,
  getAllRegion,
  getDetailUser,
  getNetwork,
  // getUser,
  // getUserRole,
  patchChangePassByAdmin,
  postUser,
  putUserNetworkList,
  putUserRegionList
} from '@/boot/hooks'
import TableUser from '../Table/TableUser.vue'
import SpinLoading from '../Spin/SpinLoading.vue'
import FormEditPassByAdmin from '../Form/FormEditPassByAdmin.vue'
import FormCreateUser from '../Form/FormCreateUser.vue'

// Store pinia
import { useUserStore } from '@/stores/user/userStore'

export default {
  components: { TableUser, SpinLoading, FormEditPassByAdmin, FormCreateUser },
  data: () => ({
    userStore: useUserStore(),
    valuePass: null,
    idUser: null,
    openPass: false,
    isLoading: false,
    searchUsername: null,
    data: null,
    totalUser: 0,
    limitUser: 20,
    currPageUser: 1,
    openUser: false,
    selectedTable: [],
    array: {
      role: [],
      network: [],
      region: []
    },
    forms: {
      role_id: null,
      role_name: null,
      username: null,
      password: null,
      network_id: [],
      region_id: []
    },
    pagination: {
      limitNet: 200
    },
    columns: [
      {
        title: 'No',
        dataIndex: 'index',
        key: 'index',
        width: 50
      },
      {
        title: 'Username',
        dataIndex: 'username',
        key: 'username'
      },
      {
        title: 'Role',
        dataIndex: 'role',
        key: 'role'
      },
      {
        title: 'Action',
        key: 'action'
      }
    ]
  }),
  methods: {
    onSelectRole(value) {
      this.forms.role_id = value
    },
    onInputUsername(value) {
      this.forms.username = value
    },
    onInputPass(value) {
      this.forms.password = value
    },
    onSelectNet(value) {
      this.forms.network_id = value
    },
    onSelectRegion(value) {
      this.forms.region_id = value
    },
    // async getData() {
    //   try {
    //     this.isLoading = true
    //     const res = await getUser(this.limitUser, this.currPageUser, this.searchUsername)
    //     this.data = res.data.data
    //     if (this.currPageUser === 1) this.totalUser = res.data.meta.count
    //     this.isLoading = false
    //   } catch (err) {
    //     console.log(err)
    //     this.isLoading = false
    //   } finally {
    //     this.isLoading = false
    //   }
    // },

    // Menggunakan pinia
    async getData() {
      this.userStore.getAll(this.limitUser, this.currPageUser, this.searchUsername)
    },

    async getRole() {
      this.array.role = this.userStore.dataRole
      // this.userStore.dataRole
      // this.userStore.dataRole
      // await getUserRole().then((res) => {
      //   this.array.role = res.data.data
      // })
    },
    async getNet() {
      await getNetwork(this.pagination.limitNet, 1, null).then((res) => {
        this.array.network = res.data.data
      })
    },
    async getRegion() {
      await getAllRegion(1, 200).then((res) => {
        this.array.region = res.data.data
      })
    },
    onSearcUsername(name) {
      this.currPageUser = 1
      this.searchUsername = name
      this.getData()
    },
    clearForm() {
      this.forms = {
        ...this.forms,
        role_id: null,
        role_name: null,
        username: null,
        region_id: [],
        network_id: []
      }
    },
    async onModalUser() {
      await this.getRole()
      await this.getNet()
      await this.getRegion()
      // this.userStore.getAll()
      // console.log('this.userStore.data', this.userStore.data)
      this.openUser = true
    },
    async onSubmitUser() {
      // this.openUser = false
      if (this.idUser == null) {
        await postUser(this.forms).then(() => this.clearForm())
      } else {
        if (this.forms.role_name == 'monitoring') {
          const form = {
            region_id: this.forms.region_id
          }
          await putUserRegionList(this.idUser, form).then(() => this.clearForm())
        } else {
          const form = {
            network_id: this.forms.network_id
          }
          await putUserNetworkList(this.idUser, form).then(() => this.clearForm())
        }
      }
      this.openUser = false
      this.getData()
    },
    onCancelUser() {
      this.openUser = false
      this.idUser = null
      this.clearForm()
    },
    loopID(data) {
      const temp = []
      data?.map((item) => {
        temp.push(item.id)
      })
      return temp
    },
    async onEdit(id) {
      this.idUser = id
      await this.getRole()
      await this.getNet()
      await this.getRegion()
      await getDetailUser(id).then((res) => {
        const temp = res.data.data
        this.forms = {
          ...this.forms,
          role_id: temp.roles.id,
          role_name: temp.roles.name,
          username: temp.username,
          region_id: temp.regions ? this.loopID(temp.regions) : [],
          network_id: temp.networks ? this.loopID(temp.networks) : []
        }
      })
      this.openUser = true
    },

    async onDeleteBatch() {
      await delUser({
        data: {
          user_id: this.selectedTable
        }
      }).then(() => this.getData())
    },
    async onDelete(id) {
      await delUser({
        data: {
          user_id: [id]
        }
      }).then(() => this.getData())
    },
    changePassAdmin(id) {
      this.openPass = true
      this.idUser = id
    },
    onChangePass(value) {
      this.valuePass = value
    },
    async onSubmitPass() {
      const form = {
        password: this.valuePass
      }
      await patchChangePassByAdmin(this.idUser, form)
      this.idUser = null
      this.valuePass = null
      this.openPass = false
    },
    onCancelPass() {
      this.openPass = false
      this.idUser = null
      this.valuePass = null
    },
    onLimitSelect(value) {
      this.limitUser = value
      this.currPageUser = 1
      this.getData()
    },
    onPage(page) {
      this.currPageUser = page
      this.getData()
    },
    onSelectChange(selectedRowKeys) {
      this.selectedTable = selectedRowKeys
    }
  },
  mounted() {
    this.getData()
    this.userStore.getCount()
  }
}
</script>
