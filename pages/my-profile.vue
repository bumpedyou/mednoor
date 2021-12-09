<template>
<div class="mh-100v">
  <a-row v-if='loadingPage'>
    <a-col cols='12'>
      <a-skeleton></a-skeleton>
    </a-col>
  </a-row>
  <a-row v-else class="pa-1">
    <a-col :xs="24" :sm="24">
      <div>
        <p class="h4 mb-1"  style="display: flex; align-items: center">
          {{$t('hi')}}, {{name}} <span v-if="!isUser && userRole !== 'guest'" class="user-role ml-1">
       {{$t('your_role')}}:
        <b class="b-white">{{userRoleTxt}}</b>
      </span></p>
      </div>
      <div>

        <a-tabs v-if='showTabs' :default-active-key="tab.toString()">
          <a-tab-pane key="1" tab="Personal Information">
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
                    label="Country code"
                  >
                    <a-input v-model="country_code" placeholder="Country code" />
                  </a-form-item>
                </a-col>
                <a-col :xs="24" :sm="24" :md="21" :lg="20">
                  <a-form-item
                    label="Phone Number"
                  >
                    <a-input v-model="phone_no"  placeholder="Phone Number." />
                  </a-form-item>
                </a-col>
              </a-row>
              <a-form-item>
                <div class="pull-child-left">
                  <a-button type="primary" html-type="submit">
                    <SpinOrText v-model="loading">
                      {{$t('save_changes')}}
                    </SpinOrText>
                  </a-button>
                </div>
              </a-form-item>
            </a-form>
          </a-tab-pane>
          <a-tab-pane key="2" tab="Security" force-render>
            <a-form-item>
              <p class="h4">
                {{$t('pwd_reset')}}
              </p>
              <div>
                <nuxt-link :to='localePath("change-my-password")'>
                  {{$t('change_pwd')}}
                </nuxt-link>
              </div>
            </a-form-item>
            <hr>
            <a-form-item v-if="isModerator">
              <p class="h4">
                PIN
              </p>
              <div>
                <nuxt-link :to='localePath("change-my-pin")'>
                  Change my PIN
                </nuxt-link>
              </div>
            </a-form-item>
          </a-tab-pane>
          <a-tab-pane v-if="isProfessional" key="3" tab="Professional Information" force-render>
            {{isComplete}}
            <div v-if='!isComplete'>
              <a-alert message='Please complete your profile information' :show-icon='true' type='warning' :banner='true'></a-alert>
            </div>
            <a-form :form="profForm" @submit.prevent='saveProfessional'>
              <a-row>
                <a-col :md='12'>
                  <a-form-item label='Category'>
                    <a-auto-complete v-model="category" :data-source="categories" placeholder="Enter a category">
                    </a-auto-complete>
                  </a-form-item>
                </a-col>
                <a-col :md='12'>
                  <a-form-item v-if='isProfessional'>
                    <a-form-item label='NPI'>
                      <a-input v-decorator="['npi', {
                  rules: [
                    {required: true, message: 'The NPI is required'},
                    {min: 10, message: $t('v.min_10')},
                    {max: 10, message: $t('v.max_10')},
                  ]
                }]" placeholder="NPI" :max-length="10"></a-input>
                    </a-form-item>
                  </a-form-item>
                </a-col>
              </a-row>
              <a-row>
                <a-col :md='12'>
                  <a-form-item label='Specialty'>
                    <a-input v-decorator="['specialty', {
                  rules: [
                    {required: true, message: 'The specialty is required'},
                    {min: 1, message: 'Enter at least 1 character'},
                    {max: 60, message: 'Enter a maximum of 60 characters'},
                  ]
                }]" placeholder='Specialty'></a-input>
                  </a-form-item>
                </a-col>
                <a-col :md='12'>
                  <a-form-item label='Practice Name'>
                    <a-input v-decorator="['practice_name', {
                  rules: [
                    {required: true, message: 'The practice name is required'},
                    {min: 1, message: 'Enter at least 1 character'},
                    {max: 60, message: 'Enter a maximum of 60 characters'},
                  ]
                }]" placeholder='Practice Name'></a-input>
                  </a-form-item>
                </a-col>
              </a-row>
              <a-row>
                <a-col :md='12' :lg='8'>
                  <a-form-item label='Medical License'>
                    <a-input v-decorator="['medical_license', {
                  rules: [
                    {required: true, message: 'The Medical license is required'},
                    {min: 3, message: 'Enter at least 3 characters'},
                    {max: 12, message: 'Enter a maximum of 12 characters'},
                  ]
                }]" placeholder='Medical License'></a-input>
                  </a-form-item>
                </a-col>
                <a-col :md='12' :lg='8'>
                  <a-form-item label='License State'>
                    <a-input v-decorator="['license_state', {
                  rules: [
                    {required: true, message: 'The License state name is required'},
                    {min: 2, message: 'Enter at least 2 characters'},
                    {max: 30, message: 'Enter a maximum of 30 characters'},
                  ]
                }]" placeholder='License State.'></a-input>
                  </a-form-item>
                </a-col>
                <a-col :md='12' :lg='8'>
                  <a-form-item label='Credentials'>
                    <a-input v-decorator="['credentials', {
                  rules: [
                    {required: true, message: 'The credentials are required.'},
                    {min: 2, message: 'Enter at least 2 characters'},
                    {max: 30, message: 'Enter a maximum of 30 characters'},
                  ]
                }]" placeholder='Credentials'></a-input>
                  </a-form-item>
                </a-col>
              </a-row>
              <a-form-item>
                <a-button type="primary" html-type='submit'>
                  <SpinOrText v-model='loadingSaveP'>
                    {{$t('save_changes')}}
                  </SpinOrText>
                </a-button>
              </a-form-item>
            </a-form>
          </a-tab-pane>
        </a-tabs>
      </div>
    </a-col>
  </a-row>
  <request-modal ref='rmodal'></request-modal>
