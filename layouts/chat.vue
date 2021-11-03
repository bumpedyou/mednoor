<template>
  <div>
    <navbar></navbar>
    <div id='app-content'>
      <div :class='chatsLayoutClass'>
        <div class='chats-list'>
          <div v-if='isUser' class='moderators'>
            <div class='chat-item-title'>
              <b class='h3'>My Professionals</b>
            </div>
            <a-skeleton v-if='loadingItems' class='pa-1'></a-skeleton>
            <div v-else>
              <div v-if="moderators && moderators.length > 0">
                <ChatItem v-for='(m,i) in moderators' :key='i' :active='to === m.user_uuid' @click='openChat(m.user_uuid)'>{{ m.user_first_name }} {{ m.user_last_name }}</ChatItem>
              </div>
              <div v-else class="pa-1">
                You don't have professionals.
                <nuxt-link to="/professionals">Professionals Available</nuxt-link>
              </div>
            </div>
          </div>
          <div v-if="isModerator" class="moderators">
            <div class='chat-item-title'>
              <b class='h3'>My Users</b>
            </div>
            <a-skeleton v-if='loadingItems' class='pa-1'></a-skeleton>
            <div v-else>
              <div v-if="moderators && moderators.length > 0">
                <ChatItem v-for='(m,i) in moderators' :key='i' :active='to === m.user_uuid' @click='openChat(m.user_uuid)'>{{ m.user_first_name }} {{ m.user_last_name }}</ChatItem>
              </div>
              <div v-else class="pa-1">
                You don't have users
              </div>
            </div>
          </div>
          <div class='chats'>
            <div class='chat-content-box'>
              <div class='chat-item-title'><b ref='yourChats' class='h3'>Your chats</b></div>
            </div>
          </div>
        </div>
        <div ref='chatView' class='chat-view'>
          <div ref='chatBox' class='chat-box-wrapper'>
            <div ref='pdfArea'> <!--:class='pdfAreaClass'-->
              <div ref="chatContent" class='chat-content'>
                <div class='chat-content-top-bar'>
                  <div style='margin-right: auto' class='ml-1'>
                    {{ selectedUser }}
                  </div>
                  <div class='mr-1'>
                    Me: {{$auth.user.user_first_name}} {{$auth.user.last_name}}
                  </div>
                  <img :src="require('~/static/icon/video.svg')" alt='video icon' @click='showVideo'>
                </div>
                <div id="messages" ref='messages' :key='messages.length' class='message-container-100'>
                  <div v-for='(msg, i) in messages' :key="'msg-' + i" :ref="'msg-' + i" :class='messageClass(msg.owner)'>
                    <span v-if='msg'>
                      {{ msg.message }}
                    </span>
                    <span v-if='msg.mimetype && msg.mimetype.includes("image")'>
                      <img :src='msg.path' :alt='msg.originalName' class='img-fluid'>
                    </span>
                    <span v-else>
                      <a target='_blank' :href="msg.path" :download="msg.path">{{msg.name}}</a>
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div v-if='fileName' class='upload-container'>
              <small class='mr-1 text-muted'>{{fileName}}</small>
              <a-progress :percent='umUploadProgress'></a-progress>
              <a-button type='danger' @click='cancelUpload'> <a-icon type="close" /> Cancel </a-button>
              <a-button type='primary' @click='uploadFile'> <a-icon type="upload" /> Upload </a-button>
            </div>
            <div class='chat-controls'>
              <div>
                <img :src="require('~/static/icon/happy-face.svg')" alt='happy face'>
              </div>
              <a-input v-model='message' placeholder='Type a message' @keyup.enter='sendMessage(null)'></a-input>
              <div class='chat-multiple-controls'>
                <img v-if="!isUser" :src="require('~/static/icon/save.svg')" alt='save icon' @click='saveChatAsPdf'>
                <input id='file' ref='fileInput' type='file' style='opacity: 0; display: none' @change='fileChange'/>
                <label for='file'>
                  <img :src="require('~/static/icon/attachment.svg')" alt='attachment icon'>
                </label>
                <img :src="require('~/static/icon/send.svg')" alt='send icon' @click='sendMessage(null)'>
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
// eslint-disable-next-line import/no-named-as-default
import jsPDF from 'jspdf'
import domtoimage from 'dom-to-image'
import Navbar from '~/components/Navbar'
import RequestModal from '~/components/RequestModal'
import listenMixin from '~/mixins/listenMixin'
import userRoleMixin from '~/mixins/userRoleMixin'
import userUpdatedMixin from '~/mixins/userUpdatedMixin'
import uploadMixin from '~/mixins/uploadMixin'
import ChatItem from "~/components/ChatItem";

