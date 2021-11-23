import moment from 'moment'
import userRoleMixin from '~/mixins/userRoleMixin'
import authMixin from '~/mixins/authMixin'

export default {
  data: () => ({
    chats: [],
    mixins: [userRoleMixin, authMixin],
    moderators: [],
    loadingItems: true,
  }),
  methods: {
    mergeWithConversations(addMessages) {
      this.loadingItems = true
      this.$api
        .get('/conversation/my-conversations')
        .then(({ data }) => {
          data.forEach((item) => {
            let exists = false
            this.moderators.forEach((mod) => {
              const mid = mod.user_uuid
              if (mid === item.u1_uuid || mid === item.u2_uuid) {
                exists = true
              }
            })
            if (!exists) {
              const u = {}
              if (item.u1_uuid !== this.$auth.user.uuid) {
                u.user_uuid = item.u1_uuid
                u.user_first_name = item.u1_fn
                u.user_last_name = item.u1_ln
              } else {
                u.user_uuid = item.u2_uuid
                u.user_first_name = item.u2_fn
                u.user_last_name = item.u2_ln
              }
              u.mypr_allowed = true

              console.log('Add messages', addMessages)

              if (addMessages) {
                u.messages = 1
              }
              this.moderators.push(u)
            }
          })
          this.chats = data
        })
        .catch((e) => {
          this.$refs.rmodal.$emit('error', e)
        })
        .finally(() => {
          this.loadingItems = false
        })
    },
    getChats(addMessages) {
      if (this.isLoggedIn) {
        this.loadingItems = true
        if(this.isAdmin){
          this.mergeWithConversations()
        }else if (this.isModerator) {
          this.$api
            .get('/my-professional/my-users/')
            .then(({ data }) => {
              this.moderators = data
            })
            .catch((e) => {
              this.$refs.rmodal.$emit('error', e)
            })
            .finally(() => {
              this.loadingItems = false
            })
        } else {
          this.$api
            .get('/my-professional')
            .then(({ data }) => {
              this.moderators = data
            })
            .catch((e) => {
              this.$refs.rmodal.$emit('error', e)
            })
            .finally(() => {
              this.loadingItems = false
            })
        }
      } else {
        this.moderators = []
        this.loadingItems = false
      }
    },
    openNotification(data) {
      data = data || {}
      this.$notification.open({
        message: data.title || this.$t('ch_lis_upd'),
        description: data.description || this.$t('ych_hb_upd'),
        style: {
          width: '600px',
          marginLeft: `${335 - 600}px`,
        },
      })
      this.playNotification()
    },
    playNotification() {
      const audioPath = process.env.BASE_URL + '/notification.mp3'
      const audio = new Audio(audioPath)
      audio
        .play()
        .then(() => {
          console.log('Sound played')
        })
        .catch((e) => {
          console.log('Sound not played')
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
    filePath(s) {
      return process.env.API_URL + '/file/' + s
    },
    isImg(fileName) {
      return (fileName.match(/\.(jpeg|jpg|gif|png)$/) != null)
    },
    hour(date){
      return moment(date).format('LTS');
    },
  },
}
