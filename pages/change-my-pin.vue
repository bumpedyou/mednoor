<template>
<div class="pa-6 mh-100v">
  <v-row>
    <v-col md="12">
      <p class="h1">
        Change my PIN
      </p>
    </v-col>
    <v-col md="12">
      <div>
        <!--Current PIN-->
        <label class="d-block">
          Enter your PIN
        </label>
        <PincodeInput v-show='current_enabled' v-model='current_pin' placeholder="0" :length="6"></PincodeInput>
        <v-alert v-if='!current_enabled' color='info'>
          <v-icon class="mr-1">mdi-information</v-icon>
          You do not have a PIN.
        </v-alert>
      </div>
      <hr class="my-3">
      <div>
        <!--New PIN-->
        <label class="d-block">
          New PIN
        </label>
        <PincodeInput v-model='new_pin' placeholder="0" :length="6"></PincodeInput>
      </div>
      <div>
        <!--Confirm your new pin-->
        <label class="d-block">
          Confirm your new PIN
        </label>
        <PincodeInput v-model='verify_new_pin' placeholder="0" :length="6"></PincodeInput>
      </div>
    </v-col>
    <v-col>
      <v-btn :disabled='!enabled' color='primary' :loading="loading" small tile @click='resetPIN'>
        Set my new PIN
      </v-btn>
    </v-col>
  </v-row>
  <RequestModal ref='rmodal'></RequestModal>
</div>
</template>

<script>
export default {
  name: 'ChangeMyPin',
  middleware: ['authenticated', 'not-blocked', 'verified', 'not-deleted', 'pin-set', 'view-set'],
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
    if (this.c_pin === 'reset1'){
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
