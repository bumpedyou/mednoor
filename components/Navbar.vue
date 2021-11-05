<template>
  <div>
    <div class='menu-top-bar'>
     <img v-if="isSmall || isMiddle" v-click-outside='toggleChatNavigation' class='chat-icon' :src="require('~/static/icon/chat.svg')" alt='Chat icon' @click="toggleChatNavigation(true)">
      <nuxt-link v-else to="/" class='chat-icon'>
        <img :src="require('~/static/icon/chat.svg')" alt='Chat icon'>
      </nuxt-link>
      <nuxt-link to='/'>
        <div class='text'>
          MedNoor
        </div>
      </nuxt-link>
      <img v-click-outside='toggleMenuNavigation' class='menu-icon' :src="require('~/static/icon/menu.svg')" alt='Chat icon' @click='toggleMenuNavigation(true)'>
    </div>
    <div class='side-bars'>
      <transition name='side-slide' mode='out-in'>
        <div v-if='showChatNav' class='sidebar'>
          <sidebar-mobile-title>Chats</sidebar-mobile-title>
          <ChatItems :data="moderators" :selected-chat="to" @open-chat="openChat"></ChatItems>
          <!--
          <div>
            <chat-item>Johan Johnson</chat-item>
          </div>
          -->
        </div>
      </transition>
      <transition name='side-slide' mode='in-out'>
        <div v-if='showMenuNav' class='sidebar'>
          <sidebar-mobile-title>Menu</sidebar-mobile-title>
          <ul class='sidebar-menu-items'>
            <li v-for='(item, i) in menuItems' :key='i'>
              <nuxt-link :to='item.to'>
                <img :src="require('~/static/icon/' + item.icon +'.svg')" :alt="item.icon + ' icon'"> {{item.text}}
              </nuxt-link>
            </li>
          </ul>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import toggleDirectiveMixin from '~/mixins/toggleDirectiveMixin'
import userRoleMixin from '~/mixins/userRoleMixin'
import authMixin from '~/mixins/authMixin'
import SidebarMobileTitle from '~/components/SidebarMobileTitle'
import breakpoints from "~/mixins/breakpoints";
import ChatItems from "~/components/ChatItems";
import chatMixin from "~/mixins/chatMixin";
import listenMixin from "~/mixins/listenMixin";

export default {
  name: 'Navbar',
  components: {
    ChatItems,
    SidebarMobileTitle,
  },
  mixins: [toggleDirectiveMixin, authMixin, userRoleMixin, breakpoints, chatMixin, listenMixin],
  data: () => ({
    showChatNav: false,
    showMenuNav: false,
    to: '',
  }),
  computed: {
    myId(){
      return this.$auth.user.uuid
    },
    menuItems(){
      const items = []
      if (this.isLoggedIn){
        items.push({
          text: 'My Profile',
          icon: 'user',
          to: '/my-profile'
        })
        if (this.isModeratorOrHigher){
          items.push({
            text: 'Users List',
            icon: 'users',
            to: '/users-list'
          })
        }

        if (this.isUser){
          items.push({
            text: 'Available professionals',
            icon: 'tie',
            to: '/professionals'
          })
        }
        items.push({
          text: 'Sign Out',
          icon: 'sign-out',
          to: '/sign-out'
        })
      }else{
        items.push({
          text: 'Sign in',
          icon: 'sign-in',
          to: '/sign-in'
        },
          {
            text: 'Sign up',
            icon: 'user-plus',
            to: '/sign-up'
          })
      }
      return items
    },
    query (){
      return this.$route.query
    }
  },
  watch: {
    isLoggedIn(v){
      if (v){
        this.run_once(this.listen)
      }
    },
    query (){
      console.log('The query has changed')
      this.setChatFromRoute()
    },
  },
  mounted() {
    this.getChats()
    this.setChatFromRoute()

  },
  methods: {
    listen(){
      this.socket = this.$nuxtSocket({})
      this.socket.emit('join-room', this.myId)
      this.socket.on('user-reload', ()=>{
        this.getChats(true)
      })
    },
    setChatFromRoute(){
      const c = this.$route.query
      if (c && c.chat){
        this.to = c.chat
      }
    },
    openChat(uuid){
      this.$router.push({
        path: '/',
        query: {
          chat: uuid
        }
      })
    },
    showChatMobile(){
      console.log('Show Chat Mobile!')
    },
    toggleChatNavigation(clickFromInside){
      this.showChatNav = this.toggleDirective(this.showChatNav, clickFromInside)
    },
    toggleMenuNavigation(clickFromInside) {
      this.showMenuNav = this.toggleDirective(this.showMenuNav, clickFromInside)
    }
  }
}
</script>

<style scoped lang='sass'>
.side-slide-enter
  opacity: 0
  transform: translateX(10px)

.side-slide-enter-active, .side-slide-leave-active
  transition: all 600ms ease

.side-slide-leave-to
  transform: translateX(-10px)
  opacity: 0

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
  z-index: 200

  img
    height: 20px !important

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
    background: #fff
    width: 100%
    position: fixed
    z-index: 200
    right: 0
    left: 0
    bottom: 0
    top: 50px
    height: 100%

.sidebar-menu-items
  margin: 0
  padding: 0
  li
    margin: 0
    padding: 0
    list-style: none
    a
      display: flex
      align-items: center
      justify-content: flex-start
      padding: 1rem
      border: 1px solid $mdn-super-light-grey
      img
        width: 30px
        margin-right: 0.9rem
    a:first-of-type
      border-top: 0

</style>
