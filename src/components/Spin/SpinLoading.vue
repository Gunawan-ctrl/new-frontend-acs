<template>
  <div
    class="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
    style="z-index: 999"
  >
    <a-spin :spinning="loading" tip="Loading ...." />
  </div>
</template>
<script>
export default {
  props: { loading: Boolean }
}
</script>
