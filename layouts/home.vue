<template>
  <div>
    <a-row>
      <a-col v-if='!mounted || !isSmall' :xs='24' :sm='24' :md='12'>
        <BackgroundItem :file='file' source='api' height='100vh'></BackgroundItem>
      </a-col>
      <a-col :xs='24' :sm='24' :md='12' class='right-side'>
        <div class='content'>
          <nuxt></nuxt>
        </div>
        <div class='lang-container'>
          <flags-picker></flags-picker>
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import breakpoints from '~/mixins/breakpoints'
import FlagsPicker from '~/components/FlagsPicker'

export default {
  components: { FlagsPicker },
  mixins: [breakpoints],
  data() {
    return {
      file: '',
      mounted: false
    }
  },
  created() {
    this.$api.get('/home-screen').then(({ data }) => {
      if (data && data.screen && data.screen.hosc_file) {
        this.file = 'hs/' + data.screen.hosc_file
      }
    }).catch((e) => {
      console.log('Failed to get the home screen', e)
    })
  },
  mounted() {
    this.mounted = true
  },
}
</script>
<style lang='sass'>
.right-side
  .content
    margin-bottom: auto
  .lang-container
    margin-top: auto
    display: flex
    justify-content: center
</style>
