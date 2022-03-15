<template>
  <div class="mh-100v pa-6">
    <div>
      <v-text-field
        v-model="search"
        type="search"
        filled
        dense
        placeholder="Search"
        label="Search"
      ></v-text-field>
    </div>
    <ChatItems
      :data="filteredModerators"
      :selected-chat="to"
      @open-chat="openChat"
    ></ChatItems>
  </div>
</template>

<script>
import chatMixin from '~/mixins/chatMixin'

export default {
  mixins: [chatMixin],
  layout: 'new-chat',
  middleware: ['authenticated', 'verified', 'view-set', 'pin-set'],
  data: () => ({
    search: '',
    filteredModerators: [],
  }),
  head() {
    return {
      title: this.$t('home'),
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: this.$t('seo.index'),
        },
        {
          hid: 'og:description',
          name: 'og:description',
          content: this.$t('seo.index'),
        },
        {
          hid: 'keywords',
          name: 'keywords',
          content: this.$t('seo.keywords.index'),
        },
        {
          hid: 'og:image',
          name: 'og:image',
          content: process.env.BASE_URL + '/logo.png',
        },
      ],
    }
  },
  watch: {
    moderators(v) {
      if (Array.isArray(v)) {
        this.filteredModerators = [...v]
      }
    },
    search(v) {
      this.filteredModerators = this.moderators.filter((mod) => {
        // console.log('Mod', mod)
        let fn = [mod.user_first_name, mod.user_last_name].join(' ')
        if (fn) {
          fn = fn.toLowerCase()
          if (fn.includes(v.toLowerCase())) {
            return mod
          }
        }
        return false
      })
    },
  },
  mounted() {
 
    this.getChats()
  },
  methods: {
    openChat(uuid) {
    
      if (this.$route.path.includes('messanger')) {
        this.$router.push(this.localePath('/messanger/' + uuid))
      }

      if (!this.to || this.to !== uuid) {
        this.messages = []
        this.$api.get('/conversation/id/' + this.$auth.user.uuid + '/' + uuid).then(({ data }) => {
          if (data.conversationId && data.conversationId !== -1) {
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

     // console.log(this.moderators)
    },
  },
}
</script>
<style lang="sass">
#app-content
  margin-top: 50px
</style>
