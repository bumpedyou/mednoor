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

  api.onError((err) => {
    if (err.response && err.response.status) {
      const status = err.response.status
      if (status === 401) {
        console.log(
          'We have an unauthorized request. We have to refresh the token and try again.'
        )
        console.log(app.$auth.strategy.token.get())
      }
    }
    return err
  })
  api.onRequestError((err) => {
    console.log('[api.js] We have an error --->', err)
    return err
  })

  // SET THE APIS URL
  api.setBaseURL(process.env.API_URL)

  // Inject to context as $api
  inject('api', api)
}
