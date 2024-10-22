<template>
  <main class="h-[345px] overflow-y-auto p-2 w-full" @scroll="onLoadMore">
    <section>
      <div class="flex flex-row items-center justify-between lg:flex-nowrap flex-wrap">
        <div>
          <h1 class="capitalize p-2 font-semibold">{{ title }}</h1>
        </div>
        <div class="px-3">
          <a-input-search
            size="small"
            placeholder="search network"
            v-model:value="searchNet"
            @input="onSearchNet(searchNet)"
          >
            <template #enterButton>
              <font-awesome-icon icon="magnifying-glass" />
            </template>
          </a-input-search>
        </div>
      </div>
    </section>
    <section v-if="data">
      <div v-for="region in data" :key="region">
        <h2 class="px-3 pb-1 font-semibold capitalize text-gray-400">
          {{ region.regions.name }}
        </h2>

        <a-radio-group
          v-for="network in region.networks"
          v-model:value="radioValue"
          class="flex flex-col gap-y-1 px-4 py-0.5"
          :key="network.id"
          @change="onSelectRadio(radioValue, network.name)"
        >
          <div class="flex flex-row items-center justify-between">
            <a-radio :value="network.id">
              <h1 v-if="network" class="capitalize">
                {{ network.name }}
              </h1>
            </a-radio>
          </div>

          <a-divider class="my-1" />
        </a-radio-group>
      </div>
    </section>
    <section v-else>
      <div class="pt-4">
        <a-empty :image="img" />
      </div>
    </section>
  </main>
</template>
<script>
import { Empty } from 'ant-design-vue'

export default {
  props: {
    data: Array,
    classContainer: String,
    title: String,
    limitNet: Number,
    hideBtnLoadMore: Boolean
  },
  data() {
    return {
      searchNet: null,
      radioValue: null,
      img: Empty.PRESENTED_IMAGE_SIMPLE
    }
  },
  methods: {
    onSelectRadio(value, name) {
      this.$emit('onSelectRadio', value, name)
    },
    onDetail(id) {
      this.$emit('onDetail', id)
    },
    onSearchNet(value) {
      this.$emit('onSearchNet', value)
    },
    onLoadMore() {
      this.$emit('onLoadMore')
    }
  }
}
</script>
