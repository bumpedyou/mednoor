<template>
  <div>
    <navbar></navbar>
    <div id='app-content'>
      <div :class='chatsLayoutClass'>
        <div v-if='savingPdf' class='chats-overlay'>
          <div class='flex-center'>
            <SpinOrText v-model='savingPdf'></SpinOrText>
          </div>
        </div>
        <div class='chats-list'>
          <div class='moderators'>
            <div class='chat-item-title'>
              <b class='h3'>
                Chats
              </b>
            </div>
            <a-skeleton v-if='loadingItems' class='pa-1'></a-skeleton>
            <div v-else>
              <div v-if='moderators && moderators.length > 0' :key="'force-update-' + updateIdx">
                <ChatItems :data='moderators' :selected-chat='to' @open-chat='openChat'></ChatItems>
              </div>
              <div v-else class='pa-1'>
                <div v-if='isUser'>
                  You do not have chats.
                  <nuxt-link to='/professionals'>Professionals Available</nuxt-link>
                </div>
                <div v-else-if='isModerator'>
                  You do not have any users right now.
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-if='to' ref='chatView' class='chat-view'>
          <div ref='chatBox' class='chat-box-wrapper'>
            <div ref='pdfArea'> <!--:class='pdfAreaClass'-->
              <div ref='chatContent' class='chat-content'>
                <div class='chat-content-top-bar'>
                  <div style='margin-right: auto' class='ml-1'>
                    {{ userName }}
                  </div>
                  <div class='mr-1'>
                    Professional: {{ professionalName }}
                  </div>
                  <img :src="require('~/static/icon/video.svg')" alt='video icon' @click='showVideo'>
                  <img :src="require('~/static/icon/close.svg')" alt='close icon' @click='leaveChat'>
                </div>
                <div id='messages' ref='messages' :key='messages.length' class='message-container-100'>
                  <div v-if='!allowed && to && !isAdmin' class='messages-overlay'>
                    <div v-if='isModerator'>
                      <p class='h3 text-center'>
                        This user is not allowed to send you messages.
                      </p>
                      <div class='flex-center'>
                        <a-button type='primary' @click='allowChat'>Allow</a-button>
                      </div>
                    </div>
                    <div v-else-if='isUser'>
                      <p class='h3 text-center'>
                        You have to wait until the professional accepts to chat with you.
                      </p>
                    </div>
                  </div>
                  <div v-for='(msg, i) in messages' :key="'msg-' + i" :ref="'msg-' + i" :class='messageClass(msg)'>
                    
                    <span v-if='msg'>
                      {{ msg.message }}
                    </span>
                    <span v-if='msg.mess_message'>
                      {{ msg.mess_message }}
                    </span>
                    <div v-if='msg && msg.file_name'>
                      <span v-if='isImg(msg.file_name)'>
                        <img :src='filePath(msg.file_name)' alt='chat-img' class='img-fluid'>
                      </span>
                      <span v-else>
                      <a target='_blank' :href='filePath(msg.file_name)' :download='filePath(msg.file_name)'>
                        {{ msg.file_title }}
                      </a>
                    </span>
                    </div>
                    <span v-if='msg.mimetype && msg.mimetype.includes("image")'>
                      <img :src='msg.path' :alt='msg.originalName' class='img-fluid'>
                    </span>
                    <span v-else>
                      <a target='_blank' :href='msg.path' :download='msg.path'>{{ msg.name }}</a>
                    </span>
                    <div class="chat-time">
                      {{hour(msg.mess_date)}}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div v-if="toIsTyping" class="typing-indicator">
              <div class="typing-wrapper">
                <div>
                Typing
                </div>
                <div class="snippet" data-title=".dot-typing">
                  <div class="stage">
                    <div class="dot-typing"></div>
                  </div>
                </div>
              </div>
            </div>
            <div v-if='fileName' class='upload-container'>
              <small class='mr-1 text-muted'>{{ fileName }}</small>
              <a-progress :percent='umUploadProgress'></a-progress>
              <a-button type='danger' @click='cancelUpload'>
                <a-icon type='close' />
                Cancel
              </a-button>
              <a-button type='primary' @click='uploadFile'>
                <a-icon type='upload' />
                Upload
              </a-button>
            </div>
            <div class='chat-controls'>
              <div>
                <img :src="require('~/static/icon/happy-face.svg')" alt='happy face'>
              </div>
              <a-input v-model='message' placeholder='Type a message' @keyup="imTyping" @keyup.enter='sendMessage(null)'></a-input>
              <div class='chat-multiple-controls'>
                <img v-if='!isUser' :src="require('~/static/icon/save.svg')" alt='save icon' @click='askSavePDF'>
                <input id='file' ref='fileInput' type='file' style='opacity: 0; display: none' @change='fileChange' />
                <label for='file'>
                  <img :src="require('~/static/icon/attachment.svg')" alt='attachment icon'>
                </label>
                <img :src="require('~/static/icon/send.svg')" alt='send icon' @click='sendMessage(null)'>
              </div>
            </div>
          </div>
        </div>
        <div v-else-if='isSmall'>
          <div v-if="moderators.length <= 0">
            <p class="text-center pa-1">
              You do not have any chats right now. 
            </p>
          </div>
          <ChatItems :data='moderators' :selected-chat='to' @open-chat='openChat'></ChatItems>
        </div>
      </div>
    </div>
    <RequestModal ref='rmodal'></RequestModal>
    <div>
      <a-modal
        title='Allow user'
        :visible='visible'
        :confirm-loading='confirmLoading'
        @ok='handleOk'
        @cancel='handleCancel'
      >
        <p>Do you want to allow this user to chat with you?</p>
      </a-modal>
      <a-modal
        title='Save chat'
        :visible='visiblePDF'
        :confirm-loading='confirmLoading'
        @ok='saveChatAsPdf'
        @cancel='handleCancel'
      >
        <p>
          If you save this chat as PDF, the chat will be erased and the pdf version of the chat will be available on the
          "My Previous Chats" section.
        </p>
      </a-modal>
      <a ref='downloadUrl' :href='downloadUrl' :download='downloadUrl' target='_blank' class='d-none'></a>
    </div>
  </div>
