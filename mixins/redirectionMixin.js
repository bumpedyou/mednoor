import authMixin from '~/mixins/authMixin'
export default {
  mixins: [authMixin],
  methods: {
    checkRedirect() {
      // Only logged-in users.
      if (this.isLoggedIn) {
        const q = this.$route.query
        if (q && q.callback) {
          return this.$router.push(decodeURIComponent(q.callback))
        } else {
          return this.$router.push(this.localePath('/dashboard'))
        }
      }
    },
  },
}
