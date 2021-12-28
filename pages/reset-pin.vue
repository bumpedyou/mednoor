<template>
<div class='pa-6 mh-100v'>
  <a-row class='mb-1'>
    <a-col>
      <a-breadcrumb>
        <a-breadcrumb-item>
          <nuxt-link :to="localePath('/forgot-pin')">Forgot MY PIN</nuxt-link>
        </a-breadcrumb-item>
        <a-breadcrumb-item>
          Verification code
        </a-breadcrumb-item>
      </a-breadcrumb>
    </a-col>
  </a-row>
  <a-row>
    <a-col :xs='24' :sm='24' :md='12' :lg='8'>
      <p class='h1'>
        Reset PIN - Verification code.
      </p>
      <p>
        Enter the verification code that we sent you to you email.
      </p>
      <a-form-item>
        <a-input v-model='verification_code' placeholder='Verification code' :max-length='9'></a-input>
      </a-form-item>
      <a-button type='primary' @click='verify'>
        <SpinOrText v-model='loading'>
          Verify
        </SpinOrText>
      </a-button>
    </a-col>
  </a-row>
  <RequestModal ref='rmodal'></RequestModal>
</div>
</template>

<script>
import { mapMutations } from 'vuex'
import SpinOrText from '~/components/SpinOrText'
import inputMixin from '~/mixins/inputMixin'
import RequestModal from '~/components/RequestModal'

export default {
  name: 'ResetPin',
  components: { RequestModal, SpinOrText },
  mixins: [inputMixin],
  middleware: ['authenticated', 'not-blocked', 'not-deleted', 'verified'],
  data () {
    return {
      verification_code: '',
      loading: false,
    }
  },
  computed: {
    ...mapMutations({
      setCode: 'verification-code/setCode'
    }),
    email(){
      return this.$auth.user.email
    }
  },
  watch: {
    verification_code (v){
      this.verification_code = this.numbersOnly(v)
    }
  },
  methods: {
    verify(){
      const c = this.verification_code
      if (c && c.length === 9){
        this.loading = true
        this.$api.post('/verification-code/verify-pin', {
          code: this.verification_code
        }).then(({data})=>{
          if (data && data.valid){
            this.$store.commit('verification-code/setCode', this.verification_code)
            this.$router.push(this.localePath('/set-new-pin'))
          }else{
            this.$toast.error('The PIN is incorrect.')
          }
        }).catch((err) => {
          this.$refs.rmodal.$emit('error', err)
        }).finally(()=>{
          this.loading = false
        })
      }else{
        this.$toast.error('The verification code must contain exactly 9 digits.')
      }
    }
  }
}
</script>

<style scoped>

</style>
