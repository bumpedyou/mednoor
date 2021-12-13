export const state = () => ({
  view: null,
})

export const mutations = {
  setView(state, view) {
    if (typeof view === 'string'){
      view = view.toLowerCase()
      if (view === 'professional' || view === 'user'){
        state.view = view
      }
    }
  },
}
