<template>
<div class='profile-picture'>
  <div v-if='src'>
    <img :src='computedSrc' alt='Profile picture'>
  </div>
  <div v-else class='text-pic'>
    {{initials}}
  </div>
</div>
</template>

<script>
export default {
  name: 'ProfilePicture',
  props: {
    src: {
      type: String,
      default: null,
    },
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
      default: null,
    }
  },
  computed: {
    initials(){
      let i = ''
      const fn = this.$props.firstName; const ln = this.$props.lastName
      const full = this.$props.fullName
      if (fn && fn.length){
        i+= fn.charAt(0)
      }
      if (ln && ln.length){
        i+= ln.charAt(0)
      }
      if (full && full.length){
        const p = full.split(' ')
        if (p.length){
          const a = p[0].charAt(0)
          const b = p.length > 1 ? p[1].charAt(0) : ''
          i = a+b
        }
      }
      return i
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
  .text-pic
    font-size: 3rem
    color: $mdn-white
</style>