</template>

<script>

import domtoimage from 'dom-to-image'
import Navbar from '~/components/Navbar'
import RequestModal from '~/components/RequestModal'
import listenMixin from '~/mixins/listenMixin'
import userRoleMixin from '~/mixins/userRoleMixin'
import userUpdatedMixin from '~/mixins/userUpdatedMixin'
import uploadMixin from '~/mixins/uploadMixin'
import ChatItems from '~/components/ChatItems'
import chatMixin from '~/mixins/chatMixin'
import SpinOrText from '~/components/SpinOrText'
import authMixin from '~/mixins/authMixin'
import breakpoints from '~/mixins/breakpoints'
const debounce = require('lodash.debounce');
const moment = require('moment')

export default {
  name: 'Chat',
  components: {
    ChatItems,
    Navbar,
    RequestModal,
    SpinOrText
  },
  mixins: [listenMixin, userRoleMixin, userUpdatedMixin, uploadMixin, chatMixin, authMixin, breakpoints],
  middleware: ['authenticated', 'not-blocked', 'not-deleted'],
  data: () => ({
    visible: false,
    confirmLoading: false,
    savingPdf: false,
    message: '',
    to: '',
    messages: [],
    file: null,
    fileName: '',
    allowed: false,
    messagesScrollHeight: 0,
    updateIdx: 0,
    socket: null,
    visiblePDF: false,
    pdfName: '',
    sentTypingEvt: false,
    typing: null, // other user who is typing
  }),
    head() {
    return {
      title: 'Mednoor',
      meta: [
        // hid is used as unique identifier. Do not use `vmid` for it as it will not work
        {
          hid: 'description',
          name: 'description',
          content: 'Chat with professionals in the online medical center.'
        }
      ]
    }
  },
  computed: {
    toIsTyping(){
      return this.to === this.typing
    },
    downloadUrl(){
      return process.env.API_URL + '/generated/' + this.pdfName
    },
    user() {
      return this.$auth.user
    },
    myName() {
      return this.user.user_first_name + ' ' + this.user.last_name
    },
    professionalName() {
      if (this.isModerator) {
        return this.myName
      } else {
        return this.selectedUser
      }
    },
    userName() {
      if (this.isModerator) {
        return this.selectedUser
      } else {
        return this.myName
      }
    },
    myID() {
      return this.user.uuid
    },
    selectedUser() {
      let u = ''
      if (this.to) {
        this.moderators.forEach((m) => {
          if (m.user_uuid === this.to) {
            this.allowed = m.mypr_allowed
            u = m.user_first_name + ' ' + m.user_last_name
          }
        })
      }
      return u
    },
    chatsLayoutClass() {
      const c = ['chats-layout']
      if (this.savingPdf) {
        c.push('saving-pdf')
      }
      return c.join(' ')
    },
    chatViewClass() {
      const c = ['chat-view']
      if (this.savingPdf) {
        c.push('saving-pdf')
      }
      return c.join(' ')
    },
    pdfAreaClass() {
      const c = []
      if (this.savingPdf) {
        // position fixed does not look good when we try to save the pdf. So .saving-pdf will override styles while saving.
        c.push('saving-pdf')
      }
      return c.join(' ')
    },
    query() {
      return this.$route.query
    }
  },
  watch: {
    message: debounce (function (){
      this.socket.emit('stopped-typing', {to: this.to})
    },1000),
    query() {
      this.setChatFromRoute()
    }
  },
  mounted() {
    this.setChatFromRoute()
    this.getChats()
    this.run_once(this.listen)
  },
  methods: {
    hour(date){
      return moment(date).format('LTS');
    },
    imTyping(evt){
      if (this.sentTypingEvt || evt.key ===  'Enter')
        return
      this.socket.emit('typing-to', {to: this.to, from: this.myID})
      this.sentTypingEvt = true
      setTimeout(()=>{
        this.sentTypingEvt = false
      },1600)
    },
    askSavePDF() {
      this.visiblePDF = true
    },
    leaveChat() {
      this.to = null
      this.chats = []
    },
    handleOk() {
      this.confirmLoading = true
      this.moderators.forEach((moderator) => {
        if (moderator.user_uuid === this.to) {
          this.$api.post('/my-professional/allow/' + moderator.mypr_id).then(() => {
            this.socket.emit('ask-me-to-reload-users')
          }).catch((err) => {
            this.$refs.rmodal.$emit('error', err)
          }).finally(() => {
            this.visible = false
            this.confirmLoading = false
          })
        }
      })
    },
    handleCancel() {
      this.confirmLoading = false
      this.visible = false
      this.visiblePDF = false
    },
    allowChat() {
      this.visible = true
    },
    setChatFromRoute() {
      const c = this.$route.query
      if (c && c.chat && c.chat !== this.to) {
        this.openChat(c.chat)
      }
    },
    filePath(s) {
      return process.env.API_URL + '/file/' + s
    },
    isImg(fileName) {
      return (fileName.match(/\.(jpeg|jpg|gif|png)$/) != null)
    },
    scrollMessagesSection() {
      this.$nextTick(() => {
        const c = this.$refs.messages
        if (c) {
          c.scrollTop = c.scrollHeight
        }
      })
    },
    uploadFile() {
      const file = this.$refs.fileInput.files
      if (file && file.length && file.length > 0) {
        const data = new FormData()
        data.append('file', file[0])

        this.$api.post('/file', data, {
          onUploadProgress: (evt) => {
            this.onProgress(evt)
          }
        }).then(({ data }) => {

          this.fileName = 0
          this.umUploadProgress = 0
          const opts = {
            mimetype: data.mimetype,
            type: 'file',
            name: data.originalName,
            finalName: data.fName,
            path: process.env.API_URL + '/file/' + data.fName,
            owner: true,
            uuid: data.uuid
          }
          this.messages.push(opts)
          this.sendMessage(opts)
        }).catch((err) => {
          this.umUploadProgress = 0
          this.$refs.rmodal.$emit('error', err)
        }).finally(() => {
        })
      }
    },
    cancelUpload() {
      this.fileName = ''
      this.$refs.fileInput.value = ''
    },
    fileChange(f) {
      const file = f.target.value
      if (file) {
        this.fileName = file.split('\\').pop().split('/').pop()
      }
    },
    showVideo() {
      const h = this.$createElement
      this.$info({
        title: 'Info',
        content: h('div', {}, [
          h('p', 'Video app is inactive at this time')
        ]),
        onOk() {
        }
      })
    },
    saveChatAsPdf() {
      this.confirmLoading = true
      this.savingPdf = true
      /** WITH CSS */
      domtoimage
        .toPng(this.$refs.chatView)
        .then((dataUrl) => {
          if (dataUrl !== 'data:,') {
            this.$api.post('/my-professional/save-chat/', {
              data: dataUrl,
              to: this.to,
              me: this.myID
            }).then(({data})=>{
              if (data.file_name){
                this.pdfName = data.file_name
                this.$nextTick(()=>{
                  this.$refs.downloadUrl.click()
                })
              }else{
                this.$refs.rmodal.$emit('error', 'PDF File not found')
              }
            }).catch((err) => {
              this.$refs.rmodal.$emit('error', err)
            })
          } else {
            this.$refs.rmodal.$emit('error', 'The PDF was empty')
          }
        }).finally(() => {
          this.visiblePDF = false
          this.confirmLoading = false
          setTimeout(() => {
            this.savingPdf = false
          }, 1500)
        })
    },
    messageClass(msg) {
      const c = ['chat-message']
      const isOwner = msg.isOwner || msg.owner || msg.mess_sender === this.myID
      if (this.isModerator || this.isAdmin || this.isSuper){
        if (isOwner) {
          c.push('owner')
        }
      }else if (!isOwner){
          c.push('owner')
        }
      return c.join(' ')
    },
    sendMessage(opts) {
      if (!this.to) {
        const h = this.$createElement
        this.$info({
          title: 'Chat not selected',
          content: h('div', {}, [
            h('p', 'Please select a chat first.')
          ]),
          onOk() {
          }
        })
      } else if (this.allowed || this.isAdmin) {
        if (opts) {
          this.socket.emit('send-message', {
            from: this.myID,
            to: this.to,
            opts
          })
        } else if (this.message && this.message.length > 0) {
          const date = new Date()
          this.socket.emit('send-message', {
            from: this.myID,
            to: this.to,
            message: this.message,
            mess_date: date,
          })
          this.messages.push({
            from: this.myID,
            owner: true,
            message: this.message,
            mess_date: date,
          })
          this.message = ''
        }
      } else {
        const h = this.$createElement
        this.$info({
          title: 'Not allowed',
          content: h('div', {}, [
            h('p', 'You have to wait you be allowed to send messages to this professional.')
          ]),
          onOk() {
          }
        })
      }
      this.scrollMessagesSection()
    },
    openChat(uuid) {
      if (!this.to || this.to !== uuid) {
        this.messages = []
        this.$api.get('/conversation/id/' + this.myID + '/' + uuid).then(({ data }) => {
          if (data.conversationId) {
            this.$api.get('/conversation/messages/' + data.conversationId).then(({ data }) => {
              this.messages = data
              this.$nextTick(() => {
                this.scrollMessagesSection()
                setTimeout(() => {
                  this.scrollMessagesSection()
                }, 500)
              })
            })
          }
        })
      }
      this.to = uuid
      this.moderators = this.moderators.map((moderator) => {
        if (moderator.user_uuid === this.to || moderator.mypr_uuid === this.to || moderator.mypr_proffesional === this.to) {
          moderator.messages = null
        }
        return moderator
      })
    },
    listen() {
      this.socket = this.$nuxtSocket({ persist: 'chatSocket' })
      this.socket.emit('join-room', this.myID)
      this.socket.on('chat-request', () => {
        this.openNotification({
          title: 'New chat request',
          description: 'You have a new chat request'
        })
      })

      this.socket.on('user-reload', () => {
        if (this.isUser) {
          this.getChats(true)
        } else {
          this.getChats(false)
        }
        this.openNotification()
      })
      this.socket.on('open-chat', (data) => {
        /*
        if (!this.to) {
          // Open chat only when other chat is not selected
          this.to = data.from
        } */

      })
      this.socket.on('new-message', (data) => {
        this.playNotification()
        // this.mergeWithConversations(true)
        if (data.from !== this.to) {
          this.moderators = this.moderators.map((eme) => {
            if ((eme.mypr_proffesional !== undefined || eme.mypr_uuid !== undefined || eme.user_uuid !== undefined) && data.from !== undefined) {
              if ((eme.mypr_proffesional === data.from || eme.mypr_uuid === data.from || eme.user_uuid === data.from)) {
                if (eme.messages) {
                  eme.messages = eme.messages + 1
                } else {
                  eme.messages = 1
                }
                this.updateIdx++
              }
            }
            return eme
          })
        }

        if (this.to && data.from === this.to) {
          this.typing = null
          if (data.opts) {
            data.opts.owner = false
            this.messages.push(data.opts)
          } else {
            this.messages.push({
              owner: false,
              message: data.message,
              mess_date: data.mess_date,
            })
          }
          this.scrollMessagesSection()
        }
      })
      this.socket.on('fetch-user', async () => {
        await this.$auth.fetchUser()
        this.user_was_updated()
      })
      this.socket.on('chat-deleted', (data) => {
        this.$router.push('/chat-ended')
      })
      this.socket.on('typing', (data)=>{
        if (!this.typing){
          this.typing = data.from
          setTimeout(()=>{
            this.typing = null
          }, 1600)
        }
      })
    }
  }
}
</script>

