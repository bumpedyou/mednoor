export const state = () => ({
  line1: '',
  city: '',
  state: '',
  zip: '',
})

export const mutations = {
  setLine1(state, line1) {
    state.line1 = line1
  },
  setCity(store, city) {
    store.city = city
  },
  setState(store, state) {
    store.state = state
  },
  setZip(store, zip) {
    store.zip = zip
  },
}
