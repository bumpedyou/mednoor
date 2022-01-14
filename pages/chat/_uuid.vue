<template>
  <div :class='chatsLayoutClass'>
    <div v-if='savingPdf' class='chats-overlay'>
      <div class='flex-center'>
        <v-progress-circular v-if="savingPdf" indeterminate></v-progress-circular>
      </div>
    </div>
    <div :class='leftClasses'>
      <div v-if="show_video" class="video-control" @click="stopVideo">
        <v-icon>mdi-close</v-icon>
      </div>
      <video-call ref="videoRef" :close="stopVideo"></video-call>
    </div>
    <div ref='chatView' class='chat-view'>
      <div ref='chatBox' class='chat-box-wrapper'>
        <div ref='pdfArea'> <!--:class='pdfAreaClass'-->
          <div ref='chatContent' class='chat-content'>
            <div class='chat-content-top-bar'>
              <div style='margin-right: auto' class='ml-1'>
                <div class="flex-center">
                  <profile-picture v-if="isModerator" :user="selectedUserObj" :x-small="true"></profile-picture>
                  <profile-picture v-else :user="$auth.user" :x-small="true"></profile-picture>
                  <span class="ml-3">
                    {{userName}}
                  </span>
                </div>
              </div>
              <div class='mx-auto'>
                <small class="d-block text-center date-center mr-3">
                  {{dateString(new Date())}}
                  <br>
                  {{hour(timestamp)}}
                </small>
              </div>
              <div class='mr-1'>
                {{ professionalName }}
              </div>
              <v-icon v-if="view === 'professional'" class="mx-1" @click='showVideo'>mdi-video</v-icon>
              <v-icon class="mx-1" @click='leaveChat'>mdi-chevron-left</v-icon>
            </div>
            <div id='messages' ref='messages' :key='messages.length' class='message-container-100'>
              <chat-messages :messages='messages'></chat-messages>
            </div>
          </div>
        </div>
        <typing-indicator :value='toIsTyping'></typing-indicator>
        <div v-if='fileName' class='upload-container'>
          <small class='mr-1 text-muted'>{{ fileName }}</small>
          <v-progress-linear :value='umUploadProgress'></v-progress-linear>
          <v-btn color='error' small tile @click='cancelUpload'>
            <v-icon>mdi-close</v-icon>
            Cancel
          </v-btn>
          <v-btn small tile type='primary' @click='uploadFile'>
            <v-icon>mdi-upload</v-icon>
            {{$t('upload')}}
          </v-btn>
        </div>
        <VEmojiPicker v-if='showEmojiPicker' class="emoji-picker" @select="selectEmoji" />
        <div class='chat-controls'>
          <div class="mr-1">
            <v-icon @click='showEmojiPicker = !showEmojiPicker'>mdi-emoticon-outline</v-icon>
          </div>
          <v-text-field v-model='message' placeholder='Type a message' @keyup="imTyping" @keyup.enter='sendMessage(null)'></v-text-field>
          <div class='chat-multiple-controls'>
            <v-icon v-if='!isUser' class="mx-1" @click='askSavePDF'>mdi-content-save</v-icon>
            <input id='file' ref='fileInput' type='file' style='opacity: 0; display: none' @change='fileChange' />
            <label for='file' class="clickable">
              <v-icon class="mx-1">mdi-attachment</v-icon>
            </label>
            <v-icon class="mx-1 clickable" @click='sendMessage(null)'>mdi-send</v-icon>
          </div>
        </div>
      </div>
    </div>
    <v-dialog
      v-model="ringing"
      persistent
      max-width="290"
    >
      <v-card>
        <v-card-title class="text-h5">
          {{callerName}} is calling you...
        </v-card-title>
        <v-card-text>
          <v-btn
            class="mx-2"
            fab
            dark
            small
            color="success"
            @click="acceptCall"
          >
            <v-icon dark>
              mdi-phone
            </v-icon>
          </v-btn>
        </v-card-text>
      </v-card>
    </v-dialog>
    <RequestModal ref='rmodal'></RequestModal>
    <div>
      <ConfirmDialog v-model="visible" title="Allow user" :loading="confirmLoading" @accept="handleOk" @cancel="handleCancel"></ConfirmDialog>
      <ConfirmDialog v-model="visiblePDF" title="Save Chat" :description="$t('ifys').toString()" :loading="confirmLoading" @accept="saveChatAsPdf" @cancel="handleCancel"></ConfirmDialog>
    </div>
    <a ref='downloadUrlRef' :href='downloadUrl' :download='downloadUrl' target='_blank' class='d-none'></a>
  </div>

</template>

