<template>
<div class='pa-1 mh-100v'>
  <a-row class='mb-1'>
    <a-col>
      <a-breadcrumb>
        <a-breadcrumb-item>
          <nuxt-link :to="localePath('/forgot-pin')">Forgot MY PIN</nuxt-link>
        </a-breadcrumb-item>
      </a-breadcrumb>
    </a-col>
  </a-row>
  <a-row>
    <a-col :xs='24'>
      <h1 class='mb-1'>
        Forgot my PIN
      </h1>
    </a-col>
    <a-col :xs='24' :sm='24' :md='12' :lg='8'>
      <a-alert type='info' message='We will send you a verification code to your email to reset your PIN code.' :show-icon='true'></a-alert>
      <a-form @submit.prevent>
        <a-form-item>
          <a-input v-model='email' placeholder='email' disabled></a-input>
        </a-form-item>
        <a-form-item>
          <a-button type='primary' @click='sendEmail'>
            <SpinOrText v-model='loading'>
              Send me the email.
            </SpinOrText>
          </a-button>
        </a-form-item>
      </a-form>
    </a-col>
  </a-row>
  <RequestModal ref='rmodal'></RequestModal>
</div>
</template>

<script>
import SpinOrText from '~/components/SpinOrText'
import RequestModal from '~/components/RequestModal'
export default {
  name: 'ForgotPin',
  components: { RequestModal, SpinOrText },
  middleware: ['authenticated', 'not-blocked', 'not-deleted'],
  data () {
    return {
      loading: false,
    }
  },
  computed: {
    email(){
      return this.$auth.user.email
    }
  },
  methods: {
    sendEmail(){
      console.log('Sending email')
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