</div>
</template>

<script>
import userRoleMixin from "~/mixins/userRoleMixin";
import SpinOrText from '~/components/SpinOrText.vue'
import inputMixin from '~/mixins/inputMixin'
import authMixin from '~/mixins/authMixin'
import RequestModal from '~/components/RequestModal'

export default {
  name: "MyProfile",
  components: {
    SpinOrText,
    RequestModal,
  },
  mixins: [userRoleMixin, inputMixin, authMixin],
  middleware: ['authenticated', 'not-blocked', 'not-deleted', 'verified'],
  data (){
    return {
      showTabs: true,
      isComplete: false,
      tab: 1,
      form: this.$form.createForm(this, { name: 'coordinated' }),
      profForm: null,
      loading: false,
      category: null,
      npi: '',
      categories: [],
      country_code: '',
      phone_no: '',
      loadingSaveP: false,
      loadingPage: true,
      isProfessional: false,
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
    country_code(v){
      let str = ''

      if (v && v.length){

        if (v.length === 1){
          v = this.prependCharacter(v, '+')
        }

        for(let i = 0; i<v.length; i++){
          const char = v.charAt(i)
          if (this.allowed.includes(char) || char === '+' && i === 0){
            str+= char.toString()
          }
        }
        if (str.length > 4){
          str = str.substr(0,4)
        }
        this.country_code = str
      }
    },
    phone_no (v){
      if (v){
        v = v.substr(0,10)
        this.phone_no = this.numbersOnly(v)
      }
    }
  },
  mounted() {
    if (this.myUserId){
      this.$api.get('/user/'+ this.myUserId).then(({data})=>{
        if (data && data.user_uuid){
          this.phone_no = data.user_phone_no
          this.country_code = '+' + data.user_country_code
        }
      })
    }
    this.$api.get('/category').then(({data})=>{
      if (data){
        this.categories = data.map((c)=>{
          return {
            value: c.cate_id.toString(),
            text: c.cate_category,
          }
        })
        this.getMyRecord()
      }
    }).catch(()=>{
      this.$toast.error('Failed to load categories.')
    })

  },
  methods: {
    getMyRecord(){
      this.$api.get('/professional/my-record').then(({data})=>{
        this.loadingPage = false
        if (data){
          this.profForm = this.$form.createForm(this)
          this.isProfessional = true

          this.$nextTick(()=>{

            this.category = data.profe_cate_id.toString()
            console.log(data)

            this.isComplete = data.profe_specialty && data.profe_practice_name && data.profe_medical_license && data.profe_license_state && data.profe_credentials

            if (!this.isComplete) {
              this.showTabs = false
              this.tab = 3
              console.log('Show tabs --> F')
              setTimeout(() =>{
                this.$nextTick(()=>{
                  this.showTabs = true
                })
              }, 100)
            }

            setTimeout(() => {
              this.$nextTick(()=>{
                this.profForm.setFieldsValue({
                  npi: data.profe_npi,
                  specialty: data.profe_specialty,
                  practice_name: data.profe_practice_name,
                  medical_license: data.profe_medical_license,
                  license_state: data.profe_license_state,
                  credentials: data.profe_credentials
                })
              })
            }, 200)

          })
        }
      })
    },
    handleSubmit(e){
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          this.loading = true

          values.country_code = this.country_code
          values.phone_no = this.phone_no

          if (this.country_code.length < 1){
            this.$toast.error('The country code is not valid')
            return false
          }
          if (this.phone_no.length <10){
            this.$toast.error('The phone number must have 10 digits.')
            return false
          }
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
    },
    saveProfessional(e){
      e.preventDefault()
      this.profForm.validateFields((err, values) => {
        if (err) {
          console.log(err)
          return false
        }

        if (!this.category){
          this.$toast.error('Please select a category.')
          return false
        }

        this.loadingSaveP = true
        values.category = this.category
        this.$api.put('/professional', values).then(()=>{
          this.getMyRecord()
          this.$toast.success(this.$t('updated_suc').toString());
        }).catch((e)=>{
          this.$refs.rmodal.$emit('error', e)
        }).finally(() => {
          this.loadingSaveP = false
        })
      })
    },
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
