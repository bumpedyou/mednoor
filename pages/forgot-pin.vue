<template>
<div class='pa-6 mh-100v'>
  <v-row class='mb-1'>
    <v-col md="12">
      <v-breadcrumbs :items="[
        {
          text: 'Home',
          to: localePath('/view-mode'),
          disabled: false,
        },
           {
          text: 'PIN',
          to: localePath('/pin'),
          disabled: false,
        },
          {
          text: ' Forgot my PIN',
          disabled: true,
        },

      ]"></v-breadcrumbs>
    </v-col>
  </v-row>
  <v-row>
    <v-col>
      <h1 class='mb-1'>
        Forgot my PIN
      </h1>
    </v-col>
    <v-col md="12">
      <v-alert type='info' dark>
        We will send you a verification code to your email to reset your PIN code.
      </v-alert>
      <v-form ref="form" v-model="valid" @submit.prevent>
        <v-text-field v-model='email' placeholder='email' disabled></v-text-field>
        <v-btn color='primary' small tile :loading="loading" @click='sendEmail'>
          Send me the email.
        </v-btn>
      </v-form>
    </v-col>
  </v-row>
  <RequestModal ref='rmodal'></RequestModal>
</div>
</template>

<script>

export default {
  name: 'ForgotPin',
  middleware: ['authenticated', 'not-blocked', 'not-deleted', 'verified'],
  data () {
    return {
      loading: false,
      valid: false,
    }
  },
  computed: {
    email(){
      return this.$auth.user.email
    }
  },
  methods: {
    sendEmail(){
      this.loading = true
      this.$api.post('/verification-code/pin').then(()=>{
        this.$toast.success('Email has been sent successfully.')
        this.$router.push(this.localePath('/reset-pin'))
      }).catch((err) => {
        this.$refs.rmodal.$emit('error', err)
      }).finally(()=>{
        this.loading = false
      })
    }
  }
}
</script>

<style scoped>

</style>
