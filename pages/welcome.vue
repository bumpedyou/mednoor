<template>
<div></div>
</template>

<script>
export default {
  name: 'Welcome',
  middleware({ $auth, redirect, localePath, route}) {
    const q = route.query || {}
    const callback = q.callback || null

    if (!$auth.loggedIn) {
      return redirect({
        path: localePath('/'),
        query: {callback},
      })
    }else{

      const role = $auth.user.role.toLowerCase()
      if (role === 'admin' || role === 'super'){
        return redirect({
          path: localePath('/dashboard'),
          query: {callback},
        })
      }else if (role === 'moderator'){
        return redirect({
          path: localePath('/view-mode'),
          query: {callback},
        })
        // return redirect(localePath('/dashboard')) // We have to give time to enter the pin
      }else if (role === 'user'){
        return redirect({
          path: localePath('/view-mode'),
          query: {callback},
        })
      }else{
        return redirect({
          path: localePath('/'),
          query: {callback},
        })
      }
    }
  },
  head() {
    return {
      title: this.$t('welcome'),
    }
  },
}
</script>
