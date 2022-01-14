
<template>
<div class="mh-100v">
  <v-row>
    <v-col class="pa-1">
      <p class="h1">{{$t('pwd_updated_suc')}}</p>
      <v-alert color="success" dark>
        <v-icon>mdi-check-circle</v-icon>
        Now you can sign in using your new password.
      </v-alert>
      <p>
        <nuxt-link :to="localePath('/welcome')">
          <v-icon>mdi-home</v-icon>
          {{$t('go_home')}}</nuxt-link>
      </p>
    </v-col>
  </v-row>
</div>
</template>

<script>
export default {
  name: "PasswordUpdated",
  middleware: ['authenticated', 'not-blocked', 'not-deleted', 'verified'],
  head() {
    return {
      title: this.$t('pwd_updated'),
    }
  },
}
</script>
