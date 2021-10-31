<template>
<div>
  <h1 class="text-center">Chat Section.</h1>
  <h2 class='text-center'>User is logged in.</h2>
</div>
</template>

<script>

export default {
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
