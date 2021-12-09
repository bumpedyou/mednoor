export default function ({ $auth, store, redirect, localePath, route }) {
  if ($auth.user){
    const u = $auth.user
    if (u && u.role === 'MODERATOR') {
      if (store){
        const pinState = store.state.pin
        if (!pinState || !pinState.valid) {
          console.log('We are at', route.path)
          return redirect({path: localePath('/pin'), query: {callback: encodeURIComponent(route.path)}})
        }
      }
    }
  }
}
