<template>
  <div class='nv-top'>
    <div class='menu-top-bar'>
      <div class='chat-icon'>
        <nuxt-link v-if='isLoggedIn' :to="localePath('/')">
          <img :src='require("~/static/logo.png")' height='40px' />
        </nuxt-link>
        <nuxt-link v-else :to="localePath('/sign-in')">
          <img :src='require("~/static/logo.png")' height='40px' />
        </nuxt-link>
      </div>
      <!--
      <div v-if='!isSmall && !$props.hideMiddle' class='mednoor-logo'>
        <nuxt-link v-for='(page, i) in pages' :key='i'
                   :to='localePath({path: "/page/" + page.page_uuid + "/" + slugify(page.page_slug)})'
                   style='margin-left: 0.3rem; margin-right: 0.3rem'>{{ page.page_title }}
        </nuxt-link>
        <nuxt-link :to="localePath('/professionals')">Directory</nuxt-link>
      </div>
      -->
      <div class='menu-icon'>
        
        <!-- <div v-if="isLoggedIn" class='mr-1 pay-icon' >
          <a @click='onClickPayment()'>
          <img :src="require('~/static/pay.png')" alt="pay">
          </a>
        </div> -->
        
        <!--
        <div v-if="isLoggedIn" class='mx-1'>
          <v-tab>
            <v-badge
              class="mr-1"
              overlap
              color="primary"
              content="0"
            >
              <v-icon>mdi-bell</v-icon>
            </v-badge>
          </v-tab>
        </div>
        -->
        <div class='mr-1'>
          <div class='lang-selector' @click='showLocales = !showLocales'>
            <div class='current'>
              {{ selectedLocale.toUpperCase() }}
              <v-icon class="d-md-only">mdi-menu-down</v-icon>
            </div>
            <ul v-if='showLocales' class='options'>
              <li v-for='(l, i) in $i18n.localeCodes' :key='i' :class='l === selectedLocale ? "active" : ""'
                  @click='$i18n.setLocale(l)'>{{ l.toUpperCase() }}
              </li>
            </ul>
          </div>
        </div>
        <div v-click-outside='toggleMenuNavigation' @click='toggleMenuNavigation(true)'>
          <div v-if='isLoggedIn'>
            <div v-if='isAdmin'>
              <v-btn dark tile small>
                {{ $t('admin') }}
                <v-icon>mdi-menu-down</v-icon>
              </v-btn>
            </div>
            <div v-else>
              <span v-if="isSmall && !isLoggedIn">
                <v-icon>mdi-menu</v-icon>
              </span>
              <span v-else-if="$auth.user.last_name">
                {{ $auth.user.last_name }}, {{ $auth.user.user_first_name }}
              </span>
              <v-icon v-else>mdi-account-circle</v-icon>
              <span v-if="$auth.user.credentials && view === 'professional'">
                {{$auth.user.credentials}}
              </span>
              <v-icon class="d-md-only">mdi-menu-down</v-icon>
            </div>
          </div>
          <div v-else>
            <v-icon>mdi-menu</v-icon>
          </div>
        </div>
      </div>
    </div>
    <div class='side-bars'>
      <transition name='side-slide' mode='out-in'>
        <div v-if='showChatNav' class='sidebar'>
          <sidebar-mobile-title>{{ $t('chats') }}</sidebar-mobile-title>
          <ChatItems :data='moderators' :selected-chat='to' @open-chat='openChat'></ChatItems>
        </div>
      </transition>
      <transition name='side-slide' mode='in-out'>
        <div v-if='showMenuNav' class='sidebar menu-sidebar'>
          <sidebar-mobile-title>{{ $t('menu') }}</sidebar-mobile-title>
          <ul class='sidebar-menu-items'>
            <li v-for='(item, i) in menuItems' :key='i'>
              <nuxt-link v-if="item.to!='redirect'" :to='localePath(item.to)' class='sidebar-item'>
                <span>
                 {{ item.text }}
                </span>
                <v-icon v-if="item.icon"  color="#333">mdi-{{item.icon}}</v-icon>
              </nuxt-link>

             
         
                      <a  v-if="item.to=='redirect'"  @click='onClickPayment()'>
                        <span style="margin-right:57%!important">Financial </span>
                      <img style="width:25px;height: 25px;" :src="require('~/static/pay.png')" alt="pay">
                      </a>
           
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
import userUpdatedMixin from '~/mixins/userUpdatedMixin'

