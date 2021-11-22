<template>
<div></div>
</template>

<script>
export default {
  name: 'Welcome',
  middleware({ $auth, store, redirect, localePath}) {
    console.log(localePath)
    if (!$auth.loggedIn) {
      return redirect(localePath('/'))
    }else{
      const role = $auth.user.role.toLowerCase()
      if (role === 'admin' || role === 'super'){
        return redirect(localePath('/dashboard'))
      }else if (role === 'moderator'){
        return redirect(localePath('/dashboard'))
      }else if (role === 'user'){
        return redirect(localePath('/'))
      }else{
        return redirect(localePath('/'))
      }
    }
  },
  head() {
    return {
      title: 'Welcome.',
    }
  },
}
</script>
