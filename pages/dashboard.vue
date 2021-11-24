<template>
<div class="mh-100v pa-1">
    <a-row class="mb-1">
        <a-col>
              <a-breadcrumb>
                <a-breadcrumb-item>{{$t('dashboard')}}</a-breadcrumb-item>
            </a-breadcrumb>
        </a-col>
    </a-row>
    <a-row type="flex" :gutter="[16,16]">
        <a-col v-for="(o, i) in dashboardItems" :key="'dashboard-' + i" :xs="24" :sm="24" :md="{span: 6}" :lg="{span: 3}" flex="2" style="max-width: 245px" >
            <a-card :title="o.cardTitle"  style="height: 100%; flex: 1;" :class="'card-' + o.type" @click="$router.push(localePath(o.to))">
                <a-button :type="o.type">
                    <a-icon :type="o.icon"></a-icon>
                    {{o.btnText}}
                </a-button>
            </a-card>
        </a-col>
    </a-row>
</div>
</template>


<script>
import dashboardOptionsList from '~/mixins/dashboardOptionsList'

export default {
  mixins: [dashboardOptionsList],
  layout: "dashboard",
  head (){
    return {
      title: this.$t('dashboard')
    }
  }
}
</script>
