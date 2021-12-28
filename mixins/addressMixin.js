import { mapMutations } from 'vuex'

export default {
  computed: {
    ...mapMutations({
      setLine1: 'address/setLine1',
      setCity: 'address/setCity',
      setState: 'address/setState',
      setZip: 'address/setZip',
    }),
    address() {
      return this.$store.state.address || {}
    },
    line1: {
      get() {
        return this.address.line1 || ''
      },
      set(v) {
        this.$store.commit('address/setLine1', v)
      },
    },
    city: {
      get() {
        return this.address.city || ''
      },
      set(v) {
        this.$store.commit('address/setCity', v)
      },
    },
    state: {
      get() {
        return this.address.state || ''
      },
      set(v) {
        this.$store.commit('address/setState', v)
      },
    },
    zip: {
      get() {
        return this.address.zip || ''
      },
      set(v) {
        this.$store.commit('address/setZip', v)
      },
    },
  },
}
