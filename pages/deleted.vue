<template>
  <div class='mh-100v'>
    <v-row >
      <v-col>
        <p class='h1 text-center'>{{$t('usr_del')}}</p>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  name: 'Blocked',
  middleware: ['authenticated', 'deleted-only', 'verified'],
  head() {
    return {
      title: this.$t('acc_del'),
    }
  },
}
</script>
