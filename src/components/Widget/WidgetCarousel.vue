<template>
  <div
    class="h-1.5 rounded-t-md"
    :class="title == 'devices' ? 'bg-lightBlue-2' : 'bg-lightOrange-2'"
  ></div>
  <div class="h-[5.7rem] rounded-b-md shadow-sm bg-white">
    <div class="flex flex-col">
      <section>
        <div class="px-4 pt-4">
          <div class="flex flex-row items-center justify-between">
            <h1
              class="font-semibold uppercase"
              :class="title == 'devices' ? 'text-lightBlue-2' : 'text-lightOrange-2'"
            >
              {{ title }}
            </h1>
          </div>
        </div>
      </section>
      <section>
        <div class="flex flex-row items-center justify-between py-4 px-2">
          <div class="pl-3">
            <h1
              class="font-medium"
              :class="title == 'devices' ? 'text-lightBlue-2' : 'text-lightOrange-2'"
            >
              {{ count }}
            </h1>
          </div>
          <div class="w-1/2">
            <a-carousel
              :autoplay="false"
              :arrows="count == 1 ? false : true"
              :dots="false"
              :after-change="onChange"
              class="py-1"
            >
              <template #prevArrow>
                <div class="custom-slick-arrow" style="left: 10px; z-index: 1">
                  <font-awesome-icon
                    icon="caret-left"
                    :class="title == 'devices' ? 'text-lightBlue-2' : 'text-lightOrange-2'"
                  />
                </div>
              </template>
              <template #nextArrow>
                <div class="custom-slick-arrow" style="right: 10px">
                  <font-awesome-icon
                    icon="caret-right"
                    :class="title == 'devices' ? 'text-lightBlue-2' : 'text-lightOrange-2'"
                  />
                </div>
              </template>
              <div class="" v-for="(item, i) in data" :key="i">
                <h1
                  v-if="title === 'devices'"
                  :class="title == 'devices' ? 'text-lightBlue-2' : 'text-lightOrange-2 '"
                >
                  {{
                    item === 'ALCL'
                      ? 'Nokia'
                      : item === 'Huawei Technologies Co., Ltd'
                        ? 'Huawei'
                        : item
                  }}
                </h1>
                <h1 v-else :class="title == 'devices' ? 'text-lightBlue-2' : 'text-lightOrange-2 '">
                  {{ item.name }}
                </h1>
              </div>
            </a-carousel>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>
<script>
export default {
  props: { data: Array, count: Number, title: String },
  methods: {
    onChange() {
      this.$emit('onChange')
    }
  }
}
</script>
<style scoped>
/* For demo */
:deep(.slick-slide) {
  text-align: center;
  overflow: hidden;
}

:deep(.slick-arrow.custom-slick-arrow) {
  font-size: 25px;

  transition: ease all 0.3s;
  opacity: 0.3;
  z-index: 1;
}
:deep(.slick-arrow.custom-slick-arrow:before) {
  display: none;
}
:deep(.slick-arrow.custom-slick-arrow:hover) {
  opacity: 0.5;
}
:deep(.slick-track::before) {
  width: 19px;
}
</style>
