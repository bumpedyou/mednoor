<template>
  <div class='sidebar-mobile-title'>
    <span class='h3'><slot></slot></span> <img :src="require('~/static/icon/chevron-left.svg')" alt='chevron-left icon'>
  </div>
</template>

<script>
export default {
  name: 'SidebarMobileTitle'
}
</script>

<style scoped lang='sass'>
.sidebar-mobile-title
  padding: 1rem
  display: flex
  justify-content: center
  align-items: center
  border-bottom: 1px solid $mdn-super-light-grey
  img
    margin-left: auto

@media screen and (min-width: $md)
  .sidebar-mobile-title
    display: none
</style>
