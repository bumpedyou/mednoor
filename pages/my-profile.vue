<template>
<div class="mh-100v">
  <a-row class="pa-1">
    <a-col :xs="24" :sm="24">
      <div>
        <p class="h3 mb-1"  style="display: flex; align-items: center">
          {{$t('hi')}}, {{name}} <span v-if="!isUser && userRole !== 'guest'" class="user-role ml-1">
       {{$t('your_role')}}:
        <b class="b-white">{{userRoleTxt}}</b>
      </span></p>
      </div>
      <div>
        <a-tabs default-active-key="1">
          <a-tab-pane key="1" tab="Personal Informatino">
            <a-form layout='vertical'  :form="form" size="small" @submit="handleSubmit">
              <a-form-item
                v-model="first_name"
                :label="$t('fn')"
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
                            message: $t('v.fn_req')
                          },
                          { min: 3, message: $t('v.min_3') },
                          {
                            max: 30,
                            message: $t('v.max_30')
                          }
                        ]
                      }
                    ]"
                  :placeholder="$t('fn')"
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
                :label="$t('ln')"
              >
                <a-input
                  v-decorator="[
                      'last_name',
                      {
                        initialValue: last_name,
                        rules: [
                          {
                            required: true,
                            message: $t('v.ln_req')
                          },
                          { min: 3, message: $t('v.min_3') },
                          {
                            max: 30,
                            message: $t('v.max_30')
                          }
                        ],
                      }
                    ]"
                  :placeholder="$t('ln')"
                >
                  <a-icon
                    slot="prefix"
                    type="user"
                    style="color: rgba(0, 0, 0, 0.25)"
                  />
                </a-input>
              </a-form-item>
              <a-form-item
                :label="$t('email')"
              >
                <a-input v-model="email" disabled :placeholder="$t('email')"  />
              </a-form-item>
              <a-row>
                <a-col :xs="24" :sm="24" :md="3" :lg="4">
                  <a-form-item
                    label="Area Code"
                  >
                    <a-input v-model="area_code" placeholder="Area Code"  />
                  </a-form-item>
                </a-col>
                <a-col :xs="24" :sm="24" :md="21" :lg="20">
                  <a-form-item
                    label="Phone Number."
                  >
                    <a-input v-model="phone_no"  placeholder="Phone Number." />
                  </a-form-item>
                </a-col>
              </a-row>
              <a-form-item>
                <div class="pull-child-right">
                  <a-button type="primary" html-type="submit">
                    <SpinOrText v-model="loading">
                      {{$t('save_changes')}}
                    </SpinOrText>
                  </a-button>
                </div>
              </a-form-item>
            </a-form>
          </a-tab-pane>
          <a-tab-pane key="2" tab="Password" force-render>
            <a-form-item>
              <p class="h4">
                {{$t('pwd_reset')}}
              </p>
              <hr>
              <div>
                <nuxt-link :to='localePath("change-my-password")'>
                  {{$t('change_pwd')}}
                </nuxt-link>
              </div>
            </a-form-item>
          </a-tab-pane>
          <a-tab-pane v-if="isModerator" key="3" tab="Professional Information" force-render>
            <a-form :form="profForm">
              <a-form-item>
                <a-auto-complete v-model="category" :data-source="categories" placeholder="Enter a category">
                </a-auto-complete>
              </a-form-item>
              <a-form-item>
                <a-form-item>
                  <a-input v-decorator="['npi', {
                  rules: [
                    {required: true, message: 'The NPI is required'},
                    {min: 10, message: $t('v.min_10')},
                    {max: 10, message: $t('v.max_10')},
                  ]
                }]" placeholder="NPI" :max-length="10" disabled></a-input>
                </a-form-item>
              </a-form-item>
              <a-form-item>
                <a-button type="primary">Save</a-button>
              </a-form-item>
            </a-form>
          </a-tab-pane>

        </a-tabs>
      </div>


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
      profForm: this.$form.createForm(this),
      loading: false,
      category: null,
      npi: '',
      categories: [],
      area_code: '',
      phone_no: '',
      allowed: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
    }
  },
  head() {
    return {
      title: this.$t('my_profile'),
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
  watch: {
    area_code(v){
      if (v){
        this.area_code = v.substr(5)
      }
    },
    phone_no (v){
      if (v){
        this.phone_no = v.substr(0,15)
      }
    }
  },
  mounted() {
    console.log('Mounted', this.isModerator)
    if (this.isModerator){

      this.$api.get('/category').then(({data})=>{
        if (data){
          this.categories = data.map((c)=>{
            return {
              value: c.cate_id.toString(),
              text: c.cate_category,
            }
          })
          this.$api.get('/professional/my-record').then(({data})=>{
            console.log('----->', data)
            if (data){
              this.category = data.profe_cate_id.toString()
              this.profForm.setFieldsValue({
                npi: data.profe_npi,
              })
            }
          })
        }
      }).catch(()=>{
        this.$toast.error('Failed to load categories.')
      })
    }
  },
  methods: {
    handleSubmit(e){
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          this.loading = true
          this.$api
            .put('/user', values)
            .then(async () => {
              await this.$auth.fetchUser()
              this.$toast.success(this.$t('updated_suc').toString());
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
