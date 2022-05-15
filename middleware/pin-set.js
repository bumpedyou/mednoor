export default function ({
  $auth,
  store,
  redirect,
  localePath,
  route,
  $cookies,
}) {
  if ($auth.user) {
    const u = $auth.user
    let view = $cookies.get('view')
    if (typeof view === 'string') {
      view = view.toLowerCase()
    }
    if (u && u.role === 'MODERATOR' && view === 'professional') {
      if (store) {
        const pinState =$cookies.get('setPIN')
        const validPin = $cookies.get('setValidPin')
        if (!pinState || !validPin) {
          console.log('We are at', route.path)
          return redirect({
            path: localePath('/pin'),
            query: { callback: encodeURIComponent(route.path) },
          })
        }
      }
    }
  }
}
