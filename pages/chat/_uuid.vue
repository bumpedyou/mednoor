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
      <!--
      <video-call ref="videoRef" :close="stopVideo"></video-call>
      -->
      <v-dialog
        v-model="dialog"
        fullscreen
        hide-overlay
        transition="dialog-bottom-transition"
      >
        <v-card>
          <v-toolbar
            dark
            color="primary"
          >
            <v-btn
              icon
              dark
              @click="dialog = false"
            >
              <v-icon>mdi-close</v-icon>
            </v-btn>
            <v-toolbar-title>Upload a File</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-items>
              <v-btn
                dark
                text
                @click="dialog = false"
              >
                Close
              </v-btn>
            </v-toolbar-items>
          </v-toolbar>
          <v-list
            three-line
            subheader
          >
          </v-list>
          <v-divider></v-divider>
          <div v-if="uploadingFile" class="pa-9 ma-3 flex-center">
            <v-progress-linear :value="umUploadProgress"></v-progress-linear>
          </div>
          <v-list
            v-else
            three-line
            subheader
          >
            <v-subheader>Select a File</v-subheader>
            <v-list-item>
              <div v-if="fileName" class="file-name">
                <div>
                  {{ fileName }}
                  <v-icon color="error" class="ml-3 clickable" @click="removeFile">mdi-close</v-icon>
                </div>
                <div>
                </div>
              </div>
              <label v-else for='file' class="clickable file-upload-box-w">
                <v-icon>mdi-upload</v-icon>
                Upload
              </label>
            </v-list-item>
            <v-list-item class="mt-3">
              <v-text-field v-model="fileTitle" label="Title" placeholder="Title"></v-text-field>
            </v-list-item>
            <v-list-item class="mt-3">
              <v-textarea v-model="description" label="Description" placeholder="Description" filled></v-textarea>
            </v-list-item>
            <v-list-item v-if="false">
              <div class='upload-container flex-center'>
                <small class='mr-1 text-muted'>{{ fileName }}</small>
                <v-progress-linear :value='umUploadProgress' class="mx-3"></v-progress-linear>
              </div>
            </v-list-item>
            <v-list-item>
              <v-btn color='error' small tile @click='cancelUpload'>
                <v-icon>mdi-close</v-icon>
                Cancel
              </v-btn>
              <v-btn small tile color='primary' @click='uploadFile'>
                <v-icon>mdi-upload</v-icon>
                {{ $t('upload') }}
              </v-btn>
            </v-list-item>
          </v-list>
        </v-card>
      </v-dialog>
      <div class="left-panel">
        <div class="main-container-w">
          <div class="main-w-content-x">
            <div class="gallery-w">
              <div v-if="loadingFiles">
                <v-progress-circular indeterminate></v-progress-circular>
              </div>
              <v-data-table v-else :items="convFiles" :headers="[
                {
                  text: 'Title',
                  value: 'file_title',
                },
                {
                  text: 'Description',
                  value: 'file_description',
                },
                {
                  text: 'File Title',
                  value: 'file_ext',
                },
                {
                  text: 'Date',
                  value: 'mess_date'
                }
              ]" :search="search">
                <template #top>
                  <v-text-field
                    v-model="search"
                    label="Search"
                    class="mx-4"
                  ></v-text-field>
                </template>
                <template #[`item.file_title`] = "{item}">
                  <a target='_blank' :href='filePath(item.file_name)' :download='filePath(item.file_name)' style="text-decoration: underline !important">
                    {{ item.file_title }}
                  </a>
                </template>
                <template #[`item.file_ext`]="{item}" ]>
                  {{ getExt(item.file_name) }}
                </template>
                <template #[`item.mess_date`] = "{value}">
                  {{dateString(value)}}<br>
                  <small class="d-block text-center text-muted">{{hour(value)}}</small>
                </template>
              </v-data-table>
              <!--
              <div v-for="(f, i) in convFiles" :key="i" class="gallery-item-w">
                <p class="gi-w-text-1">
                  {{ f.file_description }}
                </p>
                <div class="file-thumbnail">
                  <img v-if="isImage(f.file_name)" :src="filePath(f.file_name)" alt="File"/>
                  <span v-else>.{{ getExt(f.file_name) }}</span>
                </div>
                <div class="date-w">
                  {{ dateString(f.mess_date) }} {{ hour(f.mess_date) }}
                </div>
              </div>
              -->
            </div>
          </div>
        </div>
        <div class='w-controls' @click="dialog=true">
          <v-icon>mdi-upload</v-icon>
        </div>
      </div>
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
                    {{ userName }}
                  </span>
                </div>
              </div>
              <div class='mx-auto'>
                <small class="d-block text-center date-center mr-3">
                  {{ dateString(new Date()) }}
                  <br>
                  {{ hour(timestamp) }}
                </small>
              </div>
              <div class='mr-1'>
                {{ professionalName }}
              </div>
              <!--
              <v-icon v-if="view === 'professional'" class="mx-1" @click='showVideo'>mdi-video</v-icon>
              -->
              <v-icon class="mx-1" @click='leaveChat'>mdi-chevron-left</v-icon>
            </div>
            <div id='messages' ref='messages' :key='messages.length' class='message-container-100'>
              <chat-messages :messages='messages'></chat-messages>
            </div>
          </div>
        </div>
        <typing-indicator :value='toIsTyping'></typing-indicator>
        <VEmojiPicker v-if='showEmojiPicker' class="emoji-picker" @select="selectEmoji"/>
        <div class='chat-controls'>
          <div class="mr-1">
            <v-icon @click='showEmojiPicker = !showEmojiPicker'>mdi-emoticon-outline</v-icon>
          </div>
          <v-text-field v-model='message' placeholder='Type a message' @keyup="imTyping" @keyup.enter='sendMessage(null)'></v-text-field>
          <div class='chat-multiple-controls'>
            <v-icon v-if='!isUser' class="mx-1" @click='askSavePDF'>mdi-content-save</v-icon>
            <input id='file' ref='fileInput' type='file' style='opacity: 0; display: none' @change='fileChange'/>
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
          {{ callerName }} is calling you...
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


