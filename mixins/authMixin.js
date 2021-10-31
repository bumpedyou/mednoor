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
  },
}
