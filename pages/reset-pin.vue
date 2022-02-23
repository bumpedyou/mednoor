<template>
<div class='pa-6 mh-100v'>
  <v-row>
    <v-col>
      <v-breadcrumbs :items="[
        {
          text: 'Forgot MY PIN',
          to: localePath('/forgot-pin'),
          disabled: false,
        },
             {
          text: 'Verification code',
          disabled: true,
        }
      ]"></v-breadcrumbs>
    </v-col>
  </v-row>
  <v-row>
    <v-col>
      <p class='h1'>
        Reset PIN - Verification code.
      </p>
      <p>
        Enter the verification code that we sent you to you email.
      </p>
      <v-text-field v-model='verification_code' placeholder='Verification code' :maxlength='9'></v-text-field>
      <v-btn color='primary' small tile :loading="loading" @click='verify'>
          Verify
      </v-btn>
    </v-col>
  </v-row>
  <RequestModal ref='rmodal'></RequestModal>
</div>
</template>

<script>
import { mapMutations } from 'vuex'
import inputMixin from '~/mixins/inputMixin'

export default {
  name: 'ResetPin',
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