export default {
  name: 'Chat',
  components: {
    Navbar,
    RequestModal,
    ChatItem
  },
  mixins: [listenMixin, userRoleMixin, userUpdatedMixin, uploadMixin],
  middleware: ['authenticated', 'not-blocked', 'not-deleted'],
  data: () => ({
    savingPdf: false,
    loadingItems: true,
    message: '',
    moderators: [],
    to: '',
    messages: [],
    file: null,
    fileName: '',
    allowed: false,
    messagesScrollHeight: 0,
  }),
  computed: {
    selectedUser(){
      let u = ''
      if (this.to){
        this.moderators.forEach((m)=>{
          if (m.user_uuid === this.to){
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
      console.log('pdfAreaClass', c)
      return c.join(' ')
    }
  },
  watch: {
    file(f){
      console.log('File --->', f)
    }
  },
  mounted() {
    if (this.isModerator){
      this.$api.get('/my-professional/my-users/').then(({ data }) => {
        this.moderators = data
        console.log('Get my assigned users that are allowed');
      }).catch((e)=>{
        this.$refs.rmodal.$emit('error', e)
      }).finally(() => {
        this.loadingItems = false
      })
    }else{
      this.$api.get('/my-professional').then(({ data }) => {
        this.moderators = data
      }).catch((e) => {
        this.$refs.rmodal.$emit('error', e)

      }).finally(() => {
        this.loadingItems = false
      })
    }
    this.run_once(this.listen)
  },
  methods: {
    scrollMessagesSection(){
      this.$nextTick(()=>{
        const c = this.$refs.messages
        c.scrollTop = c.scrollHeight
      })
    },
    uploadFile(){
      const file = this.$refs.fileInput.files
      if (file && file.length && file.length > 0){
        const data = new FormData()
        data.append('file', file[0])

        this.$api.post('/file', data, {
          onUploadProgress: (evt) => {
            console.log('ON progress', this.umUploadProgress)
            this.onProgress(evt)
          },
        }).then(({data})=>{
          console.log('Show file in chat!', data)
          this.fileName = 0
          this.umUploadProgress = 0
          const opts = {
            mimetype: data.mimetype,
            type: 'file',
            name: data.originalName,
            path: process.env.API_URL + '/file/' + data.fName,
            owner: true,
          }
          this.messages.push(opts)
          console.log('this.sendMessage(opts)')
          this.sendMessage(opts)
        }).catch((err)=>{
          this.umUploadProgress = 0
          this.$refs.rmodal.$emit('error', err)
        }).finally(()=>{

        })
      }
    },
    cancelUpload(){
      this.fileName = ''
      this.$refs.fileInput.value = ''
    },
    fileChange(f){
      console.log('On File Change')
      const file = f.target.value
      if (file){
        this.fileName = file.split('\\').pop().split('/').pop();
        console.log('Can upload', this.fileName)
      }
    },
    showVideo(){
      console.log('Video app is inactive at this time')
      const h = this.$createElement;
      this.$info({
        title: 'Info',
        content: h('div', {}, [
          h('p', 'Video app is inactive at this time'),
        ]),
        onOk() {
        }
      });
    },
    saveChatAsPdf() {
      this.savingPdf = true
      /** WITH CSS */
      domtoimage
        .toPng(this.$refs.chatView)
        .then(function(dataUrl) {
          if (dataUrl !== 'data:,') {
            /*
          }
            const img = new Image()
            img.src = dataUrl
            const pageHeight = 295
            const imgWidth = 210
            let position = 0
            // eslint-disable-next-line new-cap
            const doc = new jsPDF('p', 'mm')

            const imgHeight = dataUrl.height * imgWidth / dataUrl.width;
            let heightLeft = imgHeight;

            // const width = doc.internal.pageSize.getWidth();
            // const imgProps= doc.getImageProperties(dataUrl);
            // const pdfHeight = (imgProps.height * width) / imgProps.width;
            // doc.addImage(img, 'JPEG', 0, 0, width, pdfHeight)

            doc.addImage(dataUrl, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;

            while (heightLeft >= 0) {
              position += heightLeft - imgHeight; // top padding for other pages
              doc.addPage();
              doc.addImage(dataUrl, 'PNG', 0, position, imgWidth, imgHeight);
              heightLeft -= pageHeight;
            }
            **/
            // eslint-disable-next-line new-cap
            const doc = new jsPDF('p', 'mm');

            // var imgData = canvas.toDataURL('image/png');
            const imgData = dataUrl;
            const imgWidth = 210;
            const pageHeight = 295;
            const imgProps= doc.getImageProperties(dataUrl);

            const imgHeight = imgProps.height * imgWidth / imgProps.width;
            console.log('imgHeight: ', dataUrl, imgProps.height, imgWidth, imgProps.width);
            let heightLeft = imgHeight;
            let position = 0; // give some top padding to first page

            doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;

            while (heightLeft >= 0) {
              position += heightLeft - imgHeight; // top padding for other pages
              doc.addPage();
              doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
              heightLeft -= pageHeight;
            }


            const date = new Date()
            const filename =
              'timechart_' +
              date.getFullYear() +
              ('0' + (date.getMonth() + 1)).slice(-2) +
              ('0' + date.getDate()).slice(-2) +
              ('0' + date.getHours()).slice(-2) +
              ('0' + date.getMinutes()).slice(-2) +
              ('0' + date.getSeconds()).slice(-2) +
              '.pdf'
            doc.save(filename)
          }
        }).finally(() => {
        this.savingPdf = false
      })
    },
    messageClass(isOwner) {
      const c = ['chat-message']
      if (isOwner) {
        c.push('owner')
      }
      return c.join(' ')
    },
    sendMessage(opts) {

      if (this.allowed){
        if (opts){
          this.socket.emit('send-message', {
            to: this.to,
            opts
          })
        }
        else if (this.message && this.message.length > 0){
          this.socket.emit('send-message', {
            to: this.to,
            message: this.message
          })
          this.messages.push({
            owner: true,
            message: this.message
          })
          this.message = ''
        }
      }else{
        const h = this.$createElement;
        this.$info({
          title: 'Not allowed',
          content: h('div', {}, [
            h('p', 'You have to wait you be allowed to send messages to this professional.'),
          ]),
          onOk() {
          }
        });
      }
      this.scrollMessagesSection()
    },
    openChat(uuid) {
      this.messages = []
      this.to = uuid
      if (this.to) {
        this.socket.emit('open-chat', {
          to: uuid,
          from: this.$auth.user.uuid
        })
      }
    },
    listen() {
      this.socket = this.$nuxtSocket({ persist: 'chatSocket' })
      this.socket.emit('join-room', this.$auth.user.uuid)
      this.socket.on('open-chat', (data) => {
        this.to = data.from
      })
      this.socket.on('new-message', (data) => {
        console.log('new message received', data)
        if (data.opts){
          data.opts.owner = false
          this.messages.push(data.opts)
        }else{
          this.messages.push({
            owner: false,
            message: data.message
          })
        }
        this.scrollMessagesSection()
      })
      this.socket.on('fetch-user', async () => {
        await this.$auth.fetchUser()
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
      a
        color: #fff
        text-decoration: underline

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
