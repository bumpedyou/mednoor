<template>
  <div class='profile-picture'>
    <div v-if='src' :style='computedSrc' class='picture-bg'>
    </div>
    <div v-else class='text-pic'>
      {{ initials }}
    </div>
    <div class='name'>
      <small>{{name}}</small>
    </div>
    <div>
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProfilePicture',
  props: {
    firstName: {
      type: String,
      default: null
    },
    lastName: {
      type: String,
      default: null
    },
    fullName: {
      type: String,
      default: null
    },
    user: {
      type: Object,
      default: () => ({})
    },
    picture: {
      type: String,
      default: null,
    }
  },
  computed: {
    computedSrc(){
      return 'background-image: url(' + process.env.API_URL + '/profile/' + this.src + ')'
    },
    src(){
      if (this.$props.picture){
        return this.$props.picture
      }
      if (this.$props.user && this.$props.user.user_picture){
        return this.$props.user.user_picture
      }
      return null
    },
    name(){
      const fn = this.$props.firstName
      const ln = this.$props.lastName
      const full = this.$props.fullName

      if (fn && ln){
        return [fn,ln].join(' ')
      }else if (full){
        return full
      }else if (this.$props.user){
        const u = this.$props.user
        if (u.user_first_name && u.user_last_name){
          return [u.user_first_name, u.user_last_name].join(' ')
        }else if (u.full_name){
          return u.full_name
        }
      }
      return ''
    },
    initials() {
      let i = ''
      const fn = this.$props.firstName
      const ln = this.$props.lastName
      const full = this.$props.fullName
      i += this.getInitial(fn)
      i += this.getInitial(ln)
      if (full && full.length) {
        const p = full.split(' ')
        if (p.length) {
          const a = this.getInitial(p[0])
          const b = p.length > 1 ? this.getInitial(p[1]) : ''
          i = a + b
        }
      }
      const u = this.$props.user
      if (u && (u.user_first_name || u.user_last_name || u.full_name)) {
        i+= this.getInitial(u.user_first_name)
        i+= this.getInitial(u.user_last_name)
        i+= this.getInitial(u.full_name)
      }
      return i
    }
  },
  methods: {
    getInitial(str) {
      let l = ''
      if (str && typeof str === 'string' && str.length) {
        l = str.charAt(0)
      }
      return l
    }
  }
}
</script>

<style scoped lang='sass'>
.profile-picture
  width: 100px
  height: 100px
  background: $mdn-primary
  display: flex
  justify-content: center
  align-items: center
  position: relative
  .text-pic
    font-size: 3rem
    color: $mdn-white

  .name
    position: absolute
    bottom: 0
    right: 0
    left: 0
    background: rgba(0,0,0,0.8)
    color: $mdn-white
    display: block
    text-align: center

  .picture-bg
    width: 100%
    height: 100%
    background-position: center
    background-size: cover

@media screen and (min-width: $md)
  .profile-picture
    width: 120px
    height: 120px

@media screen and (min-width: $lg)
  .profile-picture
    width: 150px
    height: 150px
</style>
