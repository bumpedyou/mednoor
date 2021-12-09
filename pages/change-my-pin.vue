<template>
<div class="pa-1 mh-100v">
  <a-row>
    <a-col>
      <p class="h1">
        Change my PIN
      </p>
    </a-col>
    <a-col>
      <a-form-item label="Current PIN">
        <PincodeInput v-show='current_enabled' v-model='current_pin' placeholder="0" :length="6"></PincodeInput>
        <a-alert v-if='!current_enabled' type='info' :show-icon='true' message="You do not have a PIN."></a-alert>
      </a-form-item>
      <hr>
      <a-form-item label='New PIN'>
        <PincodeInput v-model='new_pin' placeholder="0" :length="6"></PincodeInput>
      </a-form-item>
      <a-form-item label='Confirm your new pin'>
        <PincodeInput v-model='verify_new_pin' placeholder="0" :length="6"></PincodeInput>
      </a-form-item>
    </a-col>
    <a-col>
      <a-button :disabled='!enabled' type='primary' @click='resetPIN'>
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
import SpinOrText from '~/components/SpinOrText'
import RequestModal from '~/components/RequestModal'
export default {
  name: 'ChangeMyPin',
  components: { RequestModal, SpinOrText },
  middleware: ['authenticated', 'not-blocked', 'not-deleted', 'pin-set'],
  data: ()=>({
    current_pin: '',
    new_pin: '',
    verify_new_pin: '',
    loading: false,
    current_enabled: true,
  }),
  computed: {
    c_pin(){
      return this.$store.state.pin.pin
    },
    enabled(){
      return this.new_pin.length === 6 && this.new_pin === this.verify_new_pin && this.current_pin.length === 6 && this.new_pin !== this.current_pin
    },
  },
  mounted () {
    console.log(this.c_pin)
    if (this.c_pin === 'reset1'){
      console.log('reset')
      this.current_pin = '000000'
      this.current_enabled = false
    }
  },
  methods: {
    resetPIN(){
      this.loading = true
      this.$api.put('/professional/pin', {
        new_pin: this.new_pin,
        previous_pin: this.current_pin
      }).then(()=>{
        this.$toast.success('Your PIN has been updated')
        this.$router.push(this.localePath('/pin'))
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
