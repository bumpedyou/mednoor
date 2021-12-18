<template>
  <embed
    :src="computedSrc"
    type="application/pdf"
    frameBorder="0"
    scrolling="auto"
    style="min-height: 100vh; margin-bottom: 0"
    width="100%"
  >
  </embed>
</template>

<script>
export default {
  name: "Uuid",
  layout: 'empty',
  computed: {
    computedSrc(){
      return process.env.API_URL + '/generated/record/' + this.$route.params.uuid
    }
  },
  mounted(){
    const r = this.$route.params.uuid
    console.log(r)
  }
}
</script>

<style scoped>

</style>
