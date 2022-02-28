<template>
<v-row class='pa-6 mh-100v'>
  <v-col md="8" offset-md="2">
    <h1 class="h1 text-center w-100 mb-1">{{$t('signing_out')}}</h1>
    <div class="f-center w-100">
      <v-progress-circular indeterminate></v-progress-circular>
    </div>
  </v-col>
</v-row>
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
       window.location.href = process.env.HOME_URL;
    })
  },
}
</script>
