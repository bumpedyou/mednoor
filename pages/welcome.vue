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
      if (role === 'admin' || role === 'super' || role === 'moderator'){
        return redirect('/users-list')
      }else{
        return redirect('/')
      }
    }
  }
}
</script>

<style scoped>

</style>
