<template>
  <div>
      <a-row>
          <a-col class="pa-1 mt-3" :xs="24" :sm="24" :md="{span: 20, offset: 2}" :lg="{span: 16, offset: 4}">
        <a-card>
          <h1 class="h1 text-center">Sign up</h1>
          <a-form :form="form" size="small" @submit="handleSubmit">
            <a-form-item>
              <a-input
                v-decorator="[
                  'email',
                  {
                    rules: [
                      { required: true, message: 'Email is required!' },
                      { max: 100, message: 'Max email length is 150' },
                      { type: 'email', message: 'Enter a valid email' }
                    ]
                  }
                ]"
                placeholder="Email"
              />
            </a-form-item>
            <a-row>
              <a-col :xs="{ span: 24 }" :md="{ span: 11 }">
                <a-form-item>
                  <a-input
                    v-decorator="[
                      'first_name',
                      {
                        rules: [
                          {
                            required: true,
                            message: 'First Name is required!'
                          },
                          { min: 3, message: 'Enter at least 3 characters' },
                          {
                            max: 30,
                            message: 'Enter a maximum of 30 characters'
                          }
                        ]
                      }
                    ]"
                    placeholder="First Name"
                  >
                    <a-icon
                      slot="prefix"
                      type="user"
                      style="color: rgba(0, 0, 0, 0.25)"
                    />
                  </a-input>
                </a-form-item>
              </a-col>
              <a-col :xs="{ span: 24 }" :md="{ span: 11, offset: 2 }">
                <a-form-item>
                  <a-input
                    v-decorator="[
                      'last_name',
                      {
                        rules: [
                          { required: true, message: 'Last Name is required!' },
                          { min: 3, message: 'Enter at least 3 characters' },
                          {
                            max: 30,
                            message: 'Enter a maximum of 30 characters'
                          }
                        ]
                      }
                    ]"
                    placeholder="Last Name"
                  >
                    <a-icon
                      slot="prefix"
                      type="user"
                      style="color: rgba(0, 0, 0, 0.25)"
                    />
                  </a-input>
                </a-form-item>
              </a-col>
            </a-row>
            <a-form-item>
              <a-input v-model="date" placeholder="MM-DD-YYYY">
                <a-icon
                  slot="prefix"
                  type="calendar"
                  style="color: rgba(0, 0, 0, 0.25)"
                />
              </a-input>
            </a-form-item>
            <a-row>
              <a-col :xs="{ span: 24 }" :md="{ span: 11 }">
                <a-form-item>
                  <a-input
                    v-decorator="[
                      'password',
                      {
                        rules: [
                          { required: true, message: 'Password is required!' },
                          { min: 6, message: 'Enter at least 6 characters' }
                        ]
                      }
                    ]"
                    placeholder="Password"
                    type="password"
                  >
                    <a-icon
                      slot="prefix"
                      type="lock"
                      style="color: rgba(0, 0, 0, 0.25)"
                    />
                  </a-input>
                </a-form-item>
              </a-col>
              <a-col :xs="{ span: 24 }" :md="{ span: 11, offset: 2 }">
                <a-form-item>
                  <a-input
                    v-decorator="[
                      'confirm_password',
                      {
                        rules: [
                          {
                            required: true,
                            message: 'Confirm password is required!'
                          },
                          { min: 6, message: 'Enter at least 6 characters' }
                        ]
                      }
                    ]"
                    placeholder="Confirm password"
                    type="password"
                  >
                    <a-icon
                      slot="prefix"
                      type="lock"
                      style="color: rgba(0, 0, 0, 0.25)"
                    />
                  </a-input>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <a-form-item>
                  <a-checkbox v-decorator="[
                      'terms_conditions',
                      {
                        rules: [
             
                          {
                            required: true,
                            message: 'You must agree to the terms and conditions.'
                          },
                        ]
                      }
                    ]">
                      <small>I Agree to the</small>
                    </a-checkbox>
                  <small>
                    <a to="terms-and-conditions" href="/terms-and-conditions" target="_blank">Terms and conditions</a>
                    &
                    <a to="terms-and-conditions" href="/privacy-policy" target="_blank">Privacy</a>
                  </small>
              </a-form-item>
            </a-row>
            <a-form-item>
              <a-button type="primary" html-type="submit" block>
                <SpinOrText v-model="loading">Sign up</SpinOrText>
              </a-button>
            </a-form-item>
            <div>
              <hr />
              <small class="text-center d-block mb-0">
                Already have an account?
              </small>
              <small class="text-center d-block">
                <nuxt-link to="/sign-in">Sign In</nuxt-link>
              </small>
            </div>
          </a-form>
        </a-card>
      </a-col>
    </a-row>
    <RequestModal ref="rmodal"></RequestModal>
  </div>
</template>

<script>
import RequestModal from '~/components/RequestModal'
import SpinOrText from '~/components/SpinOrText'
import formMixin from '~/mixins/formMixin'
export default {
  components: {
    RequestModal,
    SpinOrText
  },
  mixins: [formMixin],
  layout: 'home',
  middleware: ['unauthenticated'],
  data() {
    return {
      // form: this.$form.createForm(this, { name: 'coordinated' }),
      loading: false
    }
  },
  head() {
    return {
      title: 'Sign Up',
      meta: [
        // hid is used as unique identifier. Do not use `vmid` for it as it will not work
        {
          hid: 'description',
          name: 'description',
          content: 'Sign up to our Online Medical Center'
        }
      ]
    }
  },
  methods: {
    handleSubmit(e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          this.loading = true
          // date --->
          values.dob = [this.year, this.month, this.day].join('-')
          this.$api
            .post('/user', values)
            .then(async ({ data }) => {
              try {
                await this.$auth
                  .loginWith('local', {
                    data: {
                      email: values.email,
                      password: values.password
                    }
                  })
                  .then(() => {
                    // redirect
                  })
                  .catch((e) => {
                    this.$refs.rmodal.$emit('error', e)
                  })
              } catch (e) { 
                this.$refs.rmodal.$emit('error', e)
              }
            })
            .catch((e) => {
              this.$refs.rmodal.$emit('error', e)
            })
            .finally(() => {
              this.loading = false
            })
        }
      })
    }
  }
}
</script>
