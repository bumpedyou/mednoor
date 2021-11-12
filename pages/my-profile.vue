<template>
<div class="mh-100v">
  <a-row class="pa-1">
    <a-col :xs="24" :sm="24" :md="{span: 12, offset: 6}" :lg="{span: 8, offset: 8}">
      <div>
        <p class="h3 mb-1"  style="display: flex; align-items: center">
        Hi, {{name}} <span v-if="!isUser && userRole !== 'guest'" class="user-role ml-1">
        Your Role:
        <b class="b-white">{{userRoleTxt}}</b>
      </span></p>
      </div>
      <p class="h4">Your Information</p>
      <hr>
      <a-form layout='vertical'  :form="form" size="small" @submit="handleSubmit">
        <a-form-item
          v-model="first_name"
          label="First Name"
          rules="required"
        >
                  <a-input
                    v-decorator="[
                      'first_name',
                      {
                        initialValue: first_name,
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
        <a-form-item
          v-model="last_name"
          label="Last name"
        >
          <a-input
                    v-decorator="[
                      'last_name',
                      {
                        initialValue: last_name,
                        rules: [
                          {
                            required: true,
                            message: 'Last Name is required!'
                          },
                          { min: 3, message: 'Enter at least 3 characters' },
                          {
                            max: 30,
                            message: 'Enter a maximum of 30 characters'
                          }
                        ],
                      }
                    ]"
                    placeholder="Last name"
                    
                  >
                    <a-icon
                      slot="prefix"
                      type="user"
                      style="color: rgba(0, 0, 0, 0.25)"
                    />
                  </a-input>
        </a-form-item>
        <a-form-item
          label="Email"
        >
          <a-input v-model="email" disabled placeholder="Email"  />
        </a-form-item>    
        <a-form-item>
      <p class="h4">
        Password reset
      </p>
      <hr>
      <div>
        <nuxt-link to="/change-my-password">
          Change my password
        </nuxt-link>
      </div>
        </a-form-item>
        <a-form-item>
          <div class="pull-child-right">
            <a-button type="primary" html-type="submit">
              <SpinOrText v-model="loading">
                Save Changes
              </SpinOrText>
            </a-button>
          </div>
        </a-form-item>   
      </a-form>
    </a-col>
  </a-row>

</div>
</template>

<script>
import userRoleMixin from "~/mixins/userRoleMixin";
import SpinOrText from '~/components/SpinOrText.vue'

export default {
  name: "MyProfile",
  components: {
    SpinOrText
  },
  mixins: [userRoleMixin],
  middleware: ['authenticated', 'not-blocked', 'not-deleted', 'verified'],
  data (){
    return {
      form: this.$form.createForm(this, { name: 'coordinated' }),
      loading: false,
    }
  },
  head() {
    return {
      title: 'My Profile',
    }
  },
  computed: {
    user() {
      return this.$auth.user
    },
    first_name(){
      return this.user.user_first_name
    },
    last_name(){
      return this.user.last_name
    },
    name (){
      return this.user.user_first_name + ' ' + this.user.last_name
    },
    email (){
      return this.user.email
    }
  },
  methods: {
    handleSubmit(e){
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          this.loading = true
          console.log('Put user with data ', values)
          this.$api
            .put('/user', values)
            .then(async () => {
              await this.$auth.fetchUser()
              this.$message.success('Updated successfully!');
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

<style scoped lang="sass">
  .user-role
    background-color: #444
    color: #fff
    border: 0
    border-radius: 0
    padding: 0.2rem 0.5rem
    display: inline-block
    text-transform: capitalize
    font-size: 15px !important
</style>
