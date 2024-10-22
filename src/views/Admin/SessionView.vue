<template>
  <main class="w-full p-4">
    <div class="min-h-screen rounded-md bg-white shadow-sm">
      <section>
        <SpinLoading :loading="isLoading" />
      </section>
      <section>
        <div class="py-2 px-8 w-full">
          <a-form layout="vertical" :disabled="!form.expiredValue && !form.typeValue">
            <a-form-item class="mb-0 mt-2">
              <h1 class="font-semibold">{{ sessionName ? 'Edit ' + ' ' + sessionName : '' }}</h1>
            </a-form-item>
            <a-form-item name="expired" class="mb-0 mt-2">
              <a-input-group compact>
                <a-input-number
                  v-model:value="form.expiredValue"
                  style="width: 20%"
                  :min="1"
                  placeholder="input expired number"
                />
                <a-select
                  v-model:value="form.typeValue"
                  style="width: 20%"
                  placeholder="select type expired"
                  :options="
                    data?.arrayType?.map((item) => ({ value: item?.value, label: item?.name }))
                  "
                />
              </a-input-group>
            </a-form-item>
            <a-form-item>
              <div class="flex flex-row gap-1 py-2">
                <a-button
                  size="small"
                  type="primary"
                  danger
                  :hidden="!form.expiredValue && !form.typeValue"
                  @click="onCancel"
                >
                  Cancel
                </a-button>
                <a-button size="small" type="primary" @click="onSubmit">Submit</a-button>
              </div>
            </a-form-item>
          </a-form>
        </div>
      </section>

      <a-divider />
      <section>
        <div class="m-4 rounded-md border">
          <a-table
            size="small"
            :columns="data.arrayTitle"
            :data-source="data.arraySession"
            :pagination="false"
          >
            <template #headerCell="{ column }">
              <a fixed>{{ column.title }}</a>
            </template>
            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'SessionName'">
                <p fixed>
                  {{ record.session_name }}
                </p>
              </template>
              <template v-if="column.key === 'ExpiredType'">
                <p fixed>
                  {{ record.expired + ' ' + record.type }}
                </p>
              </template>
              <template v-if="column.key === 'Action'">
                <div>
                  <a-button type="text" size="small" @click="onEdit(record)">
                    <font-awesome-icon icon="pencil" />
                  </a-button>
                </div>
              </template>
            </template>
          </a-table>
        </div>
      </section>
    </div>
  </main>
</template>
<script>
import SpinLoading from '@/components/Spin/SpinLoading.vue'
import { getAllSession, putSession } from '@/boot/hooks'

export default {
  components: { SpinLoading },
  data: () => ({
    isLoading: false,
    idSession: null,
    sessionName: null,
    form: {
      expiredValue: null,
      typeValue: null
    },
    data: {
      arrayType: [
        {
          name: 'minute',
          value: 'minute'
        },
        {
          name: 'hour',
          value: 'hour'
        },
        {
          name: 'day',
          value: 'day'
        }
      ],
      arrayTitle: [
        {
          title: 'Session Name',
          key: 'SessionName'
        },
        {
          title: 'Expired Type',
          key: 'ExpiredType'
        },
        {
          title: 'Action',
          key: 'Action'
        }
      ],
      arraySession: []
    }
  }),
  methods: {
    onEdit(record) {
      this.idSession = record.id
      this.sessionName = record.session_name
      this.form = {
        ...this.form,
        expiredValue: record.expired,
        typeValue: record.type
      }
    },
    async getData() {
      await getAllSession().then((res) => {
        this.data.arraySession = res.data.data
      })
    },
    onCancel() {
      this.idSession = null
      this.sessionName = null
      this.form = {
        ...this.form,
        expiredValue: null,
        typeValue: null
      }
    },
    async onSubmit() {
      this.isLoading = true
      const form = {
        expired: this.form.expiredValue,
        type: this.form.typeValue
      }

      await putSession(this.idSession, form)
        .then(() => {
          this.getData()
          this.idSession = null
          this.form = {
            ...this.form,
            expiredValue: null,
            typeValue: null
          }
        })
        .finally(() => (this.isLoading = false))
    }
  },
  mounted() {
    this.getData()
  }
}
</script>
