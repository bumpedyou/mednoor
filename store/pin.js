export const state = () => ({
  pin: null,
  valid: false,
})

export const mutations = {
  setPIN(state, pin) {
    state.pin = pin
  },
  setValid(state, valid){
    state.valid = valid
  }
}
