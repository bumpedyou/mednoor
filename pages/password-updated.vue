<template>
<div>
  <a-row>
    <a-col class="pa-1">
      <p class="h1">Password updated successfully!</p>
      <p>
        <nuxt-link to="/welcome">
          <a-icon type="home"></a-icon>
          Go home</nuxt-link>
      </p>
    </a-col>
  </a-row>
</div>
</template>

<script>
export default {
  name: "PasswordUpdated"
}
</script>

<style scoped>

</style>
