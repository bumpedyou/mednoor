<template>
  <div>
    <span class='clickable' @click='confirmAppointment'>Make Appointment</span>
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
export default {
  name: "MakeAppointment",
  props: {
    user: {
      type: Object,
      default: ()=>({})
    }
  },
  data() {
    return {
      loadingMakeAppointment: false,
      appointmentVisible: false,
    }
  },
  computed: {
    professional(){
      const u = this.$props.user
      if (u){
        if (u.user_uuid){
          return u.user_uuid
        }
        if (u.uuid){
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
      this.$api
        .post('/my-professional', {
          professional: this.professional,
        })
        .then(() => {
          this.$toast.success('Your request has been sent successfully.')
        })
        .catch((err) => {
          this.$toast.error(err)
        })
        .finally(() => {
          this.loadingMakeAppointment = false
          this.appointmentVisible = false
        })
    },
  },
}

</script>

<style scoped>

</style>
