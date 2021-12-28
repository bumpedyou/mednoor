<template>
<div class="mh-100v pa-6">
    <ChatItems :data='moderators' :selected-chat='to' @open-chat='openChat'></ChatItems>
</div>
</template>

<script>
import chatMixin from "~/mixins/chatMixin";
import ChatItems from "~/components/ChatItems";

export default {
  components: {ChatItems},
  mixins: [chatMixin],
  layout: 'new-chat',
  middleware: ['authenticated', 'verified', 'view-set', 'pin-set'],
  head() {
    return {
      title: this.$t('home'),
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: this.$t('seo.index')
        },
        {
          hid: 'og:description',
          name: 'og:description',
          content: this.$t('seo.index')
        },
        {
          hid: 'keywords',
          name: 'keywords',
          content: this.$t('seo.keywords.index')
        }
      ]
    }
  },
  mounted() {
    this.getChats()
  },
  methods: {
    openChat(uuid) {
      this.$router.push(this.localePath('/chat/' + uuid))
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
                }, 600)
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
  }
}
</script>
<style lang="sass">
#app-content
  margin-top: 50px
</style>
