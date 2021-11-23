<template>
  <div>
    <div class='menu-top-bar'>
      <div class="chat-icon">
      </div>
      <div class='mednoor-logo'>
        <nuxt-link v-for='(page, i) in pages' :key='i' :to='localePath({path: "/page/" + page.page_uuid + "/" + slugify(page.page_slug)})' style='margin-left: 0.3rem; margin-right: 0.3rem'>{{page.page_title}}</nuxt-link>
      </div>
      <!--
      <nuxt-link :to="localePath('/')">
        <div class='text mednoor-logo'>
          {{$t('med_med_cen')}}
        </div>
      </nuxt-link>
      -->
      <div v-click-outside='toggleMenuNavigation' class='menu-icon' @click='toggleMenuNavigation(true)' >
                  <div v-if="isLoggedIn">
                  <div v-if="isAdmin">
                    <a-button type="raisin-black">
                      {{$t('admin')}} <a-icon type="caret-down" />
                    </a-button>
                  </div>
                  <div v-else>
                    {{$auth.user.user_first_name}} {{$auth.user.last_name}} <a-icon type="caret-down" />
                  </div>
                </div>
        <!--<img v-else :src="require('~/static/icon/menu.svg')" alt='Chat icon'>-->
        Menu
      </div>
    </div>
    <div class='side-bars'>
      <transition name='side-slide' mode='out-in'>
        <div v-if='showChatNav' class='sidebar'>
          <sidebar-mobile-title>{{$t('chats')}}</sidebar-mobile-title>
          <ChatItems :data='moderators' :selected-chat='to' @open-chat='openChat'></ChatItems>
        </div>
      </transition>
      <transition name='side-slide' mode='in-out'>
        <div v-if='showMenuNav' class='sidebar menu-sidebar'>
          <sidebar-mobile-title>{{$t('menu')}}</sidebar-mobile-title>
          <ul class='sidebar-menu-items'>
            <li v-for='(item, i) in menuItems' :key='i'>
              <nuxt-link :to='localePath(item.to)' class="sidebar-item">
                <span>
                 {{ item.text }}
                </span>
                <img v-if='item.icon' :src="require('~/static/icon/' + item.icon +'.svg')" :alt="item.icon + ' icon'">
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
import breakpoints from '~/mixins/breakpoints'
import ChatItems from '~/components/ChatItems'
import chatMixin from '~/mixins/chatMixin'
import listenMixin from '~/mixins/listenMixin'
import utilsMixin from '~/mixins/utilsMixin'


export default {
  name: 'Navbar',
  components: {
    ChatItems,
    SidebarMobileTitle
  },
  mixins: [toggleDirectiveMixin, authMixin, userRoleMixin, breakpoints, chatMixin, listenMixin, utilsMixin],
  data: () => ({
    showChatNav: false,
    showMenuNav: false,
    to: '',
    pages: [],
  }),
  computed: {
    myId() {
      return this.$auth.user.uuid
    },
    menuItems() {
      const items = []
      if (this.isLoggedIn) {
        if (this.isAdmin || this.isSuper || this.isModerator){
         items.push({
            text: this.$t('dashboard'),
            icon: 'dashboard',
            to: '/dashboard'
          })
        }
        items.push({
          text: this.$t('my_profile'),
          icon: 'user',
          to: '/my-profile'
        })
        if (this.isAdmin || this.isSuper) {
          items.push({
            text: this.$t('usrs_list'),
            icon: 'users',
            to: '/users-list'
          })
        }
        if (this.isModerator || this.isAdmin || this.isSuper) {
          items.push({
            text: this.$t('professionals_list'),
            icon: 'tie',
            to: {
              path: '/users-list',
              query: {
                view: 'professionals'
              }
            }
          })
        }

        if (this.isModerator){
          items.push({
            text: this.$t('chat_requests'),
            icon: 'message-square-plus',
            to: '/chat-requests'
          })
          items.push({
            text: this.$t('my_patients'),
            icon: 'user',
            to: '/my-patients'
          })
        }


        if (this.isUser) {
          items.push({
            text: this.$t('av_prof'),
            icon: 'tie',
            to: '/professionals'
          })
        }

        if (this.isLoggedIn){
          items.push({
            text: this.$t('prev_c_pdf'),
            icon: 'file',
            to: '/my-chats'
          })
          items.push({
            text: this.$t('chats'),
            icon: 'chat',
            to: '/'
          })
        }

        items.push({
          text: this.$t('sign_out'),
          icon: 'sign-out',
          to: '/sign-out'
        })
      } else {
        items.push({
            text: this.$t('sign_in'),
            icon: 'sign-in',
            to: '/sign-in'
          },
          {
            text: this.$t('sign_up'),
            icon: 'user-plus',
            to: '/sign-up'
          })
        this.pages.forEach((page)=>{
          items.push({
            text: page.page_title,
            to: '/page/' + page.page_uuid + '/' + this.slugify(page.page_slug)
          })
        })
      }
      return items
    },
    query() {
      return this.$route.query
    }
  },
  watch: {
    isLoggedIn(v) {
      if (v) {
        this.run_once(this.listen)
      }
    },
    query() {
      this.setChatFromRoute()
    }
  },
  mounted() {
    this.getChats()
    this.setChatFromRoute()
    this.$api.get('/page').then(({data})=>{
      this.pages = data
    })
  },
  methods: {
    pageURL(page){
      return '/page/' + page.page_uuid + '/' + this.slugify(page.page_slug)
    },
    listen() {
      this.socket = this.$nuxtSocket({})
      this.socket.emit('join-room', this.myId)
      this.socket.on('user-reload', () => {
        this.getChats(true)
      })
      this.socket.on('chat-allowed', (data)=>{
        this.openNotification({
          title: 'Chat request accepted',
          description: this.$t('chat_r_acc')
        })
        this.$router.push({
          path: this.localePath('/'),
          query: {
            chat: data.professional
          }
        })
      })
    },
    setChatFromRoute() {
      const c = this.$route.query
      if (c && c.chat) {
        this.to = c.chat
      }
    },
    openChat(uuid) {
      this.$router.push({
        path: this.localePath('/'),
        query: {
          chat: uuid
        }
      })
    },
    toggleChatNavigation(clickFromInside) {
      this.showChatNav = this.toggleDirective(this.showChatNav, clickFromInside)
    },
    toggleMenuNavigation(clickFromInside) {
      this.showMenuNav = this.toggleDirective(this.showMenuNav, clickFromInside)
    }
  }
}
</script>

<style scoped lang='sass'>
.mednoor-logo
  color: $mdn-primary !important
  font-size: 14px !important

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
    &:hover
      cursor: pointer

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
      padding: 0.25rem
      border: 1px solid $mdn-super-light-grey

      img
        height: 11px
        margin-right: 0.9rem

    a:first-of-type
      border-top: 0

  .sidebar-item
    display: flex
    justify-content: center
    span
      margin-right: auto

.md-only
  display: none

@media screen and (min-width: $md)
  .side-bars
    .sidebar.menu-sidebar
      width: 200px
      left: auto
      right: 0
      box-shadow: 0 3px 6px $mdn-light-grey
  .md-only
    display: block

@media screen and (min-width: $lg)
  .side-bars
    .sidebar.menu-sidebar
      width: 210px

</style>
