<template>
  <div :key="count">
    <div v-if="$props.button">
      <v-btn v-if="isMade" small tile color="success">
        Appointment Queued <a-icon type="check-circle"></a-icon>
      </v-btn>
      <v-btn v-else-if="isLoggedIn" small tile color="info" @click='confirmAppointment'>
        Make Appointment
      </v-btn>
    </div>
    <div v-else class="mt-3">
      <small v-if="isMade" class="success--text">
        Appointment Queued <a-icon type="check-circle"></a-icon>
      </small>
      <small v-else-if="isLoggedIn" :class='makeClasses' @click='confirmAppointment'>
        Make Appointment
      </small>
    </div>

    <a-modal
      :title="$t('conf_action')"
      :visible='appointmentVisible'
      :confirm-loading='loadingMakeAppointment'
      @ok='makeAppointment'
      @cancel='cancelMakeAppointment'
    >
      <p>{{ $t('conf_send_ch') }}</p>
    </a-modal>
  </div>
</template>
<script>
import userRoleMixin from "~/mixins/userRoleMixin";
import authMixin from "~/mixins/authMixin";

export default {
  name: "MakeAppointment",
  mixins: [userRoleMixin, authMixin],
  props: {
    user: {
      type: Object,
      default: () => ({})
    },
    superSmall: {
      type: Boolean,
      default: true,
    },
    button: {
      type: Boolean,
      default: false,
    }
  },
  data() {
    return {
      loadingMakeAppointment: false,
      appointmentVisible: false,
      count: 0,
    }
  },
  computed: {
    isMade(){
      const a = this.$cookies.get('appointments')
      let includes = false
      if (a){
        a.forEach((item)=>{
          if (item.professional === this.professional){
            includes = true
          }
        })
      }
      return includes || this.count > 0
    },
    makeClasses(){
      const c = ['clickable']
      if (this.$props.superSmall){
        c.push('super-small')
      }
      return c.join(' ')
    },
    professional() {
      const u = this.$props.user
      if (u) {
        if (u.user_uuid) {
          return u.user_uuid
        }
        if (u.uuid) {
          return u.uuid
        }
      }
      return null
    }
  },
  methods: {
    cancelMakeAppointment() {
      if (this.loadingMakeAppointment) {
        return false
      }
      this.appointmentVisible = false
    },
    confirmAppointment() {
      this.appointmentVisible = true
    },
    makeAppointment() {
      if (this.$auth.user.has_phone){
        this.$api
          .post('/my-professional', {
            professional: this.professional,
          })
          .then(() => {
            this.$toast.success('Your request has been sent successfully.')
            const ids = this.$cookies.get('appointments')
            console.log('ids are currently', ids)
            ids.push({professional: this.professional})
            console.log('Push --->', this.professional)
            this.$cookies.set('appointments', ids)
            console.log('ids are now --->', this.$cookies.get('appointments'))
            this.count++
          })
          .catch((err) => {
            this.$toast.error(err)
          })
          .finally(() => {
            this.loadingMakeAppointment = false
            this.appointmentVisible = false
          })
      }else{
        this.appointmentVisible = false
        this.$toast.error('Please add your phone number to your account to make an appointment.')
        setTimeout(() => {
          this.$router.push(this.localePath('/my-profile'))
        }, 1000)
      }
    },
  },
}

</script>

<style scoped>

</style>
