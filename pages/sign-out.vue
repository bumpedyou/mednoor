<template>
<a-row>
  <a-col span='8' offset='8'>
    <h1 class="h1 text-center w-100 mb-1">Signing out</h1>
    <div class="f-center w-100">
      <a-spin></a-spin>
    </div>
  </a-col>
</a-row>
</template>

<script>
export default {
  name: 'SignOut',
  mounted(){
    this.$auth.logout()
    this.$router.push(('/sign-in'))
  },
  head() {
    return {
      title: 'Sign out',
    }
  },
}
</script>

<style scoped>

</style>
