<template>
<a-row class='pa-6 mh-100v'>
  <a-col span='8' offset='8'>
    <h1 class="h1 text-center w-100 mb-1">{{$t('signing_out')}}</h1>
    <div class="f-center w-100">
      <a-spin></a-spin>
    </div>
  </a-col>
</a-row>
</template>

<script>
export default {
  name: 'SignOut',
  head() {
    return {
      title: this.$t('sign_out'),
    }
  },
  mounted(){
    this.$cookies.set('view', null)
    this.$cookies.set('appointments', null)
    this.$auth.logout().then(()=>{
      this.$router.push(this.localePath('/sign-in'))
    })
  },
}
</script>
