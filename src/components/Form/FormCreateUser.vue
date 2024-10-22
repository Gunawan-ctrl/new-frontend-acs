<template>
  <main>
    <a-modal
      :open="open"
      @cancel="onCancel"
      :footer="false"
      :title="
        !id_user
          ? 'Create User'
          : role_name_props === 'monitoring'
            ? 'Change Regions'
            : 'Change Networks'
      "
    >
      <section>
        <a-form layout="vertical">
          <a-form-item name="role" class="mb-0 mt-2" label="Select Role">
            <a-select
              :disabled="id_user ? true : false"
              ref="role"
              placeholder="Select Role"
              class="w-full"
              allowClear
              :value="role_id"
              :options="optRole?.map((item) => ({ value: item.id, label: item?.name }))"
              @change="onSelectRole"
            />
          </a-form-item>
          <a-form-item label="Username" name="username" class="mb-0 mt-2">
            <a-input
              :disabled="id_user ? true : false"
              placeholder="Input Username"
              :value="username"
              @input="onInputUsername($event.target.value)"
            />
          </a-form-item>
          <a-form-item label="Password" name="password" class="mb-0 mt-2" v-if="!id_user">
            <div class="flex flex-row items-center gap-x-1">
              <a-input-password
                placeholder="Input Password"
                :value="password"
                @input="onInputPass($event.target.value)"
              />
            </div>
          </a-form-item>
          <a-form-item
            name="network"
            label="Select Networks"
            v-if="parameters.role_name === 'customer' || role_name_props == 'customer'"
            class="mb-0 mt-2"
          >
            <a-select
              placeholder="select network"
              allowClear
              mode="tags"
              :value="network_id"
              @change="onSelectNet"
              @scroll="onScrollNetwork"
            >
              <!-- :dropdownStyle="{ maxHeight: '150px', overflowY: 'auto' }" -->
              <template v-for="region in optNetwork" :key="region.regions.id">
                <a-select-opt-group :label="region.regions.name">
                  <a-select-option
                    v-for="network in region.networks"
                    :key="network.id"
                    :value="network.id"
                  >
                    {{ network.name }}
                  </a-select-option>
                </a-select-opt-group>
              </template>
            </a-select>
          </a-form-item>
          <a-form-item
            name="region"
            label="Select Regions"
            class="mb-0 mt-2"
            v-if="parameters.role_name == 'monitoring' || role_name_props == 'monitoring'"
          >
            <a-select
              mode="tags"
              placeholder="select regions"
              allowClear
              :value="region_id"
              :filter-option="false"
              :options="optRegion?.map((item) => ({ value: item?.id, label: item?.name }))"
              @change="onSelectRegion"
            />
          </a-form-item>
          <a-form-item class="my-2 flex flex-row items-center justify-end">
            <a-button size="small" type="primary" @click="onSubmit">Submit</a-button>
          </a-form-item>
        </a-form>
      </section>
    </a-modal>
  </main>
</template>
<script>
import { getDetailUserRole } from '@/boot/hooks'
export default {
  props: {
    open: Boolean,
    id_user: String,
    optRole: Array,
    optNetwork: Array,
    optRegion: Array,
    role_id: String,
    username: String,
    password: String,
    role_name_props: String,
    network_id: {
      type: Array, // Mengubah tipe menjadi Array
      default: () => []
    },
    region_id: {
      type: Array, // Mengubah tipe menjadi Array
      default: () => []
    }
  },
  data: () => ({
    parameters: {
      role_name: null
    }
  }),
  methods: {
    onCancel() {
      this.$emit('onCancel')
    },
    async onSelectRole(value) {
      await getDetailUserRole(value).then((res) => {
        this.parameters.role_name = res.data.data.name
      })
      this.$emit('onSelectRole', value)
    },
    onInputUsername(value) {
      this.$emit('onInputUsername', value)
    },
    onInputPass(value) {
      this.$emit('onInputPass', value)
    },
    onSelectNet(value) {
      this.$emit('onSelectNet', value)
    },
    onSelectRegion(value) {
      this.$emit('onSelectRegion', value)
    },
    onSubmit() {
      this.$emit('onSubmit')
    },
    onScrollNetwork() {
      this.$emit('onScrollNetwork')
    }
  }
}
</script>
