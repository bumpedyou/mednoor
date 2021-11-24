<template>
<div class="mh-100v pa-1">
    <a-row class="mb-1">
        <a-col>
              <a-breadcrumb>
                <a-breadcrumb-item>{{$t('dashboard')}}</a-breadcrumb-item>
            </a-breadcrumb>
        </a-col>
    </a-row>
    <a-row>
        <a-col  :xs="24" :sm="24" >
          <div class="dashboard-items">
            <a-card v-for="(o, i) in dashboardItems" :key="'dashboard-' + i" :title="o.cardTitle"  style="height: 100%; flex: 1;" :class="'card-' + o.type" @click="$router.push(localePath(o.to))">
              <a-button :type="o.type">
                <a-icon :type="o.icon"></a-icon>
                {{o.btnText}}
              </a-button>
            </a-card>
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
  head (){
    return {
      title: this.$t('dashboard')
    }
  }
}
</script>
<style scoped lang="sass">
.dashboard-items
  display: flex
  flex-wrap: wrap
  .ant-card
    margin-right: 0.3rem
    margin-left: 0.3rem
    margin-bottom: 0.3rem

</style>
