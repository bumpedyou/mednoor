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
            <a-form-item label='Date of birth (MM-DD-YYYY)'>
              <a-input v-model='date' placeholder='MM-DD-YYYY'>
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
  middleware: ['unauthenticated'],
  data() {
    return {
      formLayout: 'horizontal',
      form: this.$form.createForm(this, { name: 'coordinated' }),
      loading: false,
      date: '',
      day: '',
      month: '',
      year: '',
    }
  },
  watch: {
    date(v){
      // Auto format date into mm-dd-yyyy

      const allowed = ['0','1','2','3','4','5','6','7','8','9']
      let str = ''
      for (let i = 0; i<v.length; i++){
        if ((v.charAt(i) === '/' || v.charAt(i) === '-') && (i === 2 || i === 5 )){
          str+= v.charAt(i)
        }else if (allowed.includes(v.charAt(i))){
          str+= v.charAt(i)
        }
      }
      const lastChar = v.charAt(v.length-1)
      if (str.length ===  1 && !allowed.includes(lastChar)){
        str = '0' + str + '/'
      }

      if (str.length ===  4 && !allowed.includes(lastChar)){
        const last = str.charAt(str.length-1)
        const x = str.substr(0,3)
        str = x + '0' + last + '/'
      }

      if (str.length > 3){
        str = str.split('');
        str[2] = '/';
        str = str.join('');
      }
      if (str.length > 5){
        str = str.split('');
        str[5] = '/';
        str = str.join('');
      }
      if (str.length >= 10){
        str = str.substr(0, 10)
        const dateParts = str.split('/')
        if (dateParts.length === 3){
          // MM-DD-YYYY
          this.month = dateParts[0]
          this.day = dateParts[1]
          this.year = dateParts[2]
          let err = null

          if (this.month < 1){
            err = 'The month cannot be zero'
          }else if (this.month > 12){
            err = 'The month cannot be greater than twelve'
          }

          if (this.day < 1){
            err = 'The day cannot be zero'
          }else if (this.day > 31) {
            err = 'The day cannot be greater than 31'
          }

          const currentYear = new Date().getFullYear()
          if (this.year <= (currentYear-100)){
            err = 'The year cannot be more than 100 years away from ' + currentYear
          }else if (this.year > currentYear){
            err = 'The year cannot be later than ' + currentYear
          }

          if (err){
            this.$refs.rmodal.$emit('error', err)
          }

        }
      }
      this.date = str
    }
  },
  methods: {
    onChange(e) {
    },
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
                    // redirect
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
