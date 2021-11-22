<template>
  <div class='flags-picker'>
    <div v-for='(f, i) in $i18n.locales' :key='i' @click='locale(f.code)'>
      <img :src="require('~/static/flags/' + f.code + '.png')" height="30px" :alt='f.code'>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FlagsPicker',
  methods: {
    locale(code){
      this.$i18n.setLocale(code)
    }
  }
}
</script>

<style scoped lang='sass'>
.flags-picker
  display: flex
  justify-content: center
  align-items: center
  div
    margin-right: 0.6rem
    margin-left: 0.6rem
  img
    &:hover
      cursor: pointer
</style>
