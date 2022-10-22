/** بسم الله الرحمن الرحيم */
import { mapMutations } from 'vuex'
 
export default {
  computed: {
    ...mapMutations({
        setCountry: 'phone/setCountry',
        setPhone:'phone/setPhone'
    }),
    phone() { 
      return this.$store.state.phone || {}
    },
    selectedCountry: {
      get() {
        return this.phone.selectedCountry || { }
      },
      set(v) {
        this.$store.commit('phone/setCountry', v)
      },
    },
    number: {
        get() {
          return this.phone.number || ''
        },
        set(v) {
          this.$store.commit('phone/setPhone', v)
        },
      }
  },
}
