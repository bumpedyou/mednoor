<template>
  <div>
    <navbar></navbar>
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
    <a-row>
      <a-col>
        <BubbleChat></BubbleChat>
      </a-col>
    </a-row>
    <MFooter></MFooter>
  </div>
</template>

<script>
import breakpoints from '~/mixins/breakpoints'
import FlagsPicker from '~/components/FlagsPicker'
import Navbar from '~/components/Navbar'
import BackgroundItem from "~/components/BackgroundItem";
import MFooter from "~/components/MFooter";
import BubbleChat from "~/components/BubbleChat"

export default {
  components: { Navbar, FlagsPicker, BackgroundItem, MFooter, BubbleChat },
  mixins: [breakpoints],
  data() {
    return {
      mounted: false,
    }
  },
  computed: {
    file(){
      const type = this.$route.path.split('/').slice(-1)[0]
      return 'hs/' + type + '.png'
    }
  },
  mounted() {
    this.mounted = true
  },
}
</script>
<style lang='sass' scoped>
.right-side
  .content
    margin-bottom: auto
  .lang-container
    margin-top: auto
    display: flex
    justify-content: center
</style>