<style lang='sass'>

#app-content
  margin-top: 50px

.chats-list
  display: none

.chat-content-top-bar
  background-color: #fff

.chats-overlay
  position: fixed
  left: 0
  right: 0
  bottom: 0
  top: 0
  background: rgba(0, 0, 0, 0.9)
  z-index: 202
  width: 100%
  height: 100%
  display: flex
  justify-content: center
  align-items: center

.chat-view
  width: 100%
  position: fixed
  top: 50px
  overflow-y: auto
  bottom: 50px
  font-size: 12px

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

    .chat-message
      background-color: #DBF3FA
      color: #211235

      a
        color: #333
        text-decoration: underline

    .chat-message.owner
      margin-left: auto

    .chat-message:last-of-type
      margin-bottom: 2.6rem

  .upload-container
    z-index: 202
    background: #fff
    height: 50px
    padding: 0 0.5rem
    bottom: 50px
    position: fixed
    left: 0
    right: 0
    display: flex
    justify-content: center

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
  border-right: 1px solid $mdn-super-light-grey

.message-container-100
  position: fixed
  left: 0
  right: 0
  bottom: 60px
  top: 100px
  overflow-y: scroll
  z-index: 201
  box-sizing: border-box
  overflow-x: hidden

  .messages-overlay
    position: absolute
    background-color: #eeeeee
    top: 0
    left: 0
    right: 0
    bottom: 0
    display: flex
    justify-content: center
    align-items: center

