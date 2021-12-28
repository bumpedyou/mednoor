<template>
  <div class='sidebar-mobile-title'>
    <span class='h3 mr-auto'><slot></slot></span>
    <v-icon class='mx-1 xx d-flex' @click="$emit('click', $event)">mdi-chevron-left</v-icon>
  </div>
</template>

<script>
export default {
  name: 'SidebarMobileTitle'
}
</script>

<style scoped lang='sass'>
.sidebar-mobile-title
  background: #fff
  padding: 1rem
  display: flex
  align-items: center
  width: 100%
  border-bottom: 1px solid $mdn-super-light-grey
  .xx
    margin-left: auto
    &:hover
      cursor: pointer

</style>
