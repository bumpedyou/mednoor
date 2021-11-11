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
          content: 'Mednoor is an Online Medical Center where people can chat in real time with Doctors.'
        },
        {
          hid: 'og:description',
          name: 'og:description',
          content: 'Mednoor is an Online Medical Center where people can chat in real time with Doctors.'
        }
      ]
    }
  },
}
</script>
<style scoped lang='sass'>


</style>
