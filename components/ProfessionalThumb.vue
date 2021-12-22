<template>
  <div class='professional-thumb'>
    <div>
      <slot></slot>
      <div class='pp clickable' @click='getPath'>
        <ProfilePicture :user='$props.user'></ProfilePicture>
      </div>
      <div v-if="$props.showMakeAppointment" class='ac'>
        <MakeAppointment :user="$props.user"></MakeAppointment>
      </div>
    </div>
  </div>
</template>
<script>
import ProfilePicture from '~/components/ProfilePicture'
import MakeAppointment from "~/components/MakeAppointment";

export default {
  name: 'ProfessionalThumb',
  components: {MakeAppointment, ProfilePicture },
  props: {
    user: {
      type: Object,
      default: () => ({})
    },
    showMakeAppointment: {
      type: Boolean,
      default: true,
    }
  },
  methods: {
    getPath(){
      const u = this.$props.user || {}
      let p = "/user/"

      if (u.uuid){
        p += u.uuid
      }else if (u.user_uuid){
        p += u.user_uuid
      }

      this.$router.push(this.localePath(p))

    }
  }
}
</script>

<style scoped lang='sass'>
.professional-thumb
  display: flex
  justify-content: center
  align-items: center
  text-align: center
  padding: 1rem
  .pp
    display: flex
    justify-content: center
    align-items: center

  .ac
    text-align: center
</style>
