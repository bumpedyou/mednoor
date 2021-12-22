<template>
<div class='pa-1 mh-100v'>
  <a-row class='mb-1'>
    <a-col>
      <a-breadcrumb>
        <a-breadcrumb-item>
          <nuxt-link :to="localePath('/forgot-pin')">Forgot MY PIN</nuxt-link>
        </a-breadcrumb-item>
        <a-breadcrumb-item>
          <nuxt-link :to="localePath('/reset-pin')">Verification code</nuxt-link>
        </a-breadcrumb-item>
        <a-breadcrumb-item>
          Set new PIN
        </a-breadcrumb-item>
      </a-breadcrumb>
    </a-col>
  </a-row>
  <a-row>
    <a-col :xs='24' :sm='24' :md='12' :lg='8'>
      <p class='h1'>
        Set your new PIN
      </p>
      <a-form-item label='PIN'>
        <PincodeInput v-model='new_pin' placeholder="0" :length="6"></PincodeInput>
      </a-form-item>
      <a-form-item label='PIN'>
        <PincodeInput v-model='verify_new_pin' placeholder="0" :length="6"></PincodeInput>
      </a-form-item>
      <a-button :disabled='!enabled' type='primary' @click='setNewPin'>
        <SpinOrText v-model='loading'>
          Set my new PIN
        </SpinOrText>
      </a-button>
    </a-col>
  </a-row>
  <RequestModal ref='rmodal'></RequestModal>
</div>
</template>

<script>
import {mapMutations} from 'vuex'
import SpinOrText from '~/components/SpinOrText'
import RequestModal from '~/components/RequestModal'

export default {
  name: 'SetNewPin',
  components: { RequestModal, SpinOrText },
  middleware: ['authenticated', 'not-blocked', 'not-deleted', 'verified'],
  data: () =>({
    new_pin: '',
    verify_new_pin: '',
    loading: false,
  }),
  computed: {
    verificationCode(){
      return this.$store.state['verification-code'].code
    },
    enabled(){
      return this.new_pin.length === 6 && this.new_pin === this.verify_new_pin
    },
    ...mapMutations({
      setCode: 'verification-code/setCode'
    })
  },
  mounted() {
    if (!this.verificationCode || this.verificationCode.length !== 9) {
      this.$toast.error('Enter the verification code again.')
      setTimeout(() =>{
        this.$router.push(this.localePath('/reset-pin/'))
      }, 1000)
    }
  },
  methods: {
    setNewPin(){
      const n = this.new_pin
      const v = this.verify_new_pin
      if (v && n && v.length === 6 && n === v){
        this.loading = true
        this.$api.post('/professional/reset-pin', {
          pin: v,
          verification_code: this.verificationCode
        }).then(()=>{
          this.$toast.success('You new pin has been saved.')
          this.$store.commit('verification-code/setCode', null)
          this.$router.push(this.localePath('/pin'))
        }).catch((err)=>{
          this.$refs.rmodal.$emit('error', err)
        }).finally(()=>{
          this.loading = false
        })
      }else{
        this.$toast.error('Your PIN codes must match and have 6 digits.')
      }
    }
  }
}
</script>

<style scoped>
</style>
