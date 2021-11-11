<template>
  <a-row class='pa-1'>
    <a-col>
      <p class="h1">
        Your chat has ended.
      </p>
      <p>
        Your chat has ended and you can find it on <nuxt-link to='/my-chats'>your previous chats</nuxt-link> in PDF format.
      </p>
      <p>
        Or you can go to your <nuxt-link to='/'>Chats List</nuxt-link>
      </p>
    </a-col>
  </a-row>
</template>

<script>
export default {
  name: 'ChatEnded',
  head() {
    return {
      title: 'Chat ended.',
    }
  },
}
</script>

<style scoped>

</style>