export default {
  name: 'Navbar',
  components: {
    ChatItems,
    SidebarMobileTitle
  },
  mixins: [toggleDirectiveMixin, authMixin, userRoleMixin, breakpoints, chatMixin, listenMixin, utilsMixin, userUpdatedMixin],
  props: {
    hideMiddle: {
      type: Boolean,
      default: false,
    }
  },
  data: () => ({
    showChatNav: false,
    showMenuNav: false,
    to: '',
    pages: [],
    showLocales: false,
    interval: null,
  }),
  computed: {
    view(){
      return this.$cookies.get('view')
    },
    compView() {
      return this.$cookies.get('view')
    },
    myId() {
      return this.$auth.user.uuid
    },
    menuItems() {
      const items = []
      if (this.isLoggedIn) {
        if (!this.isAdminOrSuper){
          items.push({
            text: 'Home',
            icon: 'home-outline',
            to: '/view-mode'
          })
        }

        if (this.compView) {
          if (this.isAdmin || this.isSuper || this.isModerator) {
            items.push({
              text: this.$t('dashboard'),
              icon: 'view-dashboard-outline',
              to: '/dashboard'
            })
          }
          items.push({
            text: this.$t('my_profile'),
            icon: 'account-circle-outline',
            to: '/my-profile'
          })
    

     


          if (this.isAdmin || this.isSuper) {
            items.push({
              text: this.$t('usrs_list'),
              icon: 'account-group',
              to: '/users-list'
            })
          }
          if (this.isAdmin || this.isSuper) {
            items.push({
              text: this.$t('professionals_list'),
              icon: 'account-tie-outline',
              to: {
                path: '/users-list',
                query: {
                  view: 'professionals'
                }
              }
            })
          }
          if (this.isModerator) {
            items.push({
              text: 'Chats queue',
              icon: 'message-outline',
              to: '/chat-requests'
            })
            items.push({
              text: 'My EMR',
              icon: 'emoticon-sick-outline',
              to: '/my-patients'
            })
                   items.push({
            text: 'Financial',
            icon: 'static/pay.png',
            to: 'redirect',
            
          })
        
          }
          if (this.isUser) {
            items.push({
              text: 'My appointments',
              icon: 'contacts-outline',
              to: '/professionals'
            })
          }
          if (this.isLoggedIn) {
            
            items.push({
              text: this.$t('prev_c_pdf'),
              icon: 'file-outline',
              to: '/my-chats'
            })
            items.push({
              text: this.$t('chats'),
              icon: 'forum-outline',
              to: '/'
            })

            

            items.push({
              text: 'Messenger',
              icon: 'message-flash-outline',
              to: '/my-messanger'
            })
          }
        }
           
        if (this.isAdmin || this.isSuper || this.isModerator) {
          
            items.push({
              text: 'Appointments',
              icon: 'calendar-month',
              to: '/calendar-appointments'
            })
        }
        items.push({
          text: this.$t('sign_out'),
          icon: 'logout',
          to: '/sign-out'
        })
      } else {
        items.push({
            text: this.$t('sign_in'),
            icon: 'login',
            to: '/sign-in'
          },
          {
            text: this.$t('sign_up'),
            icon: 'clipboard-arrow-left',
            to: '/sign-up'
          })
        this.pages.forEach((page) => {
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
    },
    selectedLocale() {
      if (this.$i18n) {
        return this.$i18n.localeProperties.code
      } else {
        return ''
      }
    }
  },
  watch: {
    isLoggedIn(v) {
      if (v) {
        this.run_once(this.listen)

        this.$auth.refreshTokens()
        setInterval(()=>{
          this.$auth.refreshTokens()
        }, 1000 * 60 * 5)

        this.$api.get('/my-professional/ids').then(({data})=>{
          this.$cookies.set('appointments', data)
        })

      }else if (this.interval){
        clearInterval(this.interval)
        this.$cookies.set('view', null)
        this.$cookies.set('appointments', null)
      }
    },
    query() {
      this.setChatFromRoute()
    }
  },
  mounted() {
    this.getChats()
    this.setChatFromRoute()
    this.$api.get('/page').then(({ data }) => {
      this.pages = data
    })
  },
  methods: {
    pageURL(page) {
      return '/page/' + page.page_uuid + '/' + this.slugify(page.page_slug)
    },
    listen() {
      this.socket = this.$nuxtSocket({})
      this.socket.emit('join-room', this.myId)
      this.socket.on('professional-request', () => {
        this.$toast.success('A user has asked to become a professional')
        this.playNotification()
      })

      this.socket.on('chat-request', ()=>{
        this.$toast.success("A new user has been added to your chat's queue")
        this.playNotification()
      })

      this.socket.on('user-reload', () => {
        this.getChats(true)
      })
      console.log('Listening to fetch user', this.myId)
      this.socket.on('fetch-user', async () => {
        console.log('Fetching user')
        await this.$auth.fetchUser()
        this.user_was_updated()
        console.log('Was updated!')
      })
      this.socket.on('chat-allowed', (data) => {
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
    },

    onClickPayment(){
      // console.log(this.myId);
       const sessionId =localStorage.getItem('session_id');
       const url = `${process.env.PAYMENT_URL}?session_id=${sessionId}`;
       window.open(url)
    // console.log(url )
    }
  }
}
</script>

<style scoped lang='sass'>

.nv-top, .nv-top *
  font-family: 'Spartan', sans-serif !important

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
  display: flex
  align-items: center
  padding: 0 1rem
  z-index: 200
  border-bottom: 1px solid #87bfac

  img
    height: 35px !important

    &:hover
      cursor: pointer

  .chat-icon
    margin-right: auto

  .menu-icon
    display: flex
    justify-content: center
    align-items: center
    margin-left: auto
    position: relative

    &:hover
      cursor: pointer

    .lang-selector
      position: relative

      .current
        width: 100%
        height: 100%
        min-width: 40px
        background: #fff
        &:hover
          cursor: pointer

      .options
        position: absolute
        top: 38px
        right: 0
        left: 0
        margin: 0
        padding: 0
        border: 1px solid #eee

        li
          list-style: none
          padding: 0.5rem
          background: #ffffff

        .active
          background: #ccc

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
      color: #000 !important
      font-size: 0.7em !important
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


.pay-icon
  display: flex
  justify-content: center
  align-items: center
  img
    height: 40px !important
    margin-bottom: 6px


@media screen and (min-width: $md)
  .side-bars
    .sidebar.menu-sidebar
      width: 200px
      left: auto
      right: 0
      border: 1px solid #ccc
  .md-only
    display: block

@media screen and (min-width: $lg)
  .side-bars
    .sidebar.menu-sidebar
      width: 210px

</style>
