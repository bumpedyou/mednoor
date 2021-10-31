<template>
  <div>
    <navbar></navbar>
    <div id="app-content">
      <Nuxt />
    </div>
  </div>
</template>

<script>
import Navbar from '~/components/Navbar'

export default {
  name: 'Default',
  components: {
    Navbar,
  }
}
</script>

<style scoped lang='sass'>
#app-content
  margin-top: 50px
</style>
