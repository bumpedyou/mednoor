<template>
<div class='mh-100v'>
  <v-row>
    <v-col>
      <v-breadcrumbs :items="[
        {
          text: 'Home',
          to: localePath('/view-mode'),
          disabled: false,
        },
        {
          text: 'PIN',
          to: localePath('/pin'),
          disabled: true,
        }
      ]"></v-breadcrumbs>
    </v-col>
  </v-row>
  <v-row v-if='loadingMyRecord'>
    <v-col>
      <v-skeleton-loader></v-skeleton-loader>
    </v-col>
  </v-row>
  <v-row v-else-if='has_record'>
    <v-col md="12">
      <p class='h4 mb-1'>
        PIN
      </p>
      <div>
        <label class='d-block'>PIN</label>
        <PincodeInput v-model='pin' placeholder="0" :length="6"></PincodeInput>
      </div>
      <small class="d-flex mb-1">
        <nuxt-link :to='localePath("/forgot-pin")'>Forgot My PIN</nuxt-link>
      </small>
      <v-btn tile small color="primary" :loading="loading" @click="enter">
        Enter
      </v-btn>
    </v-col>
  </v-row>
  <RequestModal ref='rmodal'></RequestModal>
</div>
</template>

<script>
import {mapMutations} from 'vuex'
import inputMixin from '~/mixins/inputMixin'
import redirectionMixin from '~/mixins/redirectionMixin'

export default {
  name: 'Pin',

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
