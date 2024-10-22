<template>
  <main class="w-full border rounded-md p-4">
    <SpinLoading :loading="isLoading" />
    <div class="flex flex-col gap-y-3">
      <section>
        <FormRegion
          :open="openRegion"
          :name="form.name"
          @onName="onName"
          @onCancel="onCancel"
          @createRegion="onSubmit"
        />
      </section>
      <section>
        <a-button type="primary" class="shadow-sm" @click="onModalRegion" size="small">
          + add regions
        </a-button>
      </section>
      <section>
        <TableContainer
          :columns="array.title"
          :data="array.region"
          :currPage="pagination.currPage"
          :pageSize="pagination.limitRegion"
          :totalItem="pagination.totalPage"
          @onLimitSelect="onLimitSelect"
          @onPage="onPage"
          @onEdit="onEdit"
          @onDelete="onDelete"
        />
      </section>
    </div>
  </main>
</template>
<script>
import { delRegion, getAllRegion, getDetailRegion, postPutRegion } from '@/boot/hooks'
import FormRegion from '../Form/FormRegion.vue'
import SpinLoading from '../Spin/SpinLoading.vue'
import TableContainer from '../Table/TableContainer.vue'

export default {
  components: {
    SpinLoading,
    FormRegion,
    TableContainer
  },
  data: () => ({
    isLoading: false,
    openRegion: false,
    idRegion: null,
    form: {
      name: null
    },
    pagination: {
      limitRegion: 20,
      currPage: 1,
      totalPage: 0
    },
    array: {
      region: [],
      title: [
        {
          title: 'No',
          dataIndex: 'index',
          key: 'index',
          width: 50
        },
        {
          title: 'Name',
          dataIndex: 'name',
          key: 'name'
        },
        {
          title: 'Action',
          dataIndex: 'action',
          key: 'action'
        }
      ]
    }
  }),
  methods: {
    onModalRegion() {
      this.openRegion = true
    },
    onCancel() {
      this.openRegion = false
      this.clearForm()
    },
    clearForm() {
      this.form = {
        ...this.form,
        name: null
      }
      this.idRegion = null
    },
    onName(value) {
      this.form.name = value
    },
    async getData() {
      this.isLoading = true
      await getAllRegion(this.pagination.currPage, this.pagination.limitRegion)
        .then((res) => {
          this.array.region = res.data.data
          if (this.pagination.currPage === 1) this.pagination.totalPage = res.data.meta.count
        })
        .catch((e) => {
          this.isLoading = true
          console.log(e)
        })
        .finally(() => {
          this.isLoading = false
        })
    },
    onLimitSelect(value) {
      this.pagination = {
        limitRegion: value,
        currPage: 1
      }
      this.getData()
    },
    onPage(page) {
      this.pagination.currPage = page
      this.getData()
    },
    async onEdit(value) {
      this.idRegion = value
      this.isLoading = true
      await getDetailRegion(this.idRegion)
        .then((res) => {
          this.form.name = res.data.data.name
          this.openRegion = true
        })
        .catch((e) => console.log(e))
        .finally(() => (this.isLoading = false))
    },
    async onDelete(id) {
      this.isLoading = true

      await delRegion(id)
        .then(() => {
          this.getData()
        })
        .catch((e) => {
          this.isLoading = true

          console.log(e)
        })
        .finally(() => {
          this.isLoading = false
        })
    },
    async onSubmit() {
      this.isLoading = true

      await postPutRegion(this.form, this.idRegion)
        .then(() => {
          this.getData()
          this.clearForm()
          this.openRegion = false
        })
        .catch((e) => console.log(e))
        .finally(() => (this.isLoading = false))
    }
  },
  mounted() {
    this.getData()
  }
}
</script>
