<template>
  <div :class='computedClass'>
    <div v-if='src' :style='computedSrc' class='picture-bg'>
    </div>
    <div v-else class='text-pic'>
      {{ initials }}
    </div>
    <div v-if="!$props.small && !$props.xSmall" class='name super-small'>
      <small v-if="credentials">{{[name, credentials].join(', ')}}</small>
      <small v-else>{{name}}</small>
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
    },
    xSmall: {
      type: Boolean,
      default: false,
    },
    small: {
      type: Boolean,
      default: false,
    }
  },
  computed: {
    computedClass(){
      const c = ['profile-picture']

      if (this.$props.xSmall){
        c.push('x-small')
      }else if (this.$props.small) {
        c.push('small')
      }

      return c.join(' ')
    },
    credentials(){
      const u = this.$props.user
      let credentials = null
      if (u && u.profe_credentials){
        credentials = u.profe_credentials
      }
      return credentials
    },
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
      if (this.$props.user && this.$props.user.picture){
        return this.$props.user.picture
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
          return [u.user_last_name, u.user_first_name].join(' ')
        }else if (u.full_sname){
          return u.full_sname
        }
      }
      return ''
    },
    initials() {
      let i = ''
      if (typeof this.name === 'string' && this.name.length){
        const n = this.name.split(' ')
        console.log('n --->', this.name, this.name.split(' '))
        if (n.length >= 2){
          i+= this.getInitial(n[0])
          i+= this.getInitial(n[1])
          if (n.length > 2){
            i+= this.getInitial(n[2])
          }
        }
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
  width: 130px
  height: 130px
  background: $mdn-primary
  display: flex
  justify-content: center
  align-items: center
  position: relative
  box-shadow: 0 3px 6px #eee
  border: 1px solid #ccc
  .text-pic
    font-size: 3rem
    color: $mdn-white

  .name
    position: absolute
    bottom: 0
    right: 0
    left: 0
    background: $mdn-white
    color: $mdn-primary
    display: block
    text-align: center

  .picture-bg
    width: 100%
    height: 100%
    background-position: center
    background-size: cover

.profile-picture.small
  width: 60px
  height: 60px
  .text-pic
    font-size: 0.6rem !important

.profile-picture.x-small
  width: 30px !important
  height: 30px !important
  .text-pic
    font-size: 0.6rem !important

@media screen and (min-width: $md)
  .profile-picture
    width: 133px
    height: 133px

@media screen and (min-width: $lg)
  .profile-picture
    width: 150px
    height: 150px
</style>
