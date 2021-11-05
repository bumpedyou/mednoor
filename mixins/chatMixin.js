import userRoleMixin from '~/mixins/userRoleMixin'

export default {
  data: () => ({
    chats: [],
    mixins: [userRoleMixin],
    moderators: [],
    loadingItems: true,
  }),
  methods: {
    getChats() {
      if (this.isModerator) {
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
  },
}
