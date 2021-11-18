<template>
  <div>
    <a-row>
      <a-col v-if="!isSmall" :xs="24" :sm="24" :md="12">
        <BackgroundItem :file="file" source="api"  height="100vh"></BackgroundItem>
      </a-col>
      <a-col :xs="24" :sm="24" :md="12">
          <nuxt></nuxt>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import breakpoints from '~/mixins/breakpoints'

export default {
  mixins: [breakpoints],
  data() {
    return {
      file: '',
    }
  },
  created(){
    this.$api.get('/home-screen').then(({data})=>{
      if (data && data.screen && data.screen.hosc_file){
        this.file = 'hs/' + data.screen.hosc_file
      }
    }).catch((e)=>{
      console.log('Failed to get the home scren', e)
    })
  },
}
</script>
