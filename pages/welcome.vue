<template>
<div></div>
</template>

<script>
export default {
  name: 'Welcome',
  middleware({ $auth, store, redirect, localePath}) {
    if (!$auth.loggedIn) {
      return redirect(localePath('/'))
    }else{
      const role = $auth.user.role.toLowerCase()
      if (role === 'admin' || role === 'super'){
        return redirect(localePath('/dashboard'))
      }else if (role === 'moderator'){
        console.log('Redirect to view-mode')
        return redirect(localePath('/view-mode'))
        // return redirect(localePath('/dashboard')) // We have to give time to enter the pin
      }else if (role === 'user'){
        console.log('Redirect to view-mode')
        return redirect(localePath('/view-mode'))
      }else{
        return redirect(localePath('/'))
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
