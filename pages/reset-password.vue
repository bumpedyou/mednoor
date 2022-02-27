<template>
  <div class="mh-100v">
    <div>
      <v-row>
        <v-col class='mt-1' md="6" offset-md="3">
          <v-card>
            <v-card-title>
              <h1 class='text-center w-100'>{{$t('reset_y_pwd')}}</h1>
            </v-card-title>
            <v-card-text>
              <p class='text-center'>
                {{$t('ver_code_sent')}}  <b>{{email}}</b>
              </p>
              <div>
                <v-text-field v-model='code' :placeholder="$t('enter_ver_code')" :max-length='9'></v-text-field>
              </div>
              <v-btn block small tile color='primary' :loading="loading" @click='verify'>
                {{$t('conf_code')}}
              </v-btn>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </div>
    <RequestModal ref='rmodal'></RequestModal>
  </div>
</template>

<script>
export default {
  name: 'VerifyEmail',
  data: ()=>({
    loading: false,
    code: '',
  }),
  head() {
    return {
      title: this.$t('reset_pwd'),
    }
  },
  computed: {
    email(){
      return this.$store.state.email
    }
  },
  mounted(){
    if (!this.email){
      this.$router.push(this.localePath('/forgot-password'))
    }
  },
  methods: {
    verify(){
      if(this.code && this.code.length === 9){
        this.loading = true
        this.$userApi.post('/verify-password-code', {
          email: this.email,
          code: this.code
        }).then( ({ data }) => {
          if (data && data.success) {
            this.$store.commit('setCode', this.code)
            this.$router.push(this.localePath('/confirm-reset-password'))
          }else{
            this.$refs.rmodal.$emit('error', this.$t('unk_tyl'))
          }
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
