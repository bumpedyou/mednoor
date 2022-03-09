<template>
  <div :key="count">
    <div v-if="$props.button">
      <v-btn v-if="isMade" small tile color="success">
        Appointment Queued <v-icon class="ml-1">mdi-check-circle</v-icon>
      </v-btn>
      <v-btn v-else-if="isLoggedIn" small tile color="info" @click='confirmAppointment'>
        Make Appointment
      </v-btn>
    </div>
    <div v-else class="mt-3">
      <small v-if="isMade" class="success--text">
        Appointment Queued 
        <span v-if="isActive"><v-icon class="ml-1">mdi-check-circle</v-icon></span>
      </small>
      <small v-else-if="isLoggedIn" :class='makeClasses' @click='confirmAppointment'>
        Make Appointment
      </small>
    </div>
    <ConfirmDialog v-model="appointmentVisible" :title="$t('conf_action').toString()" :description="$t('conf_send_ch').toString()" :loading="loadingMakeAppointment" @accept="makeAppointment" @cancel="cancelMakeAppointment"></ConfirmDialog>
  </div>
</template>
<script>
import userRoleMixin from "~/mixins/userRoleMixin";
import authMixin from "~/mixins/authMixin";
import ConfirmDialog from "~/components/ConfirmDialog";

export default {
  name: "MakeAppointment",
  components: {ConfirmDialog},
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
    },
   
  },
  data() {

    return {
      loadingMakeAppointment: false,
      appointmentVisible: false,
      count: 0,
       myProfessionals:[]
    }
  },



  computed: {
    isMade(){
      const a = this.$cookies.get('appointments');
     
      let includes = false
      if (a){
        a.forEach((item)=>{
          if (item.professional === this.professional){
            includes = true
          }
        })
      }
 // console.log(a,this.professional )
      return includes || this.count > 0
    },

    isActive(){

    //  console.log(this.myProfessionals)
      return this.myProfessionals.find(x=>x.user_uuid === this.professional);
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
    },
  },
    mounted(){
          this.$api
          .get('/my-professional')
          .then((res) => {
             // console.log(res)
          this.myProfessionals = res.data || []
          })
          .catch((err) => {
            this.$toast.error(err)
          })
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
