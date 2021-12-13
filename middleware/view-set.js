export default function ({ $auth, store, redirect, localePath, route }) {
  if (store){
    const view = store.state.view.view
    console.log('--->', view)
    if (!view || view !== 'professional' && view !== 'user') {
      console.log('We are at', route.path)
      return redirect({path: localePath('/view-mode'), query: {callback: encodeURIComponent(route.path)}})
    }
  }
}
