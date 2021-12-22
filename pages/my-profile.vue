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
          <a-tab-pane key='1' tab='Profile Picture'>
            <div class='profile-upload'>
              <div v-if='showUploadPicture' class='upload-box'>
                <a-upload
                  name="avatar"
                  list-type="picture-card"
                  class="avatar-uploader"
                  :show-upload-list="false"
                  :before-upload="beforeUpload"
                  @change="handleChange"
                >
                  <img v-if="src && !loadingUpload" :src="src" alt="avatar" />
                  <div v-else>
                    <a-icon :type="loadingUpload ? 'loading' : 'plus'" />
                    <div class="ant-upload-text">
                      Upload
                    </div>
                  </div>
                </a-upload>
                <div class='buttons'>
                  <a-button v-if='src && src.length' block type='primary' @click='uploadPicture'>
                    <SpinOrText v-model='loadingUpload'>
                      Save
                    </SpinOrText>
                  </a-button>
                  <a-button block type='danger' @click='cancelUpload' >Cancel</a-button>
                </div>
              </div>
              <div v-else >
                <div>
                  <ProfilePicture :full-name='name' :picture='picture'>
                    <div class='profile-overlay' @click='showUploadPicture = true'>
                      <a-icon type='upload'></a-icon>
                    </div>
                  </ProfilePicture>
                </div>
              </div>
            </div>
          </a-tab-pane>
          <a-tab-pane key="2" tab="Personal Information">
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
              <a-row v-if="isUser">
                <a-col>
                  <hr>
                  <p class="h4">
                    Address
                  </p>
                  <UserAddress :form="form"></UserAddress>
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
          <a-tab-pane key="3" tab="Security" force-render>
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
          <a-tab-pane v-if="isProfessional" key="4" tab="Professional Information" force-render>
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
              <hr class="mb-1">
              <p class="mb-1 h4">
                Practice Address
              </p>
              <UserAddress ref="profAddr" :form="profForm"></UserAddress>
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
import ProfilePicture from '~/components/ProfilePicture'
import uploadMixin from '~/mixins/uploadMixin'
import UserAddress from "~/components/UserAddress";

export default {
  name: "MyProfile",
  components: {
    UserAddress,
    ProfilePicture,
    SpinOrText,
    RequestModal,
  },
  mixins: [userRoleMixin, inputMixin, authMixin, uploadMixin],
  middleware: ['authenticated', 'not-blocked', 'not-deleted', 'verified', 'view-set'],
  data (){
    return {
      picture: '',
      file: null,
      showTabs: true,
      isComplete: false,
      tab: 1,
      form: this.$form.createForm(this, { name: 'user-data-form' }),
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
      loadingUpload: false,
      imageUrl: '',
      showUploadPicture: false,
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
    zip(v){
      if (v){
        this.zip = this.numbersOnly(v)
      }
    },
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
    console.log('[MyProfile] Mounted')
    if (this.myUserId){
      this.$api.get('/user/'+ this.myUserId).then(({data})=>{
        if (data && data.user_uuid){
          this.phone_no = data.user_phone_no
          this.country_code = '+' + data.user_country_code
          this.picture = data.user_picture
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
    uploadPicture(){
      this.loadingUpload = true
      const data = new FormData()

      data.append('file', this.file)

      this.$api.post('/user/picture', data).then(({data})=>{
        this.$toast.success('Your profile picture has been updated.')
        this.src = ''
        this.showUploadPicture = false
        this.$auth.fetchUser()

        this.picture = data.file

      }).catch((err)=>{
        this.$refs.rmodal.$emit('error',err)
      }).finally(() => {
        this.loadingUpload = false
      })

    },
    cancelUpload(){
      if (!this.loadingUpload){
        this.src = ''
        this.showUploadPicture = false
      }
    },
    handleChange(info) {
      if (info && info.file){
        this.getSrcInfo(info)
        this.file = info.file.originFileObj
      }
    },
    handleUpload() {
      const { fileList } = this
      const formData = new FormData()
      fileList.forEach(file => {
        formData.append('file', file)
      })
      formData.append('type', this.type)
      this.loadingUpload = true
      this.$api.post(this.computedAction, formData, {
        onUploadProgress: (evt) => {
          this.onProgress(evt)
        }
      }).then(() => {
        this.fileList = []
        this.$message.success(this.$t('upl_succ').toString())
        setTimeout(() => {
          this.handleRemove()
          this.umUploadProgress = 0
        }, 1000)

      }).catch(() => {
        this.$message.error(this.$t('upl_fail').toString())
      }).finally(() => {
        this.loadingUpload = false
      })
    },
    beforeUpload(file) {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
      if (!isJpgOrPng) {
        this.$message.error('You can only upload JPG file!');
      }
      const isLt2M = file.size / 1024 / 1024 < 6;
      if (!isLt2M) {
        this.$message.error('Image must smaller than 6MB!');
      }
      return isJpgOrPng && isLt2M;
    },
    getMyRecord(){
      this.$api.get('/professional/my-record').then(({data})=>{
        this.loadingPage = false
        console.log('[MyProfile] loadingPage set to false')
        if (data){
          this.profForm = this.$form.createForm(this)
          this.isProfessional = this.isModerator

          this.$nextTick(()=>{

            this.category = data.profe_cate_id.toString()
            this.isComplete = data.profe_specialty && data.profe_practice_name && data.profe_medical_license && data.profe_license_state && data.profe_credentials

            if (!this.isComplete) {
              this.showTabs = false
              this.tab = 4
              setTimeout(() =>{
                this.$nextTick(()=>{
                  this.showTabs = true
                })
              }, 100)
            }

            setTimeout(() => {
              this.$nextTick(()=>{
                if (this.isModerator){
                  this.profForm.setFieldsValue({
                    npi: data.profe_npi,
                    specialty: data.profe_specialty,
                    practice_name: data.profe_practice_name,
                    medical_license: data.profe_medical_license,
                    license_state: data.profe_license_state,
                    credentials: data.profe_credentials
                  })
                }
                if (this.$refs.profAddr){
                  this.$refs.profAddr.$emit('refresh')
                }
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

          values.is_patient = this.isUser

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
  .profile-upload
    display: flex
    flex-direction: row
    flex-wrap: wrap
    > div
      display: flex
      align-items: center
      justify-content: center
      padding: 0.9rem
    .upload-box
      display: flex
      justify-content: center
      align-items: center
      flex-direction: column
      .buttons
        display: flex
        width: 100%

  .profile-overlay
    opacity: 0
    color: #fff
    position: absolute
    left: 0
    top: 0
    bottom: 0
    width: 100%
    height: 100%
    display: flex
    justify-content: center
    align-items: center
    font-weight: bold
    font-size: 3rem
    &:hover
      cursor: pointer
      background: rgba(0,0,0,0.9)
      opacity: 1

  .avatar-uploader.ant-upload-picture-card-wrapper
    img
      max-width: 120px !important
</style>