.chat-time
  color: $mdn-super-light-grey
.typing-indicator
  right: 0
  width: 100% !important
  background: #fff
  position: fixed
  bottom: 50px
  left: 0
  z-index: 202
  color: $mdn-super-light-grey
  padding: 1rem
  .typing-wrapper
    display: flex
    justify-content: center
    align-item: center
    width: 100px
    > div:first-of-type
      margin-right: 16px
    > div
      display: flex
      justify-content: center
      align-items: center
      flex: 1


.dot-typing
  position: relative
  left: -9999px
  width: 5px
  height: 5px
  border-radius: 5px
  background-color: $mdn-super-light-grey
  color: $mdn-super-light-grey
  box-shadow: 9984px 0 0 0 $mdn-super-light-grey, 9999px 0 0 0 $mdn-super-light-grey, 10014px 0 0 0 $mdn-super-light-grey
  animation: dotTyping 1s infinite linear

  @keyframes dotTyping
    0%
      box-shadow: 9984px 0 0 0 $mdn-super-light-grey, 9999px 0 0 0 $mdn-super-light-grey, 10014px 0 0 0 $mdn-super-light-grey
    16.667%
      box-shadow: 9984px -10px 0 0 $mdn-super-light-grey, 9999px 0 0 0 $mdn-super-light-grey, 10014px 0 0 0 $mdn-super-light-grey
    33.333%
      box-shadow: 9984px 0 0 0 $mdn-super-light-grey, 9999px 0 0 0 $mdn-super-light-grey, 10014px 0 0 0 $mdn-super-light-grey
    50%
      box-shadow: 9984px 0 0 0 $mdn-super-light-grey, 9999px -10px 0 0 $mdn-super-light-grey, 10014px 0 0 0 $mdn-super-light-grey
    66.667%
      box-shadow: 9984px 0 0 0 $mdn-super-light-grey, 9999px 0 0 0 $mdn-super-light-grey, 10014px 0 0 0 $mdn-super-light-grey
    83.333%
      box-shadow: 9984px 0 0 0 $mdn-super-light-grey, 9999px 0 0 0 $mdn-super-light-grey, 10014px -10px 0 0 $mdn-super-light-grey
    100%
      box-shadow: 9984px 0 0 0 $mdn-super-light-grey, 9999px 0 0 0 $mdn-super-light-grey, 10014px 0 0 0 $mdn-super-light-grey


@media (min-width: $md)
  .typing-indicator
    left: 30%
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
        // height: 50vh
        overflow-y: auto
        left: 0
        width: 30%

      .chats
        position: fixed
        top: calc(50px + 50vh)
        // height: 50vh
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

    .upload-container
      left: 30%

    .chat-controls
      padding: 1rem
      height: 60px
      left: 30%

      img
        margin-right: 0.6rem
        margin-left: 0.6rem
  .message-container-100
    position: fixed
    left: 30%
    right: 0
    bottom: 60px
    top: 100px
    overflow-y: scroll
    z-index: 201


.saving-pdf
  .chat-content
    position: relative !important
    margin-top: 0 !important
    display: block !important

  .chat-content-top-bar
    width: 100%
    position: relative !important
    top: initial !important
    left: initial !important
    right: initial !important
    bottom: initial !important

  .message-container-100
    position: relative !important
    top: initial !important
    left: initial !important
    bottom: initial !important
    right: initial !important

  .chat-controls
    display: none !important

  .chat-view
    position: relative !important
    left: initial !important
    right: initial !important
    bottom: initial !important
    top: initial !important
    width: 100% !important
    background-color: #fff !important

  .chats-list
    display: none !important



</style>
