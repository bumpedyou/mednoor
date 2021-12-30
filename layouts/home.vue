<template>
  <v-app>
    <navbar></navbar>
    <div id="app-content">
      <v-row>
        <v-col v-if='!mounted || !isSmall' md="6">
          <BackgroundItem :file='file' source='api' height='100vh'></BackgroundItem>
        </v-col>
        <v-col md="6" class='right-side'>
          <div class='content'>
            <nuxt></nuxt>
          </div>
          <div class='main-text'>
          </div>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <BubbleChat></BubbleChat>
        </v-col>
      </v-row>
      <v-container>
        <v-row>
          <v-col md="6">
            <div v-if='main_text' class='middle-text'>
              <!-- eslint-disable vue/no-v-html -->
              <pre v-html='main_text'></pre>
              <!--eslint-enable-->
            </div>
          </v-col>
          <v-col md="6">
            <div v-if='main_text_b' class='middle-text'>
              <!-- eslint-disable vue/no-v-html -->
              <pre v-html='main_text_b'></pre>
              <!--eslint-enable-->
            </div>
          </v-col>
        </v-row>
      </v-container>
    </div>
    <MFooter></MFooter>
  </v-app>

</template>

<script>
import breakpoints from '~/mixins/breakpoints'
// import FlagsPicker from '~/components/FlagsPicker'
import Navbar from '~/components/Navbar'
import BackgroundItem from '~/components/BackgroundItem'
import MFooter from '~/components/MFooter'
import BubbleChat from '~/components/BubbleChat'

export default {
  components: {
    Navbar,
    // FlagsPicker,
    BackgroundItem,
    MFooter,
    BubbleChat
  },
  mixins: [breakpoints],
  data() {
    return {
      mounted: false,
      loadingMainTxt: true,
      main_text: '',
      main_text_b: '',
    }
  },
  computed: {
    file() {
      const type = this.$route.path.split('/').slice(-1)[0]
      return 'hs/' + type + '.png'
    }
  },
  mounted() {
    this.mounted = true
  },
  created() {
    this.$api.get('/main-text').then(({ data }) => {
      this.loadingMainTxt = false
      if (data && data.mate_text) {
        this.main_text = data.mate_text
        this.main_text_b = data.mate_text_b
      }
    })
  }
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

.main-text
  margin-top: 4rem
  display: flex
  justify-content: center
  align-items: center
  text-align: center

#app-content
  margin-top: 50px !important


</style>
