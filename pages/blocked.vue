<template>
  <a-row>
    <a-col>
      <p class='h1 text-center'>You have been blocked!</p>
    </a-col>
  </a-row>
</template>

<script>
export default {
  name: 'Blocked',
  middleware: ['authenticated', 'blocked-only'],
  head() {
    return {
      title: 'Account Blocked',
    }
  },
}
</script>

<style scoped>

</style>
