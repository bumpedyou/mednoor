<template>
<div class="pa-1">
  <a-row class="mb-1">
      <a-col>
            <a-breadcrumb>
            <a-breadcrumb-item><nuxt-link to="/dashboard">Dashboard</nuxt-link></a-breadcrumb-item>
          <a-breadcrumb-item><nuxt-link to="/users-list">List of users</nuxt-link></a-breadcrumb-item>
          <a-breadcrumb-item>Add user</a-breadcrumb-item>
        </a-breadcrumb>
      </a-col>
    </a-row>
  <a-row class='pa-1 mh-100v'>
  <a-col         :xs="{ span: 20, offset: 2 }"
        :md="{ span: 12, offset: 6 }"
        :lg="{ span: 10, offset: 7 }"
        :xl="{ span: 8, offset: 8 }">
    
    <p class='h1 text-center'>Add User</p>
    <a-form :form='form' size='small' @submit='handleSubmit'>
      <a-form-item >
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
          <a-form-item>
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
          <a-form-item>
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
      <a-form-item>
        <a-input v-model='date' placeholder='MM-DD-YYYY'>
          <a-icon slot='prefix' type='calendar' style='color:rgba(0,0,0,.25)' />
        </a-input>
      </a-form-item>
      <a-row>
        <a-col :xs='{span: 24}' :md='{span: 11}'>
          <a-form-item>
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
          <a-form-item>
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
          <SpinOrText v-model='loading'>Add User</SpinOrText>
        </a-button>
      </a-form-item>
    </a-form>
  </a-col>
  <RequestModal ref='rmodal'></RequestModal>
</a-row>
</div>
</template>

<script>
import SpinOrText from '~/components/SpinOrText'
import formMixin from '~/mixins/formMixin'
import RequestModal from '~/components/RequestModal'
export default {
  name: 'AddUser',
  components: {
    SpinOrText,
    RequestModal
  },
  mixins: [formMixin],
  layout: 'dashboard',
  middleware: ['authenticated', 'not-blocked', 'not-deleted'],
  data: ()=>({
    loading: false,
  }),
    head() {
    return {
      title: 'Add User',
      meta: [
        // hid is used as unique identifier. Do not use `vmid` for it as it will not work
        {
          hid: 'description',
          name: 'description',
          content: 'Add a user to mednoor'
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
            .then(() => {
              this.$router.push('/users-list')
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
  }
}
</script>

<style scoped>

</style>
