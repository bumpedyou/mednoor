<template>
  <div class="mt-9">
      <v-row>
          <v-col md="8" offset-md="2">
            <v-card class="mt-6 gradient-tw" dark elevation="22" outlined :loading="loading">
              <v-card-text>
                <div class="mednoor-heading-svg">
                  <img :src='require("~/static/logo-white.png")' height="60px" alt="mednoor logo" />
                  <div>
                    <p class='h4 text-center dark'>
                      {{$t('med_med_cen')}}
                    </p>
                    <small class="h5 text-center d-block dark mt-1">
                      +1-251-633-0801
                    </small>
                  </div>
                </div>
                <v-form ref="form" v-model="validForm" class="mt-6" @submit.prevent='handleSubmit'>
                  <v-text-field v-model="email" label="Email" :rules="[v => !!v || $t('v.email_req'), v => !!v && v.length <= 150 || $t('v.max_email_150')]" prepend-inner-icon="mdi-email"></v-text-field>
                  <v-text-field v-model="password" label="Password" placeholder="Password" prepend-inner-icon="mdi-lock" type="password" :rules="[v => !!v || $t('v.pwd_req'), v => !!v && v.length > 5 || $t('v.min_6')]"></v-text-field>
                  <v-btn color="primary" dark block tile small :loading="loading" type="submit">
                    {{$t('sign_in')}}
                  </v-btn>
                  <div>
                    <small class="text-center d-block mb-0 mt-3">
                      <nuxt-link class="dark-link" :to="localePath('/forgot-password')">{{$t('forgot_pwd')}}</nuxt-link>
                    </small>
                    <hr class="my-3">
                    <small class="text-center d-block mb-0 mt-3">
                      {{$t('dont_h_acc')}}
                    </small>
                    <small class='text-center d-block mt-3'>
                      <v-btn :to="localePath('/sign-up')" color="info" tile small>{{$t('sign_up')}}</v-btn>
                    </small>
                  </div>
                </v-form>
              </v-card-text>
            </v-card>
          </v-col>
      </v-row>
    <RequestModal ref='rmodal'></RequestModal>
  </div>
</template>

<script>
import breakpoints from '~/mixins/breakpoints'

export default {

  mixins: [breakpoints],
  layout: 'home',
  middleware: ['unauthenticated'],
  data() {
    return {
      loading: false,
      validForm: false,
      email: '',
      password: '',
      file: '',
    }
  },
  head() {
    return {
      title: this.$t('seo.sign_in_title'),
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: this.$t('seo.sign_in')
        },
        {
          hid: 'og:image',
          name: 'og:image',
          content: process.env.BASE_URL + '/logo.png'
        }
      ]
    }
  },
  methods: {
    handleSubmit() {
      this.$refs.form.validate()
      if (this.validForm){
        this.loading = true
        setTimeout(() => {
          try {
            this.$auth
              .loginWith('local', {
                data: {
                  email: this.email,
                  password: this.password
                }
              })
              .then(() => {
                const q = this.$route.query
                const path = this.localePath('/welcome')
                if (q.callback){
                  this.$router.push({path, query: {
                      callback: q.callback
                    }})
                }else{
                  this.$router.push(path)
                }
              })
              .catch((e) => {
                console.log(e)
                this.$refs.rmodal.$emit('error', e)
              }).finally(()=>{
              this.loading = false
            })
          } catch (e) {
            console.log(e)
            this.$refs.rmodal.$emit('error', e)
          }finally {
            this.loading = false
          }
        }, 500)
      }
    },
  }
}
</script>
<style scoped lang="sass">
  .mednoor-heading-svg
    display: flex
    flex-direction: column
    justify-content: center
    align-items: center
    margin-bottom: 9px
    img
      margin-right: 6px

  @media screen and (min-width: $md)
    .mednoor-heading-svg
      flex-direction: row
</style>
