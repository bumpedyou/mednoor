<template>
  <div>
    <navbar></navbar>
    <div id='app-content' >
      <div class="chats-layout">
        <div class="chats-list">
          <div v-if='isUser' class="moderators">
            <div class="chat-item-title">
              <b class="h3">Moderators</b>
            </div>
            <a-skeleton v-if='loadingModerators' class="pa-1"></a-skeleton>
            <chat-item v-for="(m,i) in moderators" v-else :key='i' :active='to === m.user_uuid' @click='openChat(m.user_uuid)'>{{m.user_first_name}} {{m.user_last_name}}</chat-item>
          </div>
          <div class="chats">
            <div class="w-100">
              <div class="chat-item-title"><b class='h3'>Your chats</b></div>
            </div>
          </div>
        </div>
        <div class="chat-view">
          <div class="chat-box-wrapper">
            <div class="chat-content">
              <div class="chat-content-top-bar">
                <img :src="require('~/static/icon/video.svg')" alt='video icon'>
              </div>
              <div class="w-100">
                <div v-for='(msg, i) in messages' :key="'msg-' + i" :class="messageClass(msg.owner)">
                  {{msg.message}}
                </div>
              </div>
            </div>
            <div class="chat-controls">
              <div>
                <img :src="require('~/static/icon/happy-face.svg')" alt='happy face'>
              </div>
              <a-input v-model='message' placeholder='Type a message' @keyup.enter='sendMessage'></a-input>
              <div class="chat-multiple-controls">
                <img :src="require('~/static/icon/attachment.svg')" alt='attachment icon'>
                <img :src="require('~/static/icon/send.svg')" alt='send icon' @click='sendMessage'>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <RequestModal ref='rmodal'></RequestModal>
  </div>
</template>

<script>
import Navbar from '~/components/Navbar'
import RequestModal from '~/components/RequestModal'
import listenMixin from '~/mixins/listenMixin'
import userRoleMixin from '~/mixins/userRoleMixin'
import userUpdatedMixin from '~/mixins/userUpdatedMixin'

export default {
  name: 'Chat',
  components: {
    Navbar,
    RequestModal,
  },
  mixins: [listenMixin, userRoleMixin, userUpdatedMixin],
  middleware: ['authenticated', 'not-blocked', 'not-deleted'],
  data:()=>({
    loadingModerators: true,
    message: '',
    moderators: [],
    to: '',
    messages: [],
  }),
  mounted(){
    console.log(this.$auth.user)
    this.$api.get('/user/moderators').then(({data})=>{
      this.moderators = data
    }).catch((e)=>{
      this.$refs.rmodal.$emit('error', e)

    }).finally(() =>{
      this.loadingModerators = false
    })
    this.run_once(this.listen)
  },
  methods: {
    messageClass(isOwner){
      const c = ['chat-message']
      if (isOwner){
        c.push('owner')
      }
      return c.join(' ')
    },
    sendMessage (){
      this.socket.emit('send-message', {
        to: this.to,
        message: this.message,
      })
      this.messages.push({
        owner: true,
        message: this.message,
      })
      this.message = ''
    },
    openChat(uuid){
      this.messages = []
      this.to = uuid
      this.socket.emit('open-chat', {
        to: uuid,
        from: this.$auth.user.uuid
      })
    },
    listen(){
      this.socket = this.$nuxtSocket({ persist: 'chatSocket' })
      this.socket.emit('join-room', this.$auth.user.uuid)
      this.socket.on('open-chat', (data) =>{
        this.to = data.from
      })
      this.socket.on('new-message', (data) =>{
        this.messages.push({
          owner: false,
          message: data.message,
        })
      })
      this.socket.on('fetch-user', async ()=>{
        await this.$auth.fetchUser()
        console.log('user is now', this.$auth.user)
        this.user_was_updated()
      })
    }
  }
}
</script>

<style lang='sass'>
body
  overflow-y: hidden
#app-content
  margin-top: 50px

.chats-list
  display: none
.chat-view
  width: 100%
  position: fixed
  top: 50px
  overflow-y: auto
  bottom: 50px

.chat-box-wrapper
  width: 100%
  .chat-content
    display: flex
    position: relative
    margin-top: 50px
    .chat-content-top-bar
      position: fixed
      top: 50px
      right: 0
      left: 0
      display: flex
      justify-content: flex-end
      align-items: center
      height: 50px
      box-shadow: 0 3px 6px $mdn-super-light-grey
      img
        height: 20px
        margin-right: 1rem
        &:hover
          cursor: pointer
      background: #fff
    .chat-message
      margin-left: 0
      margin-right: 3px
      margin-top: 3px
      width: 200px
      height: auto
      border: 1px solid $mdn-super-light-grey
      border-radius: 9px
      padding: 0.3rem
      background-color: #fff
      color: #000000
    .chat-message.owner
      margin-left: auto
      background-color: $mdn-primary
      color: #fff

  .chat-controls
    background: #fff
    border-top: 1px solid $mdn-super-light-grey
    box-shadow: inset 0 1px 3px $mdn-super-light-grey
    padding: 0.5rem
    height: 50px
    display: flex
    align-items: center
    position: fixed
    left: 0
    bottom: 0
    right: 0
    .chat-multiple-controls
      display: flex
      justify-content: center
      align-items: center
    img
      margin-right: 0.3rem
      margin-left: 0.3rem
      &:hover
        cursor: pointer

.chat-item-title
  width: 100%
  background: #fff
  padding: 1rem
  display: flex
  align-items: center

@media (min-width: $md)
  .chats-layout
    width: 100%
    .chats-list
      position: fixed
      width: 30%
      display: flex
      left: 0
      top: 50px
      overflow-y: auto
      height: 100%
      bottom: 0
      border: 1px solid $mdn-super-light-grey
      .moderators
        position: fixed
        top: 50px
        height: 50vh
        overflow-y: auto
        left: 0
        width: 30%
      .chats
        position: fixed
        top: calc(50px + 50vh)
        height: 50vh
        left: 0
        right: 0
        width: 30%
        overflow-y: auto

    .chat-view
      width: 70%
      display: flex
      position: fixed
      left: 30%
      height: 100%
      overflow-y: auto

  .chat-box-wrapper
    .chat-content
      .chat-content-top-bar
        left: 30%
      .chat-message
        width: 350px
    .chat-controls
      padding: 1rem
      height: 60px
      left: 30%
      img
        margin-right: 0.6rem
        margin-left: 0.6rem
</style>
