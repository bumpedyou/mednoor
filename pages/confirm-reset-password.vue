<template>
  <div>
    <div>
      <a-row>
        <a-col class='mt-1' :xs='{span: 20, offset: 2}' :md='{span: 12, offset: 6}' :lg='{span: 10, offset: 7}' :xl='{span: 8, offset: 8}'>
          <a-card>
            <h1 class='text-center'>Reset your password</h1>
            <p class='text-center'>
              <b>{{email}}</b><br>
              Reset your password
            </p>
            <a-form :form='form' size='small' @submit='handleSubmit'>
              <a-row>
                <a-col :xs='{span: 24}'>
                  <a-form-item label='Password'>
                    <a-input v-decorator="
              [
                'password',
                {
                rules: [
                  {required: true, message: 'Password is required!'},
                  {min: 6, message: 'Enter at least 6 characters'}
                ]
                }
              ]" placeholder='Password' type='password'>
                      <a-icon slot='prefix' type='lock' style='color:rgba(0,0,0,.25)' />
                    </a-input>
                  </a-form-item>
                </a-col>
                <a-col :xs='{span: 24}'>
                  <a-form-item label='Confirm password'>
                    <a-input v-decorator="
              [
                'confirm_password',
                {
                rules: [
                  {required: true, message: 'Confirm password is required!'},
                  {min: 6, message: 'Enter at least 6 characters'}
                  ]
                }
              ]" placeholder='Confirm password' type='password'>
                      <a-icon slot='prefix' type='lock' style='color:rgba(0,0,0,.25)' />
                    </a-input>
                  </a-form-item>
                </a-col>
              </a-row>
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
  name: 'ConfirmResetPassword',
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
    }
  },
  head() {
    return {
      title: 'Confirm reset password',
    }
  },
  computed: {
    email(){
      return this.$store.state.email
    },
    code(){
      return this.$store.state.code
    },
  },
  mounted(){
    if (!this.email || !this.code){
      this.$router.push('/forgot-password')
    }
  },
  methods: {
    handleSubmit(e) {
      e.preventDefault()
      this.form.validateFields( (err, values) => {
          if (!err) {
            this.loading = true
            this.$api.patch('/user/password', {
              email: this.email,
              code: this.code,
              password: values.password,
              confirm_password: values.confirm_password,
            }).then(() =>{
              this.$auth
                .loginWith('local', {
                  data: {
                    email: this.email,
                    password: values.password,
                  },
                })
                .then(() => {
                  // this.$refs.requests_dialog.onSuccess('Cuenta creada!')
                  this.$router.push('/')
                })
                .catch((e) => {
                  console.log('catch', e)
                  this.$router.push('/sign-in')
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
