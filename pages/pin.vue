<template>
<div class='pa-1 mh-100v'>
  <a-row class='mb-1'>
    <a-col>
      <a-breadcrumb>
        <a-breadcrumb-item>
          <nuxt-link :to="localePath('/view-mode')">Home</nuxt-link>
        </a-breadcrumb-item>
        <a-breadcrumb-item>
          <nuxt-link :to="localePath('/pin')">PIN</nuxt-link>
        </a-breadcrumb-item>
      </a-breadcrumb>
    </a-col>
  </a-row>
  <a-row v-if='loadingMyRecord'>
    <a-col>
      <a-skeleton></a-skeleton>
    </a-col>
  </a-row>
  <a-row v-else-if='has_record'>
    <a-col :xs='24' :sm='24'>
      <p class='h4 mb-1'>
        PIN
      </p>
      <a-form-item label='PIN'>
        <PincodeInput v-model='pin' placeholder="0" :length="6"></PincodeInput>
      </a-form-item>
      <small class="d-flex mb-1">
        <nuxt-link :to='localePath("/forgot-pin")'>Forgot My PIN</nuxt-link>
      </small>
      <a-button type='primary' @click='enter'>
        <SpinOrText v-model='loading'>
          Enter
        </SpinOrText>
      </a-button>
    </a-col>
  </a-row>
  <RequestModal ref='rmodal'></RequestModal>
</div>
</template>

<script>
import {mapMutations} from 'vuex'
import inputMixin from '~/mixins/inputMixin'
import SpinOrText from '~/components/SpinOrText'
import RequestModal from '~/components/RequestModal'
import redirectionMixin from '~/mixins/redirectionMixin'

export default {
  name: 'Pin',
  components: {
    SpinOrText,
    RequestModal,
  },
  mixins: [inputMixin, redirectionMixin],
  middleware: ['authenticated', 'verified', 'not-blocked', 'not-deleted', 'view-set'],
  data(){
    return {
      pin: '',
      loading: false,
      loadingMyRecord: true,
      has_record: false,
      hasRecord: false,
    }
  },
  computed: {
    ...mapMutations({
      setPin: 'pin/setPIN',
      setValid: 'pin/setValid'
    })
  },
  watch: {
    pin(v){
      this.pin = this.numbersOnly(v)
    }
  },
  mounted() {
    this.$api.get('/professional/my-record').then(({data}) =>{
      if (data && data.profe_uuid){
        this.has_record = true
        const isComplete = data.profe_specialty && data.profe_practice_name && data.profe_medical_license && data.profe_license_state && data.profe_credentials

        if (!isComplete){
          return this.$router.push({
            path: this.localePath('/my-profile')
          })
        }

        if (!data.profe_is_active){
          return this.$router.push(this.localePath('/thanks-for-applying'))
        }

        console.log('Has PIN', data.has_pin)
        if (!data.profe_pin_set){
          console.log('Does not have a PIN')
          this.$store.commit('pin/setPIN', 'reset1')
          this.$store.commit('pin/setValid', true)
          console.log(this.$store.state.pin.pin)
          this.$router.push(this.localePath('/change-my-pin'))
        }

      }else{
        this.$router.push(this.localePath('/become-a-provider'))
      }
    }).catch((err) =>{
      this.$refs.rmodal.$emit('error', err)
    }).finally(() => {
      this.loadingMyRecord = false
    })
  },
  methods: {
    enter(){
      if (this.pin.length !== 6){
        this.$toast.error('The pin code must contain 6 digits.')
        return false
      }
      this.loading = true
      this.$api.post('/professional/verify-pin', {
        pin: this.pin,
      }).then(({data})=>{
        if (data){
          if (data.redirect){
            this.$toast.error('Please wait until a professional reviews your profile.')
          }else if (data.success){
            // Store the PIN
            this.$store.commit('pin/setPIN', this.pin)
            this.$store.commit('pin/setValid', true)
            this.checkRedirect()
          }else{
            this.$toast.error('Incorrect pin')
          }
        }
      }).catch((err)=>{
        this.$refs.rmodal.$emit('error', err)
      }).finally(() => {
        this.loading = false
      })

    }
  }
}
</script>

<style scoped>

</style>
