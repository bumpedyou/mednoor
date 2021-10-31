<template>
  <div>
    <div>
      <a-row>
        <a-col class='mt-1' :xs='{span: 20, offset: 2}' :md='{span: 12, offset: 6}' :lg='{span: 10, offset: 7}' :xl='{span: 8, offset: 8}'>
          <a-card>
            <h1 class='text-center'>Reset your password</h1>
            <p class='text-center'>
              We have sent you an email with a verification code to  <b>{{email}}</b>
            </p>
            <a-form-item label='Verification Code'>
              <a-input v-model='code' placeholder='Enter the verification code' :max-length='9'></a-input>
            </a-form-item>
            <a-button block type='primary' @click='verify'>
              <SpinOrText v-model='loading'>
                Confirm Code
              </SpinOrText>
            </a-button>
          </a-card>
        </a-col>
      </a-row>
    </div>
    <RequestModal ref='rmodal'></RequestModal>
  </div>
</template>

<script>
import RequestModal from '~/components/RequestModal'
import SpinOrText from '~/components/SpinOrText'
export default {
  name: 'VerifyEmail',
  components: {
    RequestModal,
    SpinOrText
  },
  data: ()=>({
    loading: false,
    code: '',
  }),
  computed: {
    email(){
      return this.$store.state.email
    }
  },
  mounted(){
    if (!this.email){
      this.$router.push('/forgot-password')
    }
  },
  methods: {
    verify(){
      if(this.code && this.code.length === 9){
        this.loading = true
        this.$api.post('/user/verify-password-code', {
          email: this.email,
          code: this.code
        }).then( ({ data }) => {
          if (data && data.success) {
            this.$store.commit('setCode', this.code)
            this.$router.push('/confirm-reset-password')
          }else{
            this.$refs.rmodal.$emit('error', 'Unknown error. Please try again later.')
          }
        }).catch((e)=>{
          this.$refs.rmodal.$emit('error', e)
        }).finally(()=>{
          this.loading = false
        })
      }else{
        this.$refs.rmodal.$emit('error', 'Enter a verification code of 9 digits')
      }
    },
  }
}
</script>

<style scoped>

</style>
