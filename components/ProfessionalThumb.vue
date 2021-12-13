<template>
  <div class='professional-thumb'>
    <div>
      <div class='pp clickable' @click='getPath'>
        <ProfilePicture :user='$props.user'></ProfilePicture>
      </div>
      <div class='ac d-none'>
        <span class='clickable' @click='getPath'>Appointment call</span>
      </div>
    </div>
  </div>
</template>

<script>
import ProfilePicture from '~/components/ProfilePicture'

export default {
  name: 'ProfessionalThumb',
  components: { ProfilePicture },
  props: {
    user: {
      type: Object,
      default: () => ({})
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
