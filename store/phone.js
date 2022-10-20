/** بسم الله الرحمن الرحيم */
export const state = () => ({
    number: '',
    selectedCountry:{}
  })
  
  export const mutations = {
    setPhone(store, number) {
      store.number = number
    },
    setCountry(state, selectedCountry) {
      state.selectedCountry = selectedCountry
    },
  }
  