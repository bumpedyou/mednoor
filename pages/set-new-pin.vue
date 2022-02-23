<template>
<div class='pa-6 mh-100v'>
  <v-row class='mb-1'>
    <v-col>
      <v-breadcrumbs :items="[
        {
          text: 'Forgot MY PIN',
          to: localePath('/forgot-pin'),
          disabled: false,
        },
           {
          text: 'Verification code',
          to: localePath('/reset-pin'),
          disabled: false,
        },
        {
          text: 'Set new PIN',
          disabled: true,
        }
      ]"></v-breadcrumbs>
    </v-col>
  </v-row>
  <v-row>
    <v-col>
      <p class='h1'>
        Set your new PIN
      </p>
      <div class="mb-3">
        <label class='d-block'>New PIN</label>
        <PincodeInput v-model='new_pin' placeholder="0" :length="6"></PincodeInput>
      </div>
      <div class="mb-6">
        <label class='d-block'>Verify your new PIN</label>
        <PincodeInput v-model='verify_new_pin' placeholder="0" :length="6"></PincodeInput>
      </div>
      <v-btn small tile :disabled='!enabled' color='primary' :loading="loading" @click='setNewPin'>
        Set my new PIN
      </v-btn>
    </v-col>
  </v-row>
  <RequestModal ref='rmodal'></RequestModal>
</div>
</template>

<script>
import {mapMutations} from 'vuex'

export default {
  name: 'SetNewPin',
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
