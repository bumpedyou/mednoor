<template>
  <div class="pa-6 mh-100v">
    <v-row class="mb-1">
      <v-col>
        <v-btn small tile color="success" @click='$router.push(localePath("/view-mode"))'><v-icon>mdi-arrow-left</v-icon>Go back</v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <p class="h1 mb-3">Do you want to be a provider?</p>
        <v-btn color='error' small tile @click='$router.push(localePath("/view-mode"))'>No Thanks</v-btn>
        <v-btn color='primary' small tile @click='$router.push(localePath("/join-professionals"))'>Yes <v-btn>mdi-check-circle</v-btn></v-btn>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  name: 'BecomeAProvider',
  middleware: ['authenticated','not-blocked', 'not-deleted', 'verified'],
  mounted (){
    this.$api.get('/professional/my-record').then(({data}) =>{
      if (data && data.profe_uuid){
        this.has_record = true
        this.$router.push(this.localePath('/thanks-for-applying'))
      }
    }).catch((err) =>{
      this.$refs.rmodal.$emit('error', err)
    }).finally(() => {
      this.loadingMyRecord = false
    })
  }
}
</script>

<style scoped>

</style>
