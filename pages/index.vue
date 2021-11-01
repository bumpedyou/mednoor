<template>
<div></div>
</template>

<script>

export default {
  layout: 'chat',
  middleware: ['authenticated', 'verified'],
  head() {
    return {
      title: 'Home',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: 'Mednoor is a real-time chat application.'
        },
        {
          hid: 'og:description',
          name: 'og:description',
          content: 'Mednoor is a real-time chat application.'
        }
      ]
    }
  },
}
</script>
<style scoped lang='sass'>


</style>
