<template>
<div class='pa-1 mh-100v'>
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
      <a-form-item>
        <PincodeInput v-model='pin' placeholder="0" :length="6"></PincodeInput>
      </a-form-item>

      <small class="d-flex mb-1">
        <nuxt-link :to='localePath("/forgot-pin")'>Forgot My PIN</nuxt-link> <a-divider type='vertical'></a-divider> <nuxt-link :to='localePath("/generate-new-pin")'>Generate a new PIN</nuxt-link>
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
import inputMixin from '~/mixins/inputMixin'
import SpinOrText from '~/components/SpinOrText'
import RequestModal from '~/components/RequestModal'

export default {
  name: 'Pin',
  components: {
    SpinOrText,
    RequestModal,
  },
  mixins: [inputMixin],
  middleware: ['authenticated', 'not-blocked', 'not-deleted'],
  data(){
    return {
      pin: '',
      loading: false,
      loadingMyRecord: true,
      has_record: false,
      hasRecord: false,
    }
  },
  watch: {
    pin(v){
      this.pin = this.numbersOnly(v)
    }
  },
  mounted() {
    console.log('[PIN] Mounted')
    this.$api.get('/professional/my-record').then(({data}) =>{
      console.log('------------------>', data, data.profe_uuid)
      if (data && data.profe_uuid){
        console.log('Has record')
        this.has_record = true
      }else{
        console.log('Does not have a record. Redirect')
        this.$router.push(this.localePath('/join-professionals'))
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
            this.$toast.success('Entering...')
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
