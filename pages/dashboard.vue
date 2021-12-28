<template>
<div class="mh-100v pa-6">
    <a-row class="mb-3">
        <a-col>
              <a-breadcrumb>
                <a-breadcrumb-item>{{$t('dashboard')}}</a-breadcrumb-item>
            </a-breadcrumb>
        </a-col>
    </a-row>
    <a-row>
        <a-col :xs="24" :sm="24" >
          <div class="card-deck">
            <div v-for="(o, i) in dashboardItems" :key="'dashboard-' + i"   class="pa-3" @click="$router.push(localePath(o.to))">
              <v-card-text>
                <v-btn :color="o.type" small tile :dark="o.dark">
                  <v-icon class="mr-1">mdi-{{o.icon}}</v-icon>
                  {{o.cardTitle}}
                </v-btn>
              </v-card-text>
            </div>
          </div>
        </a-col>
    </a-row>
</div>
</template>


<script>
import dashboardOptionsList from '~/mixins/dashboardOptionsList'

export default {
  mixins: [dashboardOptionsList],
  layout: "dashboard",
  middleware: ['authenticated', 'not-blocked', 'not-deleted', 'verified', 'pin-set', 'view-set'],
  head (){
    return {
      title: this.$t('dashboard')
    }
  }
}
</script>
