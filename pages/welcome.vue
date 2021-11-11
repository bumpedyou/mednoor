<template>
<div>

</div>
</template>

<script>
export default {
  name: 'Welcome',
  middleware({ $auth, store, redirect}) {
    if (!$auth.loggedIn) {
      return redirect('/')
    }else{
      const role = $auth.user.role.toLowerCase()
      console.log('Role is',role)
      if (role === 'admin' || role === 'super'){
        return redirect('/users-list')
      }else if (role === 'moderator'){
        return redirect('/')
      }else if (role === 'user'){
        return redirect('/')
      }else{
        return redirect('/')
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

<style scoped>

</style>
