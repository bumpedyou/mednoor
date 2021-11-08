export default {
  data: () => ({
    isMounted: false,
  }),
  mounted() {
    this.isMounted = true
  },
  computed: {
    isLoggedIn() {
      return this.isMounted && this.$auth.loggedIn
    },
    myUser() {
      if (this.isLoggedIn) {
        return this.$auth.user
      } else {
        return { uuid: null }
      }
    },
    myUserId() {
      return this.myUser.uuid
    },
  },
}
