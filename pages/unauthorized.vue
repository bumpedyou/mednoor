<template>
<a-row>
  <a-col>
    <h1>Unauthorized</h1>
    <p>
      You are not authorized to access that page.
    </p>
    <nuxt-link to='/'>
      Home
    </nuxt-link>
  </a-col>
</a-row>
</template>

<script>
export default {
  name: 'Unauthorized'
}
</script>

<style scoped>

</style>
