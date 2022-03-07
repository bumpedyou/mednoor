<template>
  <v-app>
    <navbar></navbar>
    <div id="app-content">
      <a-row class="pa-6 mh-100v">
        <a-col span="8" offset="8">
          <h1 class="h1 text-center w-100 mb-1">{{ $t('welcome') }}</h1>
          <div class="f-center w-100">
            <a-spin></a-spin>
          </div>
        </a-col>
      </a-row>
      <!-- <v-row>
        <v-col v-if='!mounted || !isSmall' md="6">
          <BackgroundItem :file='file' source='api' height='100vh'></BackgroundItem>
        </v-col>
        <v-col md="6" class='right-side' >
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
            
              <pre v-html='main_text'></pre>
           
            </div>
          </v-col>
          <v-col md="6">
            <div v-if='main_text_b' class='middle-text'>
       
              <pre v-html='main_text_b'></pre>
        
            </div>
          </v-col>
        </v-row>
      </v-container> -->
    </div>
    <!-- <MFooter></MFooter> -->
  </v-app>
</template>

<script>
import breakpoints from '~/mixins/breakpoints'
// import FlagsPicker from '~/components/FlagsPicker'
import Navbar from '~/components/Navbar'
// import BackgroundItem from '~/components/BackgroundItem'
// import MFooter from '~/components/MFooter'
// import BubbleChat from '~/components/BubbleChat'

export default {
  components: {
    Navbar,
    // FlagsPicker,
    // BackgroundItem,
    // MFooter,
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
    },
  },
  mounted() {
    this.mounted = true
    console.log(this.$route.query.token_exchange)
    this.login()
  },
  created() {
    this.$api.get('/main-text').then(({ data }) => {
      this.loadingMainTxt = false
      if (data && data.mate_text) {
        this.main_text = data.mate_text
        this.main_text_b = data.mate_text_b
      }
    })
  },
  methods: {
    async login() {
      try {
        await this.$auth.loginWith('local', {
          data: {
            session_id: this.$route.query.token_exchange,
          },
        }).then(res=>{
         // console.log(res)
           localStorage.setItem('session_id',res.data.session_id);
           this.$router.push(this.localePath('/'))
        })
      
      } catch (e) {
        window.location.href = process.env.HOME_URL
      }
    },
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

.main-text
  margin-top: 4rem
  display: flex
  justify-content: center
  align-items: center
  text-align: center

#app-content
  margin-top: 50px !important
</style>
