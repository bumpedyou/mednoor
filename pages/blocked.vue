<template>
  <v-row>
    <v-col>
      <p class='h1 text-center'>{{$t('blocked_legend')}}</p>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'Blocked',
  middleware: ['authenticated', 'blocked-only' , 'verified'],
  head() {
    return {
      title: this.$t('acc_blocked'),
    }
  },
}
</script>
