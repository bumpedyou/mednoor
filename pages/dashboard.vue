<template>
  <div class="mh-100v pa-6">
    <v-row class="mb-3">
      <v-col>
        <v-breadcrumbs
          :items="[
            {
              text: $t('dashboard'),
              disabled: true,
            },
          ]"
        >
        </v-breadcrumbs>
      </v-col>
    </v-row>
    <v-row>
      <v-col md="12">
        <div class="card-deck">
          <div
            v-for="(o, i) in dashboardItems"
            :key="'dashboard-' + i"
            class="pa-3"
            @click="navigate(o)"
          >
            <v-card-text>
              <v-btn :color="o.type" small tile :dark="o.dark">
                <v-icon class="mr-1">mdi-{{ o.icon }}</v-icon>
                {{ o.title }}
              </v-btn>
            </v-card-text>
          </div>
        </div>
      </v-col>
    </v-row>
  </div>
</template>


<script>
import dashboardOptionsList from '~/mixins/dashboardOptionsList'

export default {
  mixins: [dashboardOptionsList],
  layout: 'dashboard',
  middleware: [
    'authenticated',
    'not-blocked',
    'not-deleted',
    'verified',
    'pin-set',
    'view-set',
  ],
  head() {
    return {
      title: this.$t('dashboard'),
    }
  },
  methods: {
    navigate(value) {
      console.log(value)
      if (value && value.redirect) {
        const sessionId = localStorage.getItem('session_id')
        const url = `${process.env.PAYMENT_URL}/financial?session_id=${sessionId}`
        window.open(url)
      } else {
        this.$router.push(this.localePath(value.to))
      }
    },
  },
}
</script>
