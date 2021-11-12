<template>
  <div>
    <a-row>
      <a-col v-if="!isSmall" :xs="24" :sm="24" :md="12">
        <BackgroundItem :file="file" source="api"  height="calc(100vh - 50px)"></BackgroundItem>
      </a-col>
      <a-col :xs="24" :sm="24" :md="12">
        <a-row>
          <a-col class="pa-1 mt-3" :xs="24" :sm="24" :md="{span: 20, offset: 2}" :lg="{span: 16, offset: 4}">
            <a-card>
              <div class="mednoor-heading-svg">
                <img :src='require("~/static/light.svg")' width="50px" />
                <div>
                <p class='h3 text-center'>
                  Mednoor Medical Center
                </p>
                <small class="h5 fw-b text-center d-block">
                  Always Open
                </small>
                </div>
              </div>
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

      </a-col>
    </a-row>
    <RequestModal ref='rmodal'></RequestModal>
  </div>
</template>

<script>
import RequestModal from '~/components/RequestModal'
import SpinOrText from '~/components/SpinOrText'
import breakpoints from '~/mixins/breakpoints'

export default {
  components: {
    RequestModal,
    SpinOrText
  },
  mixins: [breakpoints],
  middleware: ['unauthenticated'],
  data() {
    return {
      formLayout: 'horizontal',
      form: this.$form.createForm(this, { name: 'coordinated' }),
      loading: false,
      file: '',
    }
  },
  head() {
    return {
      title: 'Sign In',
      meta: [
        // hid is used as unique identifier. Do not use `vmid` for it as it will not work
        {
          hid: 'description',
          name: 'description',
          content: 'Sign in to you Mednoor account.'
        }
      ]
    }
  },
  created(){
    this.$api.get('/home-screen').then(({data})=>{
      if (data && data.screen && data.screen.hosc_file){
        this.file = 'hs/' + data.screen.hosc_file
        console.log('File is now', this.file)
      }
    }).catch((e)=>{
      console.log('Failed to get the home scren', e)
    })
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
<style scoped lang="sass">
  .mednoor-heading-svg
    display: flex
    justify-content: center
    align-itmes: center
    background: #FFFBF1
    margin-bottom: 9px
    img
      margin-right: 6px
</style>
