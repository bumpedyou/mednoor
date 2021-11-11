<template>
  <div>
    <div>
      <a-row>
        <a-col class='mt-1' :xs='{span: 20, offset: 2}' :md='{span: 12, offset: 6}' :lg='{span: 10, offset: 7}' :xl='{span: 8, offset: 8}'>
          <a-card>
            <h1 class='text-center'>Forgot my password</h1>
            <p class='text-center'>
              We'll send you a verification code to your email.
            </p>
            <a-form :form='form' size='small' @submit='handleSubmit'>
              <a-form-item label='Email'>
                <a-input v-decorator="['email',{
                    rules: [{ required: true, message: 'Email is required!' },
                    {max: 100, message: 'Max email length is 150'},
                    {type: 'email', message: 'Enter a valid email'}
                    ],
                  },
                  ]"
                  placeholder='Email'
                />
              </a-form-item>
              <a-button block type='primary' html-type='submit'>
                <SpinOrText v-model='loading'>
                  Send email
                </SpinOrText>
              </a-button>
            </a-form>
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
  name: 'ForgotPassword',
  auth: false,
  components: {
    RequestModal,
    SpinOrText
  },
  data() {
    return {
      formLayout: 'horizontal',
      form: this.$form.createForm(this, { name: 'coordinated' }),
      loading: false,
      code: '',
    }
  },
    head() {
    return {
      title: 'Forgot my password',
      meta: [
        // hid is used as unique identifier. Do not use `vmid` for it as it will not work
        {
          hid: 'description',
          name: 'description',
          content: 'Reset the password of your mednoor\'s account.'
        }
      ]
    }
  },
  methods: {
    handleSubmit(e) {
      e.preventDefault()
      this.form.validateFields( (err, values) => {
          if (!err) {
            this.loading = true
            this.$api.post('/user/forgot-password', {
              email: values.email,
            }).then(() =>{
              this.$store.commit('setEmail', values.email)
              this.$router.push({
                path: '/reset-password',
              })
            }).catch((err)=>{
              this.$refs.rmodal.$emit('error', err)
            }).finally(() =>{
              this.loading = false
            })
          }
        }
      )
    },

  }
}
</script>

<style scoped>

</style>
