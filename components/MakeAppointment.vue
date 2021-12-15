<template>
  <div v-if="!isModeratorOrHigher">
    <small :class='makeClasses' @click='confirmAppointment'>Make Appointment</small>
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

export default {
  name: "MakeAppointment",
  mixins: [userRoleMixin],
  props: {
    user: {
      type: Object,
      default: () => ({})
    },
    superSmall: {
      type: Boolean,
      default: true,
    }
  },
  data() {
    return {
      loadingMakeAppointment: false,
      appointmentVisible: false,
    }
  },
  computed: {
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
