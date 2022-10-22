/** بسم الله الرحمن الرحيم */
export const state = () => ({
    pnumber: '',
    selectedCountry:{}
  })
  
  export const mutations = {
    setPhone(store, pnumber) {
      store.pnumber = pnumber
    },
    setCountry(state, selectedCountry) {
      state.selectedCountry = selectedCountry
    },
  }
  