<template>
  <v-app>
    <navbar></navbar>
    <div id="app-content">
      <v-row>
    
        <v-col md="12" class=' d-flex justify-center' >
          <div class='content w-50'>
            <nuxt></nuxt>
          </div>
     
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <!-- <BubbleChat></BubbleChat> -->
        </v-col>
      </v-row>
      <div>

      </div>
    </div>
    <MFooter></MFooter>
  </v-app>

</template>

<script>
import breakpoints from '~/mixins/breakpoints'
// import FlagsPicker from '~/components/FlagsPicker'
import Navbar from '~/components/Navbar'

import MFooter from '~/components/MFooter'
// import BubbleChat from '~/components/BubbleChat'
export default {
  components: {
    Navbar,
    // FlagsPicker,
  
    MFooter,
    // BubbleChat
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
<style scoped>
  .content {
    width:600px
  }
</style>
