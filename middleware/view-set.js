export default function ({ store, redirect, localePath, route }) {
  if (store) {
    const view = store.state.view.view
    if (
      !view ||
      (view !== 'professional' && view !== 'user' && view !== 'admin')
    ) {
      const callback = route.query ? route.query.callback : null
      return redirect({
        path: localePath('/view-mode'),
        query: {
          callback: callback || encodeURIComponent(route.path),
        },
      })
    }
  }
}
