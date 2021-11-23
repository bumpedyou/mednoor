<template>
  <div>
    <navbar></navbar>
    <a-row>
      <a-col v-if='!mounted || !isSmall' :xs='24' :sm='24' :md='12'>
        <BackgroundItem :file='file' source='api' height='100vh'></BackgroundItem>
      </a-col>
      <a-col :xs='24' :sm='24' :md='12' class='right-side'>
        <div class='content'>
          <nuxt></nuxt>
        </div>
        <div class='lang-container'>
          <flags-picker></flags-picker>
        </div>
      </a-col>
    </a-row>
    <a-row>
      <a-col>
        <div class='floating-chat'>
          <div class='bubble' @click='openChat'>
            <img :src="require('~/static/chat-c.png')" alt='chat icon'>
          </div>
          <div v-if='chatOpened' class='chat-box'>
            <div class='chat-box-header'>
              <div class='content'>
                Chat with an admin
              </div>
              <div class='close' @click='chatOpened = false'>
                <a-icon type='close'></a-icon>
              </div>
            </div>
            <div class='chat-box-body'>
              <chat-messages :messages='messages'></chat-messages>
              <div style='position:relative !important'>
                <typing-indicator v-model='isTyping'></typing-indicator>
              </div>
            </div>
            <div class='chat-box-controls'>
              <a-input type='text'/>
            </div>
          </div>
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import breakpoints from '~/mixins/breakpoints'
import FlagsPicker from '~/components/FlagsPicker'
import ChatMessages from '~/components/ChatMessages'
import chatMixin from '~/mixins/chatMixin'
import TypingIndicator from '~/components/TypingIndicator'
import Navbar from '~/components/Navbar'
export default {
  components: { Navbar, TypingIndicator, ChatMessages, FlagsPicker },
  mixins: [breakpoints, chatMixin],
  data() {
    return {
      mounted: false,
      messages: [],
      chatOpened: false,
      isTyping: false,
    }
  },
  computed: {
    file(){
      const type = this.$route.path.split('/').slice(-1)[0]
      return 'hs/' + type + '.png'
    }
  },
  created() {
    this.$api.get('/user/admin').then(({data})=>{
      console.log('Admin --->', data)
    })
  },
  mounted() {
    this.mounted = true
  },
  methods: {
    openChat () {
      this.chatOpened = true

      if (this.messages.length <= 0){
        this.isTyping = true
        setTimeout(()=>{
          this.messages.push({
            owner: false,
            message: 'Hello. Im the administrator of this website.',
            mess_date: new Date(),
          })
          this.playNotification()
          this.isTyping = false
          setTimeout(() => {
            this.isTyping = true
          }, 100)
          setTimeout(() => {
            this.messages.push({
              owner: false,
              message: 'How may I help you?',
              mess_date: new Date(),
            })
            this.isTyping = false
            this.playNotification()
          }, 500)
        }, 1000)
      }
    }
  },
}
</script>
<style lang='sass' scoped>
.right-side
  .content
    margin-bottom: auto
  .lang-container
    margin-top: auto
    display: flex
    justify-content: center

.typing-indicator
  bottom: 40px !important

@media screen and (min-width: $md)
  .typing-indicator
    left: unset !important
    right: 50px !important
    width: 250px !important
    bottom: 100px !important
</style>
