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
            <v-row v-if="!$auth.user.has_phone">
              <v-col>
                <v-alert type="warning">Please add your phone number</v-alert>
              </v-col>
            </v-row>
            <v-form ref="personalForm" v-model="validPersonalForm"  @submit.prevent="handleSubmit">
              <v-row>
                <v-col md="6">
                  <v-text-field v-model="first_name" :placeholder="$t('fn')" :label="$t('fn')" :rules="[v => !!v ||  $t('v.fn_req'), v => !!v && v.length > 2 || $t('v.min_3', v => !!v && v.length <= 30 || $t('v.max_30'))]"></v-text-field>
                </v-col>
                <v-col md="6">
                  <v-text-field v-model="last_name" :placeholder="$t('ln')" :label="$t('ln')" :rules="[v => !!v ||  $t('v.fn_req'), v => !!v && v.length > 2 || $t('v.min_3', v => !!v && v.length <= 30 || $t('v.max_30'))]"></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-text-field v-model="email" disabled label="Email" :rules="[v => !!v || $t('v.email_req'), v => !!v && v.length <= 150 || $t('v.max_email_150')]" prepend-inner-icon="mdi-email"></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col sm="4" md="2">
                  <v-text-field v-model="country_code" placeholder="Country code" label="Country code"></v-text-field>
                </v-col>
                <v-col sm="8" md="10">
                  <v-text-field v-model="phone_no" placeholder="Phone number" label="Phone number" maxlength="10"></v-text-field>
                </v-col>
              </v-row>
              <v-row v-if="isUser">
                <v-col>
                  <hr>
                  <p class="h4">
                    Address
                  </p>
                  <UserAddress></UserAddress>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-btn color="primary" tile small type="submit" :loading="loading">
                    {{$t('save_changes')}}
                  </v-btn>
                </v-col>
              </v-row>
            </v-form>
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
          <!-- Insured -->
          <a-tab-pane v-if="!isProfessional" key="5" tab="Insurance" force-render>
            <div v-if='!isCompletedInsured'>
              <a-alert message='Is the patient same as insured?' :show-icon='true' type='warning' :banner='true'></a-alert>
            </div>
            <div class="mb-10 d-flex flex-row justify-center">
                <v-checkbox v-model="yes"
                    :false-value="false"
                    :true-value="true"
                    :hide-details = true
                    label="Yes"
                    @change="checkCopy(true)"
                >
                </v-checkbox>
                <v-checkbox v-model="no"
                    :false-value="false"
                    :true-value="true"
                    :hide-details = true
                    label="No"
                    style="margin-left: 10px"
                    @change="checkCopy(false)"
                >
                </v-checkbox>
            </div>
            <v-form  ref="insuredForm" v-model="validInsuredForm" @submit.prevent='saveInsured'>
              <v-row>
                <v-col md='6' lg="6">
                  <v-text-field v-model="number5.patientName" label="Patient Name" placeholder="Patient Name" :rules="[v => !!v || 'The Patient Name is required', v => !!v && v.length >= 3 || 'Enter at least 3 characters', v => !!v && v.length <=12 || 'Enter a maximum of 12 characters']" :hide-details = true>
                  </v-text-field>
                </v-col>
                <v-col md='6' lg="6">
                  <v-text-field v-model="number5.patientAddress" label="Patient Address" placeholder="Patient Address" :rules="[v => !!v || 'The Patient Address is required', v => !!v && v.length > 1 || 'Enter at least 2 characters', v => !!v && v.length <= 30 || 'Enter a maximum of 30 characters']" :hide-details = true></v-text-field>
                </v-col>
              </v-row>

              <v-row>
                <v-col md='6' lg="3">
                  <v-text-field v-model="number5.patientCity" label="Patient City" placeholder="Patient City" :rules="[v => !!v || 'The Patient City is required', v => !!v && v.length >= 3 || 'Enter at least 3 characters', v => !!v && v.length <=12 || 'Enter a maximum of 12 characters']" :hide-details = true>
                  </v-text-field>
                </v-col>
                <v-col md='6' lg="3">
                  <v-text-field v-model="number5.patientState" label="Patient State" placeholder="Patient State" :rules="[v => !!v || 'The Patient State is required', v => !!v && v.length > 1 || 'Enter at least 2 characters', v => !!v && v.length <= 30 || 'Enter a maximum of 30 characters']" :hide-details = true></v-text-field>
                </v-col>
                <v-col md='6' lg="3">
                  <v-text-field v-model="number5.patientZipcode" label="PatientZipcode" placeholder="PatientZipcode" :rules="[v => !!v || 'The PatientZipcode is required', v => !!v && v.length > 1 || 'Enter at least 2 characters', v => !!v && v.length <= 30 || 'Enter a maximum of 30 characters']" :hide-details = true></v-text-field>
                </v-col>
                <v-col md='6' lg="3">
                  <v-text-field v-model="number5.patientTelephone" label="Patient Teletephone" placeholder="Patient Teletephone" :rules="[v => !!v || 'The Patient Teletephone is required', v => !!v && v.length > 1 || 'Enter at least 2 characters', v => !!v && v.length <= 30 || 'Enter a maximum of 30 characters']" :hide-details = true></v-text-field>
                </v-col>
              </v-row>

              <v-row>
                <v-col md='6' lg="6">
                  <v-text-field v-model="number4.insuredName" label="Insured's Name" placeholder="Insured's Name" :rules="[v => !!v || 'The Insured\'s Name is required', v => !!v && v.length >= 3 || 'Enter at least 3 characters', v => !!v && v.length <=12 || 'Enter a maximum of 12 characters']" :hide-details = true>
                  </v-text-field>
                </v-col>
                <v-col md='6' lg="6">
                  <v-text-field v-model="number7.insuredAddress" label="Insured's Address" placeholder="Insured's Address" :rules="[v => !!v || 'The Insured\'n Address is required', v => !!v && v.length > 1 || 'Enter at least 2 characters', v => !!v && v.length <= 30 || 'Enter a maximum of 30 characters']" :hide-details = true></v-text-field>
                </v-col>
              </v-row>

              <v-row>
                <v-col md='6' lg="3">
                  <v-text-field v-model="number7.insuredCity" label="Insured's City" placeholder="Insured's City" :rules="[v => !!v || 'The Insured\'s City is required', v => !!v && v.length >= 3 || 'Enter at least 3 characters', v => !!v && v.length <=12 || 'Enter a maximum of 12 characters']" :hide-details = true>
                  </v-text-field>
                </v-col>
                <v-col md='6' lg="3">
                  <v-text-field v-model="number7.insuredState" label="Insured's State" placeholder="Insured's State" :rules="[v => !!v || 'The Insured\'s State is required', v => !!v && v.length > 1 || 'Enter at least 2 characters', v => !!v && v.length <= 30 || 'Enter a maximum of 30 characters']" :hide-details = true></v-text-field>
                </v-col>
                <v-col md='6' lg="3">
                  <v-text-field v-model="number7.insuredZipcode" label="Insured's Zip Code" placeholder="Insured's Zip Code" :rules="[v => !!v || 'The Insured\'s Zip Code is required', v => !!v && v.length > 1 || 'Enter at least 2 characters', v => !!v && v.length <= 30 || 'Enter a maximum of 30 characters']" :hide-details = true></v-text-field>
                </v-col>
                <v-col md='6' lg="3">
                  <v-text-field v-model="number7.insuredTelephone" label="Insured's Teletephone" placeholder="Insured's Teletephone" :rules="[v => !!v || 'The Insured\'s Teletephone is required', v => !!v && v.length > 1 || 'Enter at least 2 characters', v => !!v && v.length <= 30 || 'Enter a maximum of 30 characters']" :hide-details = true></v-text-field>
                </v-col>
              </v-row>

              <v-row>
                <v-col md='6' lg="3">
                  <v-text-field v-model="number11.c" label="Insurance Plan Name" placeholder="Insurance Plan Name" :rules="[v => !!v || 'The Insurance Plan Name is required', v => !!v && v.length > 1 || 'Enter at least 2 characters', v => !!v && v.length <= 30 || 'Enter a maximum of 30 characters']" :hide-details = true></v-text-field>
                </v-col>
                <v-col md='6' lg="4">
                  <div class="d-flex flex-row align-end">
                    <label for="">Insured's Date Of Birth: </label>
                    <date-picker v-model="insuredBirthDay" type="date" style="margin-left: 15px"></date-picker>
                  </div>
                </v-col>
                <v-col md='6' lg="2">
                  <v-select
                    v-model="number11.a.sex"
                    :items="sexs"
                    label="Insured's Sex"
                  ></v-select>
                </v-col>
                <v-col md='6' lg="3">
                  <v-select
                    v-model="number6"
                    :items="relations"
                    label="Relation with patient"
                  ></v-select>
                </v-col>
              </v-row>

              <v-row>
                <v-col md='6' lg="3">
                  <v-text-field v-model="number17.value" label="name of referring provider" placeholder="name of referring provider" :rules="[v => !!v || 'The name of referring provider is required', v => !!v && v.length >= 3 || 'Enter at least 3 characters', v => !!v && v.length <=12 || 'Enter a maximum of 12 characters']">
                  </v-text-field>
                </v-col>
                <v-col md='6' lg="3">
                  <v-text-field v-model="number17.a.first" label="17.a.1" placeholder="17.a.1" :rules="[v => !!v || 'The 17.a.1 is required', v => !!v && v.length > 1 || 'Enter at least 2 characters', v => !!v && v.length <= 30 || 'Enter a maximum of 30 characters']"></v-text-field>
                </v-col>
                <v-col md='6' lg="3">
                  <v-text-field v-model="number17.a.second" label="17.a.2" placeholder="17.a.2" :rules="[v => !!v || 'The 17.a.2 is required', v => !!v && v.length >= 3 || 'Enter at least 3 characters', v => !!v && v.length <=12 || 'Enter a maximum of 12 characters']">
                  </v-text-field>
                </v-col>
                <v-col md='6' lg="3">
                  <v-text-field v-model="number17.b" label="17.b" placeholder="17.b" :rules="[v => !!v || 'The 17.b is required', v => !!v && v.length >= 3 || 'Enter at least 3 characters', v => !!v && v.length <=12 || 'Enter a maximum of 12 characters']">
                  </v-text-field>
                </v-col>
              </v-row>

              <v-row>
                <v-col md='6' lg="4">
                  <v-text-field v-model="number13.value" label="Insured's Sign" placeholder="Insured's Sign" :rules="[v =>!!v || 'The Insured\'s Sign are required', v => !!v && v.length > 1 || 'Enter at least 2 characters', v=> !!v && v.length <= 30 || 'Enter a maximum of 30 characters']" :hide-details = true></v-text-field>
                </v-col>
                <v-col md='6' lg="4">
                  <v-text-field v-model="number12.signed" label="Patient Sign" placeholder="Patient Sign" :rules="[v => !!v || 'The Patient Sign is required', v => !!v && v.length >= 3 || 'Enter at least 3 characters', v => !!v && v.length <=12 || 'Enter a maximum of 12 characters']" :hide-details = true>
                  </v-text-field>
                </v-col>
                <v-col md='6' lg="4">
                  <div class="d-flex flex-row align-end">
                    <label for="">Patient Sign Date: </label>
                    <date-picker v-model="patientSignDate" type="date" style="margin-left: 15px"></date-picker>
                  </div>
                </v-col>
              </v-row>

              <a-form-item class="mt-5">
                <a-button type="primary" html-type='submit'>
                  <SpinOrText v-model='loadingSaveP'>
                    {{$t('save_changes')}}
                  </SpinOrText>
                </a-button>
              </a-form-item>
            </v-form>
          </a-tab-pane>
          <!-- Claims -->
          <a-tab-pane v-if="isProfessional" key="6" tab="Claims" force-render>
            <div v-if='!isCompletedClaims'>
              <a-alert message='Please complete your Claims information' :show-icon='true' type='warning' :banner='true'></a-alert>
            </div>
            <v-form ref="claimsForm" v-model="validClaimsForm" @submit.prevent='saveClaims'>
              <v-row>
                <v-col md='6' lg="3">
                  <v-text-field v-model="number25.value" label="Federal Tax I.D. Number" placeholder="Federal Tax I.D. Number" :rules="[v => !!v || 'The Federal Tax I.D. Number is required', v => !!v && v.length >= 3 || 'Enter at least 3 characters', v => !!v && v.length <=12 || 'Enter a maximum of 12 characters']">
                  </v-text-field>
                </v-col>
                <v-col md='6' lg="3">
                  <v-select
                  v-model="number25.selectedValue"
                    :items="selItems"
                    label="Select Item"
                  ></v-select>
                </v-col>
                <v-col md='6' lg="3">
                  <v-text-field v-model="number26.value" label="Patient Account NO." placeholder="Patient Account NO." :rules="[v => !!v || 'The Patient Account NO. is required', v => !!v && v.length >= 3 || 'Enter at least 3 characters', v => !!v && v.length <=12 || 'Enter a maximum of 12 characters']">
                  </v-text-field>
                </v-col>
                <v-col md='6' lg="3">
                  <v-text-field v-model="number31.value" label="Signature Of Physicican" placeholder="Signature Of Physicican" :rules="[v => !!v || 'The Patient Name is required', v => !!v && v.length >= 3 || 'Enter at least 3 characters', v => !!v && v.length <=12 || 'Enter a maximum of 12 characters']">
                  </v-text-field>
                </v-col>
              </v-row>

              <v-row>
                <v-col md='6' lg="4">
                  <v-text-field v-model="number32.value" label="Service Facility" placeholder="Service Facility" :rules="[v =>!!v || 'The Service Facility are required', v => !!v && v.length > 1 || 'Enter at least 2 characters', v=> !!v && v.length <= 30 || 'Enter a maximum of 30 characters']"></v-text-field>
                </v-col>
                <v-col md='6' lg="4">
                  <v-text-field v-model="number32.a" label="1 of number32" placeholder="1 of number32" :rules="[v => !!v || 'The 1 of number32 is required', v => !!v && v.length >= 3 || 'Enter at least 3 characters', v => !!v && v.length <=12 || 'Enter a maximum of 12 characters']">
                  </v-text-field>
                </v-col>
                <v-col md='6' lg="4">
                  <v-text-field v-model="number32.b" label="2 of number32" placeholder="2 of number32" :rules="[v => !!v || 'The 2 of number32 is required', v => !!v && v.length >= 3 || 'Enter at least 3 characters', v => !!v && v.length <=12 || 'Enter a maximum of 12 characters']">
                  </v-text-field>
                </v-col>
              </v-row>

              <v-row>
                <v-col md='6' lg="4">
                  <v-text-field v-model="number33.value" label="Billing Provider Info" placeholder="Billing Provider Info" :rules="[v =>!!v || 'The Billing Provider Info are required', v => !!v && v.length > 1 || 'Enter at least 2 characters', v=> !!v && v.length <= 30 || 'Enter a maximum of 30 characters']"></v-text-field>
                </v-col>
                <v-col md='6' lg="4">
                  <v-text-field v-model="number33.a" label="1 of number33" placeholder="1 of number33" :rules="[v => !!v || 'The 1 of number33 is required', v => !!v && v.length >= 3 || 'Enter at least 3 characters', v => !!v && v.length <=12 || 'Enter a maximum of 12 characters']">
                  </v-text-field>
                </v-col>
                <v-col md='6' lg="4">
                  <v-text-field v-model="number33.b" label="2 of number33" placeholder="2 of number33" :rules="[v => !!v || 'The 2 of number33 is required', v => !!v && v.length >= 3 || 'Enter at least 3 characters', v => !!v && v.length <=12 || 'Enter a maximum of 12 characters']">
                  </v-text-field>
                </v-col>
              </v-row>

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
import DatePicker from "vue2-datepicker";
import userRoleMixin from "~/mixins/userRoleMixin";
import SpinOrText from '~/components/SpinOrText.vue'
import inputMixin from '~/mixins/inputMixin'
import authMixin from '~/mixins/authMixin'
import RequestModal from '~/components/RequestModal'
import ProfilePicture from '~/components/ProfilePicture'
import uploadMixin from '~/mixins/uploadMixin'
import UserAddress from "~/components/UserAddress";
import addressMixin from "~/mixins/addressMixin";
import 'vue2-datepicker/index.css';

