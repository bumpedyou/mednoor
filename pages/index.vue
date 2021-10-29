<template>
  <div>
    <div class='menu-top-bar'>
      <img class='chat-icon' :src="require('~/static/icon/chat.svg')" alt='Chat icon' @click='openChat'>
      <nuxt-link to='/'>
        <div class='text'>
          MedNoor
        </div>
      </nuxt-link>
      <img class='menu-icon' :src="require('~/static/icon/menu.svg')" alt='Chat icon' @lick='openMenu'>
    </div>
    <div class='side-bars'>
      <div class='sidebar'>
        <sidebar-mobile-title>Chats</sidebar-mobile-title>
        <div>
          <chat-item>Johan Johnson</chat-item>
          <chat-item active>Marcus Smith</chat-item>
          <chat-item>John Doe</chat-item>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  head() {
    return {
      title: 'Home',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: 'Mednoor is a real-time chat application.'
        },
        {
          hid: 'og:description',
          name: 'og:description',
          content: 'Mednoor is a real-time chat application.'
        }
      ]
    }
  },
  methods: {
    openChat() {

    },
    openMenu() {

    }
  }
}
</script>
<style scoped lang='sass'>
.menu-top-bar
  height: 50px
  position: fixed
  top: 0
  left: 0
  right: 0
  bottom: 0
  background-color: #fff
  box-shadow: 0 3px 6px $mdn-super-light-grey
  display: flex
  align-items: center
  padding: 0 1rem

  img
    height: 30px !important

    &:hover
      cursor: pointer

  .chat-icon
    margin-right: auto

  .menu-icon
    margin-left: auto

  .text
    font-size: 1rem


.side-bars
  .sidebar
    width: 100%
    position: fixed
    right: 0
    left: 0
    bottom: 0
    top: 50px
    height: 100%


</style>
