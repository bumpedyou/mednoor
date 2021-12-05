export const state = () => ({
  pin: null,
})

export const mutations = {
  setPIN(state, pin) {
    state.pin = pin
  },
}