export default {
  name: "MyProfile",
  components: {
    UserAddress,
    ProfilePicture,
    SpinOrText,
    RequestModal,
    DatePicker,
  },
  mixins: [userRoleMixin, inputMixin, authMixin, uploadMixin, addressMixin],
  middleware: ['authenticated', 'not-blocked', 'not-deleted', 'verified', 'view-set'],
  data (){
    return {
      validPersonalForm: false,
      validProfForm: false,
      validClaimsForm: false,
      validInsuredForm: false,
      picture: '',
      file: null,
      showTabs: true,
      isComplete: false,
      isCompletedInsured: false,
      isCompletedClaims: false,
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
     // isProfessional: false,
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

      // Copy All Data
      yes: false,
      no: true,
      // Insured Information
      number4: { insuredName: '' },
      number5: {
          patientAddress: '',
          patientCity: '',
          patientState: '',
          patientZipcode: '',
          patientTelephone: '',
      },
      number6: '',
      number7: {
          insuredAddress: '',
          insuredCity: '',
          insuredState: '',
          insuredZipcode: '',
          insuredTelephone: '',
      },
      number11: {
          a: {
              mm: '',
              dd: '',
              yy: '',
              sex: '',
          },
          c: '',
      },
      number12: {
          signed: '',
          date: '',
      },
      number13: {
          value: '',
      },
      insuredBirthDay: new Date(),
      insuredSign: '',
      patientSign: '',
      patientSignDate: new Date(),
      relations: [ 'Self', 'Spouse', 'Child', 'Other' ],
      sexs: [ 'male', 'female' ],
      relationWithPatient: null,
      patientSex: null,

      // Claims Information
      selItems: ['ssn', 'ein'],
      selItem: '',
      number17: {
          value: '',
          a: {
              first: '',
              second: '',
          },
          b: '',
      },
      number25: {
          value: '',
          selectedValue: '',
      },
      number26: {
          value: '',
      },
      number31: {
          value: ''
      },
      number32: {
          value: '',
          a: '',
          b: '',
      },
      number33: {
          value: '',
          a: '',
          b: '',
      },
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

  },
  mounted() {
    if (this.myUserId){
      this.$userApi.get('/'+ this.myUserId).then(({data})=>{
        if (data && data.user_uuid){
          this.phone_no = data.user_phone_no
          this.country_code = '+' + data.user_country_code
          this.picture = data.user_picture

          if (!this.$auth.user.has_phone){
            console.log('Dont have a phone no')
            this.showTabs = false
            this.tab = '2'
            setTimeout(() =>{
              this.$nextTick(()=>{
                this.showTabs = true
              })
            }, 200)
          }
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
    this.$insuranceApi.get(`/insured/?id=${this.myUserId}`).then(({data})=>{
      if (data && Object.keys(data).length > 0){
        console.log('insured --->', data);
        this.number4 = data.number4;
        this.number5 = data.number5;
        this.number6 = data.number6;
        this.number7 = data.number7;
        this.number11 = data.number11;
        this.number12 = data.number12;
        this.number13 = data.number13;
        this.number17 = data.number17;
      }
    }).catch(()=>{
      this.$toast.error('Failed to load categories.')
    })

    this.$insuranceApi.get(`/claims/?id=${this.myUserId}`).then(({data})=>{
      if (data && Object.keys(data).length > 0){
        console.log('claims --->', data);
        this.number25 = data.number25;
        this.number26 = data.number26;
        this.number31 = data.number31;
        this.number32 = data.number32;
        this.number33 = data.number33;
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

      this.$userApi.post('/picture', data).then(({data})=>{
        this.$toast.success('Your profile picture has been updated.')
        this.src = ''
        this.showUploadPicture = false
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
         // this.isProfessional = this.isModerator
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
    handleSubmit(){

      this.$refs.personalForm.validate()
      if (this.validPersonalForm){
        this.loading = true
        this.$api
          .put('/user', {
            country_code: this.country_code,
            phone_no: this.phone_no,
            is_patient: this.isUser,
            line1: this.line1,
            city: this.city,
            state: this.state,
            zip: this.zip,
            first_name: this.first_name,
            last_name: this.last_name,
          })
          .then(() => {
            setTimeout(async () => {
              await this.$auth.fetchUser()
              console.log('Fetched user --->', this.$auth.user)
              this.$toast.success(this.$t('updated_suc').toString());
            }, 100)
          })
          .catch((e) => {
            this.$refs.rmodal.$emit('error', e)
          })
          .finally(() => {
            setTimeout(() => {
              this.loading = false
            }, 100)
          })
      }
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

    saveClaims(){
      this.$refs.claimsForm.validate();
      if (this.validClaimsForm){
        const data = {
          user_uuid: this.$auth.user.uuid,
          claims_info: {
            number25: this.number25,
            number26: this.number26,
            number31: this.number31,
            number32: this.number32,
            number33: this.number33,
          }
        }
        this.loadingSaveP = true
        this.$insuranceApi.post('/claims/save', data).then(()=>{
          this.$toast.success(this.$t('updated_suc').toString());
        }).catch((e)=>{
          this.$refs.rmodal.$emit('error', e)
        }).finally(() => {
          this.loadingSaveP = false
        })
      }
    },
    saveInsured(){
      this.$refs.insuredForm.validate();
      if (this.validInsuredForm){
        const insuredDate = this.insuredBirthDay.toISOString().substr(0, 10).split('-');
        this.number11.a.yy = insuredDate[0];
        this.number11.a.mm = insuredDate[1];
        this.number11.a.dd = insuredDate[2];

        this.number12.date = this.patientSignDate.toISOString().substr(0, 10);

        const data = {
          user_uuid: this.$auth.user.uuid,
          insured_info: {
            number4: this.number4,
            number5: this.number5,
            number6: this.number6,
            number7: this.number7,
            number11: this.number11,
            number12: this.number12,
            number13: this.number13,
            number17: this.number17,
          }
        }
        this.loadingSaveP = true
        this.$insuranceApi.post('/insured/save', data).then(()=>{
          this.$toast.success(this.$t('updated_suc').toString());
        }).catch((e)=>{
          this.$refs.rmodal.$emit('error', e)
        }).finally(() => {
          this.loadingSaveP = false
        })
      }
    },

    checkCopy(value){
      if(value){
        this.yes = true;
        this.no = false;
      }else{
        this.yes = false;
        this.no = true;
      }
      if(this.yes){
        this.number4.insuredName = this.number5.patientName;
        this.number7.insuredAddress = this.number5.patientAddress;
        this.number7.insuredCity = this.number5.patientCity;
        this.number7.insuredState = this.number5.patientState;
        this.number7.insuredZipcode = this.number5.patientZipcode;
        this.number7.insuredTelephone = this.number5.patientTelephone;
      }
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
  .v-text-field
        padding: 0px
</style>
