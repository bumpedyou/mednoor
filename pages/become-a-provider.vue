<template>
  <div class="pa-6 mh-100v">
    <a-row class="mb-1">
      <a-col>
        <a-button @click='$router.push(localePath("/view-mode"))'><a-icon type='arrow-left'></a-icon>Go back</a-button>
      </a-col>
    </a-row>
    <a-row>
      <a-col>
        <p class="h1 mb-1">Do you want to be a provider?</p>
        <a-button type='success' @click='$router.push(localePath("/join-professionals"))'>Yes <a-icon type='check-circle'></a-icon></a-button>
        <a-button type='danger' @click='$router.push(localePath("/view-mode"))'>No Thanks</a-button>
      </a-col>
    </a-row>
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
