<template>
  <div>
    <a-row>
      <a-col class='mt-1' :xs='{span: 20, offset: 2}' :md='{span: 16, offset: 4}'>
        <a-card>
          <h1 class='h1 text-center'>Change my password</h1>
          <a-form :form='form' size='small' @submit='handleSubmit'>
            <a-form-item label='Old password'>
              <a-input v-decorator="
              [
                'old_password',
                {
                rules: [
                  {required: true, message: 'Password is required!'},
                  {min: 6, message: 'Enter at least 6 characters'}
                ]
                }
              ]" placeholder='New password' type='password'>
                <a-icon slot='prefix' type='lock' style='color:rgba(0,0,0,.25)' />
              </a-input>
            </a-form-item>
            <a-row>
              <a-col :xs="12" :sm="12" :md="12">
                <a-form-item label='New password'>
                  <a-input v-decorator="
              [
                'new_password',
                {
                rules: [
                  {required: true, message: 'Password is required!'},
                  {min: 6, message: 'Enter at least 6 characters'}
                ]
                }
              ]" placeholder='New password' type='password'>
                    <a-icon slot='prefix' type='lock' style='color:rgba(0,0,0,.25)' />
                  </a-input>
                </a-form-item>
              </a-col>
              <a-col :xs="12" :sm="12" :md="12">
                <a-form-item label='Confirm your new password'>
                  <a-input v-decorator="
              [
                'confirm_new_password',
                {
                rules: [
                  {required: true, message: 'Password is required!'},
                  {min: 6, message: 'Enter at least 6 characters'}
                ]
                }
              ]" placeholder='Confirm your new password' type='password'>
                    <a-icon slot='prefix' type='lock' style='color:rgba(0,0,0,.25)' />
                  </a-input>
                </a-form-item>
              </a-col>
            </a-row>
            <a-form-item>
              <a-button type='primary' html-type='submit' block>
                <SpinOrText v-model='loading'>Change my password</SpinOrText>
              </a-button>
            </a-form-item>
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
  middleware: ['authenticated'],
  data() {
    return {
      formLayout: 'horizontal',
      form: this.$form.createForm(this, { name: 'coordinated' }),
      loading: false
    }
  },
  head() {
    return {
      title: 'Change my password',
    }
  },
  methods: {
    handleSubmit(e) {
      e.preventDefault()
      this.form.validateFields( (err, values) => {
          if (!err) {
            this.loading = true
            this.$api.post('/user/change-password', {
              old_password: values.old_password,
              password: values.new_password,
              confirm_password: values.confirm_new_password,
            }).then(()=>{
              this.$router.push('/password-updated')
            }).catch((e)=>{
              this.$refs.rmodal.$emit('error', e)
            }).finally(()=>{
              this.loading = false
            })
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
