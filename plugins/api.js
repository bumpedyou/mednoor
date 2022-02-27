export default function ({ $axios, app }, inject) {
  // Create axios instance
  const api = $axios.create({
    headers: {
      common: {
        Accept: 'application/json',
      },
    },
  })
  // Create interceptor to add the user's token.
  api.onRequest((config) => {
    if (app.$auth.loggedIn) {
      const token = app.$auth.strategy.token.get().split(' ')[1] // Get the token only
      api.setToken(token, 'Bearer') // Bearer token
    }
    return config
  })

  // SET THE APIS URL
  api.setBaseURL(process.env.API_URL)

  // Inject to context as $api
  inject('api', api)








  // Create user  axios instance
  const userApi = $axios.create({
    headers: {
      common: {
        Accept: 'application/json',
      },
    },
  })
  // Create interceptor to add the user's token.
  userApi.onRequest((config) => {
    if (app.$auth.loggedIn) {
      const token = app.$auth.strategy.token.get().split(' ')[1] // Get the token only
      userApi.setToken(token, 'Bearer') // Bearer token
    }
    return config
  })

  // SET THE APIS URL

  console.log(process.env.USER_BASE_URL)
  userApi.setBaseURL(process.env.USER_BASE_URL)

  // Inject to context as $api
  inject('userApi', userApi);





  // appointments api 


    // Create user  axios instance
    const appointmentsApi = $axios.create({
      headers: {
        common: {
          Accept: 'application/json',
        },
      },
    })
    // Create interceptor to add the user's token.
    appointmentsApi.onRequest((config) => {
      if (app.$auth.loggedIn) {
        const token = app.$auth.strategy.token.get().split(' ')[1] // Get the token only
        appointmentsApi.setToken(token, 'Bearer') // Bearer token
      }
      return config
    })
  
    // SET THE APIS URL
  
   // console.log(process.env.USER_BASE_URL)
    appointmentsApi.setBaseURL(process.env.APPOINTMENTS_URL)
  
    // Inject to context as $api
    inject('appointmentsApi', appointmentsApi);





    // insurance api 

    

  // appointments api 


    // Create user  axios instance
    const insuranceApi = $axios.create({
      headers: {
        common: {
          Accept: 'application/json',
        },
      },
    })
    // Create interceptor to add the user's token.
    insuranceApi.onRequest((config) => {
      if (app.$auth.loggedIn) {
        const token = app.$auth.strategy.token.get().split(' ')[1] // Get the token only
        insuranceApi.setToken(token, 'Bearer') // Bearer token
      }
      return config
    })
    insuranceApi.setBaseURL(process.env.INSURANCE_URL)
    inject('insuranceApi', insuranceApi);


}
