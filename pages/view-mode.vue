<template>
  <div class="pa-6 mh-100v">
    <div class='pa-1 mt-1'>
      <v-row class='mt-1' :gutter="3">
        <v-col>
          <div class="flex-center">
            <img alt='Mednoor Logo' :src='require("~/static/logo.jpg")'>
          </div>
          <p class='primary--text text-center'>
            Medical Center
          </p>
        </v-col>
      </v-row>
      <v-row>
        <v-col md="2" offset-md="4" >
          <div class='flex-center w-100'>
            <div class="bg-gradient-sun clickable pa-05" style='width: 183px;max-width: 100% !important' @click="setTheView('user')">
              <div class='flex-center'>
                <p class="h3 text-center">
                  <small class='text-muted-dark'>I am a</small><br>
                  <span style='font-weight: bold; color: #ffffff' class='h4'>Patient</span>
                </p>
              </div>
            </div>
          </div>
        </v-col>
        <v-col md="2">
          <div class='flex-center w-100'>
            <div class="bg-gradient-blue clickable pa-05" style='width: 183px;max-width: 100% !important' @click="setTheView('professional')">
              <div class='flex-center' >
                <p class="h3 text-center">
                  <small class='text-muted-dark'>
                    I am a
                  </small><br><span class='h4' style='font-weight: bold; color: #fff !important' >Professional</span>
                </p>
              </div>
            </div>
          </div>
        </v-col>
      </v-row>
      <v-row>
      </v-row>
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
import redirectionMixin from '~/mixins/redirectionMixin'
import userRoleMixin from "~/mixins/userRoleMixin";
import authMixin from "~/mixins/authMixin";


export default {
  name: "ViewMode",
  mixins: [redirectionMixin, userRoleMixin, authMixin],
  middleware: ['authenticated', 'verified', 'not-blocked', 'not-deleted'],
  computed: {
    ...mapMutations({
      setView: 'view/setView'
    }),
    callback(){
      return this.$route.query ? this.$route.query.callback : null
    }
  },
  mounted(){

    if (this.isAdmin || this.isSuper){
      this.$cookies.set('view', 'admin')
      this.$router.push(this.localePath('/dashboard'))
    }

    if (this.callback && this.isLoggedIn){
      return this.$router.push(this.localePath(decodeURIComponent(this.callback)))
    }

  },
  methods: {
    setTheView(view){
      this.$cookies.set('view', view)
      if (view === 'professional'){
        this.$router.push(this.localePath('/pin'))
      }else{
        this.$router.push(this.localePath('/professionals'))
      }
    }
  }
}
</script>

<style scoped>

</style>
