<template>
  <div class='pa-6 mh-100v'>
    <v-row>
      <v-col>
        <h1 class='h1'>Thank You</h1>
        <p>
          Thank you for your interest in being a Provider at Mednoor Medical Center. Mednoor credentialing department
          will contact you as soon as possible
        </p>
        <div v-if='isComplete'>
          <v-alert color="info" class='mb-1'>
            <v-icon>mdi-information</v-icon>
            Your profile information is complete and will be reviewed very soon.
          </v-alert>
          <v-btn color="success" small tile @click="$router.push(localePath('/view-mode'))">
            <v-icon>mdi-home</v-icon> Home.
          </v-btn>
        </div>
        <div v-else>
          <v-alert color="warning" class="mb-1">
            <v-icon>mdi-alert</v-icon>
            Please complete your profile information before you get approved.
          </v-alert>
          <v-btn tile small color='success' :to='$router.push(localePath("/my-profile"))'>Complete Information.</v-btn>
        </div>
      </v-col>
    </v-row>
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
    this.$api.get('/professional/my-record').then(({ data }) => {
      if (data && data.profe_uuid) {
        this.has_record = true
        this.isComplete = data.profe_specialty && data.profe_practice_name && data.profe_medical_license && data.profe_license_state && data.profe_credentials
      }
    })
  }
}
</script>
