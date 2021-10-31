<template>
  <div>
    <a-row>
      <a-col class='mt-1' :xs='{span: 20, offset: 2}' :md='{span: 12, offset: 6}' :lg='{span: 10, offset: 7}' :xl='{span: 8, offset: 8}'>
        <a-card>
          <h1 class='h1 text-center'>Sign up</h1>
          <a-form :form='form' size='small' @submit='handleSubmit'>
            <a-form-item label='Email' >
              <a-input
                v-decorator="[
            'email',
            {
              rules: [{ required: true, message: 'Email is required!' },
              {max: 100, message: 'Max email length is 150'},
              {type: 'email', message: 'Enter a valid email'}
              ],
            },
          ]"
                placeholder='Email'
              />
            </a-form-item>
            <a-row>
              <a-col :xs='{span: 24}' :md='{span: 11}'>
                <a-form-item label='First Name'>
                  <a-input v-decorator="
              [
                'first_name',
                {
                rules: [{required: true, message: 'First Name is required!'},
                {min: 3, message: 'Enter at least 3 characters'},
                {max: 30, message: 'Enter a maximum of 30 characters'}],
                }
              ]" placeholder='First Name'>
                    <a-icon slot='prefix' type='user' style='color:rgba(0,0,0,.25)' />
                  </a-input>
                </a-form-item>
              </a-col>
              <a-col :xs='{span: 24}' :md='{span: 11, offset: 2}'>
                <a-form-item label='Last Name'>
                  <a-input v-decorator="
              [
                'last_name',
                {
                rules: [
                  {required: true, message: 'Last Name is required!'},
                  {min: 3, message: 'Enter at least 3 characters'},
                  {max: 30, message: 'Enter a maximum of 30 characters'}
                  ]
                }
              ]" placeholder='Last Name'>
                    <a-icon slot='prefix' type='user' style='color:rgba(0,0,0,.25)' />
                  </a-input>
                </a-form-item>
              </a-col>
            </a-row>
            <a-form-item label='Date of birth'>
              <a-input v-model='date' placeholder='YYYY-MM-DD' @blur='checkDOB'>
                <a-icon slot='prefix' type='calendar' style='color:rgba(0,0,0,.25)' />
              </a-input>
            </a-form-item>
            <a-row>
              <a-col :xs='{span: 24}' :md='{span: 11}'>
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
              <a-col :xs='{span: 24}' :md='{span: 11, offset: 2}'>
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
            <a-form-item>
              <a-button type='primary' html-type='submit' block>
                <SpinOrText v-model='loading'>Sign up</SpinOrText>
              </a-button>
            </a-form-item>
            <div>
              <hr>
              <small class='text-center d-block mb-0'>
                Already have an account?
              </small>
              <small class='text-center d-block'>
                <nuxt-link to='/sign-in'>Sign In</nuxt-link>
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
export default {
  components: {
    RequestModal,
  },
  data() {
    return {
      formLayout: 'horizontal',
      form: this.$form.createForm(this, { name: 'coordinated' }),
      loading: false,
      date: '',
    }
  },
  watch: {
    date(v){
      // Auto format date into YYYY-MM-DD
      const allowed = ['0','1','2','3','4','5','6','7','8','9']
      let str = ''
      for (let i = 0; i<v.length; i++){
        if ((v.charAt(i) === '/' || v.charAt(i) === '-') && (i === 4 || i === 7 || i === 6 )){
          str+= v.charAt(i)
        }else if (allowed.includes(v.charAt(i))){
          str+= v.charAt(i)
        }
      }
      if (str.length > 4){
        str = str.split('');
        str[4] = '-';
        str = str.join('');
      }
      if (str.length === 7){
        if (!allowed.includes(str.charAt(6))){
          console.log('Not a number, append 0')
          str = str.substr(0,5) + '0' + str.substr(5,1)
        }
      }
      if (str.length > 7){
        str = str.split('');
        str[7] = '-';
        str = str.join('');
      }
      if (str.length > 10){
        str = str.substr(0, 10)
      }
      this.date = str
    }
  },
  methods: {
    checkDOB(){
      console.log(this.date)
      if (this.date.length === 9){
        this.date = this.date.substr(0,8) + '0' + this.date.substr(8,1)
      }
    },
    onChange(e) {
    },
    handleSubmit(e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          this.loading = true
          values.dob = this.date
          this.$api
            .post('/user', values)
            .then(async ({ data }) => {
              console.log('Then')
              try {
                await this.$auth
                  .loginWith('local', {
                    data: {
                      email: values.email,
                      password: values.password,
                    },
                  })
                  .then(() => {
                    // this.$refs.requests_dialog.onSuccess('Cuenta creada!')
                  })
                  .catch((e) => {
                    console.log('catch in loginWith: ' , e)
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
