import authMixin from '~/mixins/authMixin'

export default {
  mixins: [authMixin],
  methods: {
    user_was_updated() {
      if (this.isLoggedIn) {
        console.log('User has been updated', this.$auth.user)
        const user = this.$auth.user
        if (user.blocked) {
          this.$router.push('/blocked')
        } else if (this.$route.path === '/blocked') {
          this.$router.push('/welcome')
        }
      }
    },
  },
}