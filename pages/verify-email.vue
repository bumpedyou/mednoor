<template>
  <div class="pa-6 mh-100v">
    <div>
      <v-row>
        <v-col class='mt-1' md="6" offset-md="3" lg="4" offset-lg="4">
          <v-card>
            <v-card-title>
              <h1 class="text-center w-100">{{$t('verify_email')}}</h1>
            </v-card-title>
            <v-card-text>
              <p class='text-center'>
                {{$t('ver_code_sent')}}
              </p>
              <v-text-field v-model='code' :placeholder="$t('enter_ver_code')" :max-length='9'></v-text-field>
            </v-card-text>
            <v-card-actions>
              <v-btn small tile block color='primary' :loading="loading" @click='verify'>
                {{$t('very')}}
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </div>
    <RequestModal ref='rmodal'></RequestModal>
  </div>
</template>

<script>
import RequestModal from '~/components/RequestModal'
export default {
  name: 'VerifyEmail',
  components: {
    RequestModal,
  },
  middleware: ['authenticated', 'not-verified'],
  data: ()=>({
    loading: false,
    code: '',
  }),
  head() {
    return {
      title: this.$t('verify_email'),
    }
  },

  methods: {
    verify(){
      if(this.code && this.code.length === 9){
        this.loading = true
        this.$userApi.post('/verify', {
          code: this.code
        }).then(async () => {
          await this.$auth.fetchUser()
          await this.$router.push(this.localePath('/view-mode'))
        }).catch((e)=>{
          this.$refs.rmodal.$emit('error', e)
        }).finally(()=>{
          this.loading = false
        })
      }else{
        this.$refs.rmodal.$emit('error', this.$t('ent_ver_code'))
      }
    },
  }
}
</script>
