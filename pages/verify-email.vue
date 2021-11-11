<template>
  <div>
    <div>
      <a-row>
        <a-col class='mt-1' :xs='{span: 20, offset: 2}' :md='{span: 12, offset: 6}' :lg='{span: 10, offset: 7}' :xl='{span: 8, offset: 8}'>
          <a-card>
            <h1 class='text-center'>Verify your email</h1>
            <p class='text-center'>
              We have sent you an email with a verification code.
            </p>
            <a-form-item label='Verification Code'>
              <a-input v-model='code' placeholder='Enter the verification code' :max-length='9'></a-input>
            </a-form-item>
            <a-button block type='primary' @click='verify'>
              <SpinOrText v-model='loading'>
                Verify
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
  middleware: ['authenticated', 'not-verified'],
  data: ()=>({
    loading: false,
    code: '',
  }),
  head() {
    return {
      title: 'Verify your email.',
    }
  },
  methods: {
    verify(){
      if(this.code && this.code.length === 9){
        this.loading = true
        this.$api.post('/user/verify', {
          code: this.code
        }).then(async ({ data }) => {
          const user = await this.$auth.fetchUser()
          console.log('Fetched user', user)
          await this.$router.push('/')
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
