<template>
<div class="mh-100v">
  <v-row v-if='loadingPage'>
    <v-col cols='12'>
      <v-skeleton-loader></v-skeleton-loader>
    </v-col>
  </v-row>
  <a-row v-else class="pa-6">
    <v-col :xs="24" :sm="24">
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
            <div v-if='!isComplete'>
              <a-alert message='Please complete your profile information' :show-icon='true' type='warning' :banner='true'></a-alert>
            </div>
            <v-form ref="profForm" v-model="validProfForm" @submit.prevent='saveProfessional'>
              <v-row>
                <v-col md='6'>
                  <v-autocomplete v-model="category" label="Category" clearable :rules="[v => !!v || 'The category is required']" placeholder="Category" :items="categories" item-text="cate_category" item-value="cate_id"></v-autocomplete>
                </v-col>
                <v-col md='6'>
                  <v-text-field v-model="npi" placeholder="NPI" label="NPI" :rules="[v => !!v || 'The NPI is required', v => !!v && v.length === 10 || 'Enter exactly 10 characters']"></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col md='6'>
                  <v-autocomplete v-model="specialty" label="Specialty" :items="specialties" item-text="spec_specialty" item-value="spec_id" clearable :loading="loadingSpec" placeholder="Specialty"></v-autocomplete>
                </v-col>
                <v-col md='6'>
                  <v-text-field v-model="practice_name" label="Practice Name" placeholder="Practice Name" :rules="[v => !!v || 'The practice name is required', v => !!v && v.length > 0 || 'Enter at least 1 character', value => !!value && value.length <=60 || 'Enter a maximum of 60 characters']">
                  </v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col md='6' lg="4">
                  <v-text-field v-model="medical_license" label="Medical License" placeholder="Medical license" :rules="[v => !!v || 'The Medical License is required', v => !!v && v.length >= 3 || 'Enter at least 3 characters', v => !!v && v.length <=12 || 'Enter a maximum of 12 characters']">
                  </v-text-field>
                </v-col>
                <v-col md='6' lg="4">
                  <v-text-field v-model="license_state" label="License State" placeholder="License State" :rules="[v => !!v || 'The License state is required', v => !!v && v.length > 1 || 'Enter at least 2 characters', v => !!v && v.length <= 30 || 'Enter a maximum of 30 characters']"></v-text-field>
                </v-col>
                <v-col md='6' lg="4">
                  <v-text-field v-model="credentials" label="Credentials" placeholder="Credentials" :rules="[v =>!!v || 'The credentials are required', v => !!v && v.length > 1 || 'Enter at least 2 characters', v=> !!v && v.length <= 30 || 'Enter a maximum of 30 characters']"></v-text-field>
                </v-col>
              </v-row>
              <hr class="mb-1">
              <p class="mb-1 h4">
                Practice Address
              </p>
              <UserAddress ref="profAddr"></UserAddress>
              <a-form-item>
                <a-button type="primary" html-type='submit'>
                  <SpinOrText v-model='loadingSaveP'>
                    {{$t('save_changes')}}
                  </SpinOrText>
                </a-button>
              </a-form-item>
            </v-form>
          </a-tab-pane>
        </a-tabs>
      </div>
    </v-col>
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
import addressMixin from "~/mixins/addressMixin";

export default {
  name: "MyProfile",
  components: {
    UserAddress,
    ProfilePicture,
    SpinOrText,
    RequestModal,
  },
  mixins: [userRoleMixin, inputMixin, authMixin, uploadMixin, addressMixin],
  middleware: ['authenticated', 'not-blocked', 'not-deleted', 'verified', 'view-set'],
  data (){
    return {
      validProfForm: false,
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
      specialties: [],
      loadingSpec: false,
      specialty: null,
      practice_name: '',
      medical_license: '',
      license_state: '',
      credentials: '',
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
    categories(){
      this.specialty = null
    },
    category(v){
      if (v && this.isModerator){
        this.loadingSpec = true
        this.$api.get('/specialty/' + v).then(({data})=>{
          this.specialties = data
          if (this.specialties && this.specialties.length <= 0){
            this.$toast.error('No specialties found')
          }
        }).catch(()=>{
          this.$toast.error('Unable to get specialties')
        }).finally(() => {
          setTimeout(() => {
            this.loadingSpec = false
          }, 600)
        })
      }
    },
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
        this.categories = data
        console.log('Categories --->', data)
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
        if (data){
          this.isProfessional = this.isModerator
          this.category = data.profe_cate_id
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

          if (this.isModerator){
            this.npi = data.profe_npi
            this.practice_name = data.profe_practice_name
            this.medical_license = data.profe_medical_license
            this.license_state = data.profe_license_state
            this.credentials = data.profe_credentials
            if (data.profe_spec_id){
              this.specialty = data.profe_spec_id
            }
          }
          if (this.$refs.profAddr){
            this.$refs.profAddr.$emit('refresh')
          }
        }
      }).finally(() => {
        this.loadingPage = false
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
    saveProfessional(){
      this.$refs.profForm.validate()
      if (this.validProfForm){

        const values = {
          category: this.category,
          npi: this.npi,
          specialty: this.specialty,
          practice_name: this.practice_name,
          medical_license: this.medical_license,
          license_state: this.license_state,
          credentials: this.credentials,
          line1: this.line1,
          city: this.city,
          state: this.state,
          zip: this.zip
        }
        this.loadingSaveP = true
        this.$api.put('/professional', values).then(()=>{
          this.$toast.success(this.$t('updated_suc').toString());
        }).catch((e)=>{
          this.$refs.rmodal.$emit('error', e)
        }).finally(() => {
          this.loadingSaveP = false
        })
      }
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