import {VEmojiPicker} from 'v-emoji-picker';
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
import ProfilePicture from "~/components/ProfilePicture";
import dateMixin from "~/mixins/dateMixin";
import ConfirmDialog from "~/components/ConfirmDialog";
export default {
  name: "Uuid",
  components: {ConfirmDialog, ChatMessages, TypingIndicator, RequestModal, ProfilePicture, VEmojiPicker},
  mixins: [listenMixin, userRoleMixin, userUpdatedMixin, uploadMixin, chatMixin, authMixin, breakpoints, chatMixin, dateMixin],
  layout: 'new-chat',
  middleware: ['authenticated', 'verified', 'pin-set', 'view-set'],
  data() {
    return {
      conversationId: null,
      loadingFiles: false,
      uploadingFile: false,
      search: '',
      convFiles: [],
      description: '',
      dialog: false,
      showEmojiPicker: false,
      visible: false,
      confirmLoading: false,
      savingPdf: false,
      messages: [],
      file: null,
      fileName: '',
      fileTitle: '',
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
    leftClasses() {
      const c = ['chats-list']
      if (this.show_video) {
        c.push('show-video')
      }
      return c.join(' ')
    },
    toIsTyping() {
      return this.to === this.typing
    },
    downloadUrl() {
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
    selectedUserObj() {
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
          if (m.user_uuid === this.to) {
            this.allowed = true
            if (!this.allowed) {
              this.$router.push(this.localePath('/'))
            }
            u = m.user_last_name + ', ' + m.user_first_name + ' ' + (m.profe_credentials ? m.profe_credentials : '')
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
  watch: {
    fileName(s) {
      this.fileTitle = s
    },
    file(s) {
      console.log('File has changed.', s)
    }
  },
  mounted() {
    this.getChats()
    this.run_once(this.listen)
    this.setChatFromRoute()
    this.socket.on('start-video', ({from, roomId, name}) => {

      this.callerName = name
      this.ringing = true

      this.ring().then(() => {
      }).catch(() => {
      })
      /*
      if (from === this.to && roomId) {
        this.joinVideo(roomId)
      } */

      this.callingRoomId = roomId
    })
    this.socket.on('stop-video', ({from, roomId}) => {
      if (from === this.to && roomId) {
        this.stopVideoByPro(roomId)
      }
    })
    this.socket.on('call-accepted', ({roomId}) => {
      this.stopAudio()
      this.$refs.videoRef.start(roomId)
      this.videoRoomId = roomId
    })

    this.socket.on('stop-ringing', ({roomId}) => {
      this.stopAudio()
      this.ringing = false
    })

  },
  created() {
    setInterval(this.getNow, 1000);
  },
  methods: {
    loadFiles(){
      if (this.conversationId){
        this.loadingFiles = true
        this.$api.get('/conversation/messages/files/' + this.conversationId).then(({data}) => {
          this.convFiles = data
        }).catch((e) => {
          console.log('Unable to get the files of the conversation')
          console.log(e)
          alert(e)
        }).finally(() => {
          this.loadingFiles = false
        })
      }
    },
    isImage(s) {
      const e = this.getExt(s).toLowerCase()
      return e === 'jpg' || e === 'jpeg' || e === 'png' || e === 'gif'
    },
    getExt(s) {
      return s.split('.').pop()
    },
    removeFile() {
      this.$refs.fileInput.value = ""
      this.$refs.fileInput.dispatchEvent(new Event('change'))
    },
    stopAudio() {
      if (this.audio) {
        this.audio.currentTime = 0
        this.audio.pause()
      }
    },
    acceptCall() {
      this.joinVideo(this.callingRoomId)
      this.stopAudio()
      this.ringing = false
      this.socket.emit('call-accepted', {
        roomId: this.callingRoomId,
        to: this.to,
        from: this.myUserId
      })
    },
    ring() {
      this.audio = this.getSound('phone-ringing.mp3')
      return this.audio.play()
    },
    getNow() {
      const today = new Date();
      const date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
      const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
      const dateTime = date + ' ' + time;
      this.timestamp = dateTime;
    },
    setChatFromRoute() {
      // const c = this.$route.query
      const p = this.$route.params
      if (p && p.uuid) {
        this.openChat(p.uuid)
      }
    },
    selectEmoji(e) {
      this.message += e.data
      this.showEmojiPicker = false
    },
    imTyping(evt) {
      if (this.sentTypingEvt || evt.key === 'Enter')
        return
      this.socket.emit('typing-to', {to: this.to, from: this.myID})
      this.sentTypingEvt = true
      setTimeout(() => {
        this.sentTypingEvt = false
      }, 1600)
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

        data.append('title', this.fileTitle)
        data.append('description', this.description)
        this.uploadingFile = true
        this.$api.post('/file', data, {
          onUploadProgress: (evt) => {
            this.onProgress(evt)
          }
        }).then(({data}) => {
          console.log('Data ---->', data)
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
          this.dialog = false
          this.loadFiles()
        }).catch((err) => {
          this.umUploadProgress = 0
          this.$refs.rmodal.$emit('error', err)
        }).finally(() => {
          this.uploadingFile = false
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
      } else {
        this.fileName = ''
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
      this.show_video = true
      this.videoRoomId = roomId
      if (this.$refs.videoRef)
        this.$refs.videoRef.join(roomId)
    },
    stopVideo() {
      this.show_video = false
      if (this.view === 'professional') {
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
            }).then(({data}) => {
              if (data.file_name) {
                this.pdfName = data.file_name
                this.$nextTick(() => {
                  if (this.$refs.downloadUrlRef) {
                    this.$refs.downloadUrlRef.click()
                  }
                })
              } else {
                this.$refs.rmodal.$emit('error', 'PDF File not found')
              }
            }).catch((err) => {
              this.$refs.rmodal.$emit('error', err)
            })
          } else {
            this.$refs.rmodal.$emit('error', 'The PDF was empty')
          }
        })
        .finally(() => {
          this.visiblePDF = false
          this.confirmLoading = false
          setTimeout(() => {
            this.savingPdf = false
          }, 1500)
        })
    },
    sendMessage(opts) {
      if (this.to === this.myID) {
        this.$refs.rmodal.$emit('error', "You can't chat with yourself.")
      } else if (!this.to) {
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
      if (this.myID && uuid) {
        this.$api.get('/conversation/id/' + this.myID + '/' + uuid).then(({data}) => {
          if (data.conversationId && data.conversationId !== -1) {
            this.conversationId = data.conversationId
            this.$api.get('/conversation/messages/' + data.conversationId).then(({data}) => {
              this.messages = data
              this.$nextTick(() => {
                this.scrollMessagesSection()
                setTimeout(() => {
                  this.scrollMessagesSection()
                }, 600)
              })
            }).catch((e) => {
              alert(e)
            })

            this.loadFiles()

          } else {
            this.$refs.rmodal.$emit('error', 'Conversation not found')
          }
        }).catch((e) => {
          this.$refs.rmodal.$emit('error', e)
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

.file-upload-box-w
  width: 100px
  height: 100px
  border: 1px dashed $mdn-primary
  display: flex
  justify-content: center
  align-items: center

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

.gallery-w
  width: 100%
  display: flex
  flex-wrap: wrap

  .gallery-item-w
    padding: 0
    display: block
    flex-grow: 2
    width: 120px
    font-size: 8px !important
    box-shadow: 0 3px 6px #ccc
    margin-bottom: 6px
    text-align: center
    margin-right: 9px

    .gi-w-text-1
      font-size: 9px !important
      white-space: nowrap
      overflow: hidden
      text-overflow: ellipsis
      padding: 3px

    .gi-w-text-1.top
      background-color: #333
      padding: 0.6rem

      a
        color: #fff !important

    .file-thumbnail
      display: block
      margin: 0 auto
      max-width: 120px
      border: 1px solid #eee

      img
        max-width: 100%
        max-height: 100px

      span
        font-size: 3em

    .date-w
      padding: 3px


@media screen and (min-width: $md)
  .gallery-w
    .gallery-item-w
      width: 100%
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


.left-panel
  display: flex !important
  flex-direction: column !important
  flex-grow: 1
  width: 100% !important

  > div
    display: flex
    flex: 1

  .w-controls
    position: fixed
    left: 0
    bottom: 0
    width: 100%
    background: #fff
    border-top: 1px solid $mdn-super-light-grey
    box-shadow: inset 0 1px 3px $mdn-super-light-grey
    padding: 0.5rem
    height: 60px
    display: flex
    align-items: center
    justify-content: center

    &:hover
      cursor: pointer

      i
        color: $mdn-primary

  .main-container-w
    width: 50%
    position: fixed
    bottom: 60px
    top: 100px
    overflow-y: auto
    padding: 0.6rem

    overflow-x: hidden
    display: flex
    flex-wrap: wrap

    ::-webkit-scrollbar
      width: 10px

    /* Track */


    ::-webkit-scrollbar-track
      background: #f1f1f1

    /* Handle */


    ::-webkit-scrollbar-thumb
      background: #888

    /* Handle on hover */


    ::-webkit-scrollbar-thumb:hover
      background: #555

    .main-w-content
      width: 50%
      min-width: 300px
      height: fit-content

@media screen and (min-width: $md)
  .left-panel
    flex-direction: row

    .w-controls
      width: 50%
      right: 50%

.main-w-content.zoom
  position: fixed
  top: 50px
  bottom: 60px
  padding: 1px
  align-content: center
  height: calc(100% - 110px)
  display: flex
  right: 0
  width: 100% !important
  line-height: 0
  z-index: 1000
  background: white


</style>
