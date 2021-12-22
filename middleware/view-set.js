export default function ({ store, redirect, localePath, route, $cookies }) {
  if (store) {
    const view = $cookies.get('view')
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
