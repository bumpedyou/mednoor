<template>
  <div class="mh-100v">
    <v-row>
      <v-col>
        <p class="h1">
          {{$t('chat_ended')}}
        </p>
        <p>
          <v-alert dark color="success">
            <v-icon class="mr-1">mdi-check-circle</v-icon>
            {{$t('chat_p1')}} <nuxt-link class="dark-link fw-b text-underlined" :to="localePath('/my-chats')">{{$t('chat_p2')}}</nuxt-link>
            {{ $t('chat_p3') }}
          </v-alert>
        </p>
        <p>
          {{$t('chat_a1')}} <nuxt-link :to="localePath('/')">{{$t('chats_list')}}</nuxt-link>
        </p>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  name: 'ChatEnded',
  middleware: ['authenticated', 'not-blocked', 'not-deleted', 'verified'],
  head() {
    return {
      title: this.$t('chat_ended'),
    }
  },
}
</script>