<script>
import domtoimage from "dom-to-image";
import { VEmojiPicker } from 'v-emoji-picker';
import ChatMessages from "~/components/ChatMessages";
import TypingIndicator from "~/components/TypingIndicator";
import listenMixin from "~/mixins/listenMixin";
import userRoleMixin from "~/mixins/userRoleMixin";
import userUpdatedMixin from "~/mixins/userUpdatedMixin";
import uploadMixin from "~/mixins/uploadMixin";
import chatMixin from "~/mixins/chatMixin";
import authMixin from "~/mixins/authMixin";
import breakpoints from "~/mixins/breakpoints";
import RequestModal from "~/components/RequestModal";
import VideoCall from "~/components/VideoCall";
import ProfilePicture from "~/components/ProfilePicture";
import dateMixin from "~/mixins/dateMixin";
import ConfirmDialog from "~/components/ConfirmDialog";

export default {
  name: "Uuid",
  components: {ConfirmDialog, ChatMessages, TypingIndicator, RequestModal, VideoCall, ProfilePicture, VEmojiPicker},
  mixins: [listenMixin, userRoleMixin, userUpdatedMixin, uploadMixin, chatMixin, authMixin, breakpoints, chatMixin, dateMixin],
  layout: 'new-chat',
  middleware: ['authenticated', 'verified', 'pin-set', 'view-set'],
  data(){
    return {
      showEmojiPicker: false,
      visible: false,
      confirmLoading: false,
      savingPdf: false,
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
      show_video: false,
      videoRoomId: null,
      timestamp: "",
      ringing: false,
      calling: false,
      callerName: '',
      callingRoomId: null,
      audio: null
    }
  },
  computed: {
    leftClasses(){
      const c = ['chats-list']
      if (this.show_video){
        c.push('show-video')
      }
      return c.join(' ')
    },
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
      return this.user.last_name + ', ' + this.user.user_first_name + ' ' + (this.user.credentials ? this.user.credentials : '')
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
    selectedUserObj(){
      let u = {}
      if (this.to) {
        this.moderators.forEach((m) => {
          if (m.user_uuid === this.to) {
            u = m
          }
        })
      }
      return u
    },

    selectedUser() {
      let u = ''
      if (this.to) {

        this.moderators.forEach((m) => {
          console.log('Evaluating allowed --->', m)
          if (m.user_uuid === this.to) {
            this.allowed = m.mypr_allowed
            if (!this.allowed){
              this.$router.push(this.localePath('/'))
            }
            u = m.user_last_name + ', ' + m.user_first_name + ' ' +  (m.profe_credentials ?  m.profe_credentials : '')
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
        c.push('saving-pdf')
      }
      return c.join(' ')
    },
    query() {
      return this.$route.query
    }
  },
  mounted() {
    this.getChats()
    this.run_once(this.listen)
    this.setChatFromRoute()
    this.socket.on('start-video', ({ from, roomId, name }) => {

      this.callerName = name
      this.ringing = true

      this.ring().then(()=>{
      }).catch(()=>{
      })
      /*
      if (from === this.to && roomId) {
        this.joinVideo(roomId)
      } */

      this.callingRoomId = roomId
    })
    this.socket.on('stop-video', ({ from, roomId }) => {
      if (from === this.to && roomId) {
        this.stopVideoByPro(roomId)
      }
    })
    this.socket.on('call-accepted', ({roomId})=>{
      this.stopAudio()
      this.$refs.videoRef.start(roomId)
      this.videoRoomId = roomId
    })

    this.socket.on('stop-ringing', ({roomId})=>{
      this.stopAudio()
      this.ringing = false
    })

  },
  created() {
    setInterval(this.getNow, 1000);
  },
  methods: {
    stopAudio() {
      if (this.audio){
        this.audio.currentTime = 0
        this.audio.pause()
      }
    },
    acceptCall(){
      this.joinVideo(this.callingRoomId)
      this.stopAudio()
      this.ringing = false
      this.socket.emit('call-accepted', {
        roomId: this.callingRoomId,
        to: this.to,
        from: this.myUserId
      })
    },
    ring(){
      this.audio = this.getSound('phone-ringing.mp3')
      return this.audio.play()
    },
    getNow() {
      const today = new Date();
      const date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
      const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
      const dateTime = date +' '+ time;
      this.timestamp = dateTime;
    },
    setChatFromRoute() {
      // const c = this.$route.query
      const p = this.$route.params
      if (p && p.uuid) {
        this.openChat(p.uuid)
      }
    },
    selectEmoji(e){
      this.message += e.data
      this.showEmojiPicker = false
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
      this.$router.push(this.localePath('/'))
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
      if (this.show_video) return
      this.show_video = true
      const roomId = 'videoRoom_' + Math.round(Math.random() * 1000);
      this.startVideo(roomId)
    },
    // Start the call
    startVideo(roomId) {
      if (this.view === 'professional') {
        this.socket.emit('start-video', {
          from: this.myID,
          to: this.to,
          name: this.myName,
          roomId
        })
        this.audio = this.getSound('ringing-internal.mp3')
        this.audio.play()
        this.callingRoomId = roomId
      }
    },
    joinVideo(roomId) {
      console.log('join video')
      this.show_video = true
      this.videoRoomId = roomId
      console.log('join room', roomId)
      if (this.$refs.videoRef)
        this.$refs.videoRef.join(roomId)
    },
    stopVideo() {
      this.show_video = false
      if (this.view === 'professional') {
        console.log(this.videoRoomId)
        this.socket.emit('stop-video', {
          from: this.myID,
          to: this.to,
          roomId: this.videoRoomId
        })
      }
      this.videoRoomId = null
      if (this.$refs.videoRef)
        this.$refs.videoRef.stop()
    },
    stopVideoByPro(roomId) {
      if (roomId === this.videoRoomId) {
        this.show_video = false
        if (this.view === 'professional') {
          this.socket.emit('stop-video', {
            from: this.myID,
            to: this.to,
            roomId: this.videoRoomId
          })
        }
        this.videoRoomId = null
        this.$refs.videoRef.stop()
      }
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
                  if (this.$refs.downloadUrlRef){
                    this.$refs.downloadUrlRef.click()
                  }
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
    sendMessage(opts) {
      if (!this.to) {
        const h = this.$createElement
        this.$info({
          title: this.$t('chnts'),
          content: h('div', {}, [
            h('p', this.$t('slchf'))
          ]),
          onOk() {
          }
        })
      } else if (this.allowed || this.isAdmin || this.isModerator) {
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
      }
      this.scrollMessagesSection()
    },
    openChat(uuid) {
      this.to = uuid
      this.messages = []
      if (this.myID && uuid){
        this.$api.get('/conversation/id/' + this.myID + '/' + uuid).then(({data}) => {
          if (data.conversationId) {
            this.$api.get('/conversation/messages/' + data.conversationId).then(({data}) => {
              this.messages = data
              this.$nextTick(() => {
                this.scrollMessagesSection()
                setTimeout(() => {
                  this.scrollMessagesSection()
                }, 600)
              })
            })
          }
        })
      }
    }
  }
}
</script>

<style scoped lang="sass">

#app-content
  margin-top: 50px

.chats-list
  display: none

.chats-list.show-video
  position: fixed !important
  left: 0
  right: 0
  width: 100% !important
  height: 100%
  overflow-y: auto !important
  bottom: 0
  top: 50px
  background: #fff
  z-index: 120
  display: block !important

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

.emoji-picker
  position: absolute
  bottom: 10px
  margin-left: 20px
  z-index: 250

.date-center
  line-height: 1em
  font-size: 12px

.ringing
  background-color: #fff
  position: absolute
  z-index: 250
  left: 0
  right: 0
  bottom: 0
  top: 0
  width: 100%
  height: 100%
@media screen and (min-width: $md)
  .emoji-picker
    bottom: 110px
    margin-left: 30px
    z-index: 250
  .typing-indicator
    left: 50% !important
  .chats-layout
    width: 100%
    .chats-list
      position: fixed
      width: 50%
      display: flex
      left: 0
      top: 50px
      overflow-y: auto
      height: 100%
      bottom: 0
      border-right: 1px solid $mdn-super-light-grey
      height: calc(100% - 50px)
      .moderators
        position: fixed
        top: 50px
        overflow-y: auto
        left: 0
        width: 50%

      .chats
        position: fixed
        top: calc(50px + 50vh)
        left: 0
        right: 0
        width: 50%
        overflow-y: auto

    .chat-view
      width: 50%
      display: flex
      position: fixed
      left: 50%
      height: 100%
      overflow-y: auto

  .chat-box-wrapper
    .chat-content
      .chat-content-top-bar
        left: 50%

      .chat-message
        width: 350px

    .upload-container
      left: 50%

    .chat-controls
      padding: 1rem
      height: 60px
      left: 50%

      img
        margin-right: 0.6rem
        margin-left: 0.6rem
  .message-container-100
    position: fixed
    left: 50%
    right: 0
    bottom: 60px
    top: 100px
    overflow-y: scroll
    z-index: 201

  .chats-list.show-video
    width: 50% !important
    .video-control
      // display: none !important


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

.video-control
  width: 100%
  margin-left: auto !important
  display: flex
  align-items: center
  justify-content: flex-end
  padding: 1rem
  box-shadow: 0 3px 6px #c9c6c6
  height: 50px
  i
    font-weight: bold
    color: red
    font-size: 1.9rem

</style>
