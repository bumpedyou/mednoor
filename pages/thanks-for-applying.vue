<template>
  <div class='pa-1 mh-100v'>
    <a-row>
      <a-col>
        <h1 class='h1'>Thank You</h1>
        <p>
          Thank you for your interest in being a Provider at Mednoor Medical Center. Mednoor credentialing department
          will contact you as soon as possible
        </p>
        <div v-if='isComplete'>
          <a-alert message='Your profile information is complete and will be reviewed very soon.' :show-icon='true' type='info' :banner='true' class='mb-1'></a-alert>
          <a-button type="success" @click="$router.push(localePath('/view-mode'))">
            <a-icon type="home"></a-icon> Home.
          </a-button>
        </div>
        <div v-else>
          <a-alert message='Please complete your profile information before you get approved.' type='warning'
                 :show-icon='true' class='mb-1'></a-alert>
          <a-button type='success' @click='$router.push(localePath("/my-profile"))'>Complete Information.</a-button>
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<script>
export default {
  name: 'ThanksForApplying',
  middleware: ['authenticated', 'not-blocked', 'not-deleted', 'verified'],
  data: ()=>({
    isComplete: false,
  }),
  mounted() {
    console.log('[thanks-for-applying]: Mounted.')
    this.$api.get('/professional/my-record').then(({ data }) => {
      if (data && data.profe_uuid) {
        this.has_record = true
        this.isComplete = data.profe_specialty && data.profe_practice_name && data.profe_medical_license && data.profe_license_state && data.profe_credentials
      }
    })
  }
}
</script>
