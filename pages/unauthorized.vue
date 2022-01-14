<template>
  <div class="mh-100v">
    <v-row>
      <v-col>
        <h1>{{$t('unauthorized')}}</h1>
        <p>{{$t('yornt_auth')}}</p>
        <nuxt-link :to="localePath('/')">
          {{$t('home')}}
        </nuxt-link>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  name: 'Unauthorized',
    head() {
    return {
      title: this.$t('unauthorized'),
    }
  },
}
</script>
