<template>
  <main>
    <div class="flex flex-col items-center justify-center my-auto">
      <a-result status="404" title="404" sub-title="Sorry, the page you visited does not exist.">
        <template #extra>
          <a-button type="primary" @click="home">Back Home</a-button>
        </template>
      </a-result>
    </div>
  </main>
</template>
<script>
export default {
  data() {
    return {
      idNetworkDefault: localStorage.getItem('idDefault')
    }
  },
  methods: {
    home() {
      if (this.$route.meta.authClient) {
        window.location.href = `/network/${this.idNetworkDefault}`
      }
      // else if (this.$route.meta)
      // console.log(this.$route.meta)
      // window.location.href = `/network/${this.idNetworkDefault}`
    }
  }
}
</script>
