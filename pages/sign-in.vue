<template>
  <div>
    <a-row>
      <a-col class='mt-1' :xs='{span: 20, offset: 2}' :md='{span: 12, offset: 6}' :lg='{span: 10, offset: 7}' :xl='{span: 8, offset: 8}'>
        <a-card>
          <h1 class='h1 text-center'>Sign In</h1>
          <a-form :form='form' size='small' @submit='handleSubmit'>
            <a-form-item>
              <a-input
                v-decorator="[
            'email',
            {
              rules: [{ required: true, message: 'Email is required!' },
              {max: 100, message: 'Max email length is 150'},
              {type: 'email', message: 'Enter a valid email'}],
            },
          ]"
                placeholder='Email'
              />
            </a-form-item>
            <a-form-item >
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
            <a-form-item>
              <a-button type='primary' html-type='submit' block>
                <SpinOrText v-model='loading'>Sign in</SpinOrText>
              </a-button>
            </a-form-item>
            <div>
              <small class="text-center d-block mb-0">
                <nuxt-link to='/forgot-password'>Forgot my password</nuxt-link>
              </small>
              <hr>
              <small class='text-center d-block mb-0'>
                Don't have an account?
              </small>
              <small class='text-center d-block'>
                <nuxt-link to='/sign-up'>Sign Up</nuxt-link>
              </small>
            </div>
          </a-form>
        </a-card>
      </a-col>
    </a-row>
    <RequestModal ref='rmodal'></RequestModal>
  </div>
</template>

<script>
import RequestModal from '~/components/RequestModal'
import SpinOrText from '~/components/SpinOrText'

export default {
  components: {
    RequestModal,
    SpinOrText
  },
  middleware: ['unauthenticated'],
  data() {
    return {
      formLayout: 'horizontal',
      form: this.$form.createForm(this, { name: 'coordinated' }),
      loading: false
    }
  },
  methods: {
    handleSubmit(e) {
      e.preventDefault()
      this.form.validateFields(async (err, values) => {
          if (!err) {
            this.loading = true
            try {
              await this.$auth
                .loginWith('local', {
                  data: {
                    email: values.email,
                    password: values.password
                  }
                })
                .then(() => {
                  // this.$refs.requests_dialog.onSuccess('Cuenta creada!')
                  console.log('Success')
                })
                .catch((e) => {
                  console.log('catch in loginWith: ', e)
                  this.$refs.rmodal.$emit('error', e)
                }).finally(()=>{
                  this.loading = false
                })
            } catch (e) {
              this.$refs.rmodal.$emit('error', e)
            }finally {
              this.loading = false
            }
          }
        }
      )
    },
    handleSelectChange(value) {
      console.log(value)
      this.form.setFieldsValue({
        note: `Hi, ${value === 'male' ? 'man' : 'lady'}!`
      })
    }
  }
}
</script>
