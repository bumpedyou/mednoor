<template>
  <a-row>
    <a-col>
      <p class='h1 text-center'>Your user has been deleted!</p>
    </a-col>
  </a-row>
</template>

<script>
export default {
  name: 'Blocked',
  middleware: ['authenticated', 'deleted-only'],
  head() {
    return {
      title: 'Account Deleted',
    }
  },
}
</script>

<style scoped>

</style>
