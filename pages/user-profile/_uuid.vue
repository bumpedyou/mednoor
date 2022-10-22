<template>
  <v-app>
  <div class="mh-100v">
    <v-row v-if="loadingPage">
      <v-col cols="12">
        <v-skeleton-loader></v-skeleton-loader>
      </v-col>
    </v-row>
    <a-row v-else class="pa-6">
      <v-col :xs="24" :sm="24">
        <div>
          <v-row>
          <v-col :xs="11" :sm="11">
            <p class="h1 flex-line align-f-md">
            {{ user.user_first_name }} {{ user.user_last_name }}
            <v-btn
              v-if="user && user.usro_key"
              color="purple"
              dark
              small
              class="ml-1"
              rounded
            >
              {{ user.usro_role }}
            </v-btn>
          </p>
          </v-col>
          <v-col :xs="1" :sm="1">
            <v-btn color="warning" @click="$router.push(localePath('/users-list/'))">
              <v-icon dark left>mdi-arrow-left</v-icon>Back</v-btn>
          </v-col>
        </v-row>
        </div>
        
        <div>
          <a-tabs v-if="showTabs" :default-active-key="tab.toString()">
            <a-tab-pane key="1" tab="Profile Picture">
              <div class="profile-upload">
                <div v-if="showUploadPicture" class="upload-box">
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
                      <div class="ant-upload-text">Upload</div>
                    </div>
                  </a-upload>
                  <div class="buttons">
                    <a-button
                      v-if="src && src.length"
                      block
                      type="primary"
                      @click="uploadPicture"
                    >
                      <SpinOrText v-model="loadingUpload"> Save </SpinOrText>
                    </a-button>
                    <a-button block type="danger" @click="cancelUpload"
                      >Cancel</a-button
                    >
                  </div>
                </div>
                <div v-else>
                  <div>
                    <ProfilePicture :full-name="name" :picture="picture">
                      <div
                        class="profile-overlay"
                        @click="showUploadPicture = true"
                      >
                        <a-icon type="upload"></a-icon>
                      </div>
                    </ProfilePicture>
                  </div>
                </div>
              </div>
            </a-tab-pane>
            <a-tab-pane key="2" tab="Personal Information">
              <v-row v-if="!user.user_phone_no">
                <v-col>
                  <v-alert type="warning">Please add your phone number</v-alert>
                </v-col>
              </v-row>
              <v-form
                ref="personalForm"
                v-model="validPersonalForm"
                @submit.prevent="handleSubmit"
              >
                <v-row>
                  <v-col md="4">
                    <v-text-field
                      v-model="first_name"
                      :placeholder="$t('fn')"
                      :label="$t('fn')"
                      :rules="[
                        (v) => !!v || $t('v.fn_req'),
                        (v) =>
                          (!!v && v.length > 2) ||
                          $t(
                            'v.min_3',
                            (v) => (!!v && v.length <= 30) || $t('v.max_30')
                          ),
                      ]"
                    ></v-text-field>
                  </v-col>
                  <v-col md="4">
                    <v-text-field
                      v-model="middle_name"
                      :placeholder="$t('mn')"
                      :label="$t('mn')"
                    ></v-text-field>
                  </v-col>
                  <v-col md="4">
                    <v-text-field
                      v-model="last_name"
                      :placeholder="$t('ln')"
                      :label="$t('ln')"
                      :rules="[
                        (v) => !!v || $t('v.fn_req'),
                        (v) =>
                          (!!v && v.length > 2) ||
                          $t(
                            'v.min_3',
                            (v) => (!!v && v.length <= 30) || $t('v.max_30')
                          ),
                      ]"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col>
                    <v-text-field
                      v-model="email"
                      label="Email"
                      prepend-inner-icon="mdi-email"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col sm="8" md="8">
                    <div data-app>
                      <PhoneNo :cc="country_code" :pn="phone_no" :uc="user_country"/>
                    </div>
                  </v-col>
                  <v-col sm="4" md="4">
                    <div class="d-flex flex-row align-end">
                      <label for="">Date Of Birth: </label>
                      <date-picker
                        v-model="date_of_birth"
                        format="MM/DD/YYYY"
                        type="date"
                        style="margin-left: 15px"
                      ></date-picker>
                    </div>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col sm="12" md="12">
                    <div data-app>
                      <UserAddress :ac="country" :owner="owner"/>
                    </div>
                  </v-col>
                </v-row>
            
                <v-row>
                  <v-col>
                    <v-btn
                      color="primary" 
                      tile
                      small
                      type="submit"
                      :loading="loading"
                    >
                      {{ $t('save_changes') }}
                    </v-btn>
                  </v-col>
                </v-row>
              </v-form>
              
            </a-tab-pane>
            
            <!-- <a-tab-pane key="3" tab="Security" force-render>
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
          </a-tab-pane> -->

            <a-tab-pane key="5" tab="Insurance" force-render>
              <div v-if="!isCompletedInsured">
                <a-alert
                  message="Is the patient same as insured?"
                  :show-icon="true"
                  type="warning"
                  :banner="true"
                ></a-alert>
              </div>
              <div class="mb-10 d-flex flex-row justify-center">
                <v-checkbox
                  v-model="yes"
                  :false-value="false"
                  :true-value="true"
                  :hide-details="true"
                  label="Yes"
                  @change="checkCopy(true)"
                >
                </v-checkbox>
                <v-checkbox
                  v-model="no"
                  :false-value="false"
                  :true-value="true"
                  :hide-details="true"
                  label="No"
                  style="margin-left: 10px"
                  @change="checkCopy(false)"
                >
                </v-checkbox>
              </div>

              <v-form
                ref="insuredForm"
                v-model="validInsuredForm"
                @submit.prevent="saveInsured"
              >
                <v-row>
                  <v-col md="6" lg="6">
                    <v-text-field
                      v-model="number5.patientName"
                      label="Patient Name"
                      placeholder="Patient Name"
                      :hide-details="true"
                    >
                    </v-text-field>
                  </v-col>
                  <v-col md="6" lg="6">
                    <v-text-field
                      v-model="number5.patientAddress"
                      label="Patient Address"
                      placeholder="Patient Address"
                      :hide-details="true"
                    ></v-text-field>
                  </v-col>
                </v-row>

                <v-row>
                  <v-col md="6" lg="3">
                    <v-text-field
                      v-model="number5.patientCity"
                      label="Patient City"
                      placeholder="Patient City"
                      :hide-details="true"
                    >
                    </v-text-field>
                  </v-col>
                  <v-col md="6" lg="3">
                    <v-text-field
                      v-model="number5.patientState"
                      label="Patient State"
                      placeholder="Patient State"
                      :hide-details="true"
                    ></v-text-field>
                  </v-col>
                  <v-col md="6" lg="3">
                    <v-text-field
                      v-model="number5.patientZipcode"
                      label="PatientZipcode"
                      placeholder="PatientZipcode"
                      :hide-details="true"
                    ></v-text-field>
                  </v-col>
                  <v-col md="6" lg="3">
                    <v-text-field
                      v-model="number5.patientTelephone"
                      label="Patient Teletephone"
                      placeholder="Patient Teletephone"
                      :hide-details="true"
                    ></v-text-field>
                  </v-col>
                </v-row>

                <v-row>
                  <v-col md="6">
                    <v-col>
                      <p class="h6">Primary Insurance </p>

                    </v-col>
                    <v-row>
                      <v-col md="4" lg="4">
                        <v-text-field
                          v-model="number4.insuredContract"
                          label="Contract"
                          placeholder="Contract"
                          :rules="[
                        (v) => !!v || 'The Insured\'s Contract is required',
                        (v) =>
                          (!!v && v.length >= 3) ||
                          'Enter at least 3 characters',
                        (v) =>
                          (!!v && v.length <= 12) ||
                          'Enter a maximum of 12 characters',
                      ]"
                          :hide-details="true"
                        >
                        </v-text-field>
                      </v-col>
                      <v-col md="4" lg="4">
                        <v-text-field
                          v-model="number4.insuredPolicy"
                          label="Policy"
                          placeholder="Policy"
                          :rules="[
                        (v) => !!v || 'The Insured\'s Policy is required',
                        (v) =>
                          (!!v && v.length >= 3) ||
                          'Enter at least 3 characters',
                        (v) =>
                          (!!v && v.length <= 12) ||
                          'Enter a maximum of 12 characters',
                      ]"
                          :hide-details="true"
                        >
                        </v-text-field>
                      </v-col>
                      <v-col md="4" lg="4">
                        <v-text-field
                          v-model="number4.insuredGroup"
                          label="Group"
                          placeholder="Group"
                          :rules="[
                        (v) => !!v || 'The Insured\'s Group is required',
                        (v) =>
                          (!!v && v.length >= 3) ||
                          'Enter at least 3 characters',
                        (v) =>
                          (!!v && v.length <= 12) ||
                          'Enter a maximum of 12 characters',
                      ]"
                          :hide-details="true"
                        >
                        </v-text-field>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col md="6" lg="6">
                        <v-text-field
                          v-model="number4.insuredName"
                          label="Insured's Name"
                          placeholder="Insured's Name"
                          :rules="[
                        (v) => !!v || 'The Insured\'s Name is required',
                        (v) =>
                          (!!v && v.length >= 3) ||
                          'Enter at least 3 characters',
                        (v) =>
                          (!!v && v.length <= 12) ||
                          'Enter a maximum of 12 characters',
                      ]"
                          :hide-details="true"
                        >
                        </v-text-field>
                      </v-col>
                      <v-col md="6" lg="6">
                        <v-text-field
                          v-model="number7.insuredAddress"
                          label="Insured's Address"
                          placeholder="Insured's Address"
                          :rules="[
                        (v) => !!v || 'The Insured\'n Address is required',
                        (v) =>
                          (!!v && v.length > 1) ||
                          'Enter at least 2 characters',
                        (v) =>
                          (!!v && v.length <= 30) ||
                          'Enter a maximum of 30 characters',
                      ]"
                          :hide-details="true"
                        ></v-text-field>
                      </v-col>
                    </v-row>

                    <v-row>
                      <v-col md="6" lg="3">
                        <v-text-field
                          v-model="number7.insuredCity"
                          label="Insured's City"
                          placeholder="Insured's City"
                          :rules="[
                        (v) => !!v || 'The Insured\'s City is required',
                        (v) =>
                          (!!v && v.length >= 3) ||
                          'Enter at least 3 characters',
                        (v) =>
                          (!!v && v.length <= 12) ||
                          'Enter a maximum of 12 characters',
                      ]"
                          :hide-details="true"
                        >
                        </v-text-field>
                      </v-col>
                      <v-col md="6" lg="3">
                        <v-text-field
                          v-model="number7.insuredState"
                          label="Insured's State"
                          placeholder="Insured's State"
                          :rules="[
                        (v) => !!v || 'The Insured\'s State is required',
                        (v) =>
                          (!!v && v.length > 1) ||
                          'Enter at least 2 characters',
                        (v) =>
                          (!!v && v.length <= 30) ||
                          'Enter a maximum of 30 characters',
                      ]"
                          :hide-details="true"
                        ></v-text-field>
                      </v-col>
                      <v-col md="6" lg="3">
                        <v-text-field
                          v-model="number7.insuredZipcode"
                          label="Insured's Zip Code"
                          placeholder="Insured's Zip Code"
                          :rules="[
                        (v) => !!v || 'The Insured\'s Zip Code is required',
                        (v) =>
                          (!!v && v.length > 1) ||
                          'Enter at least 2 characters',
                        (v) =>
                          (!!v && v.length <= 30) ||
                          'Enter a maximum of 30 characters',
                      ]"
                          :hide-details="true"
                        ></v-text-field>
                      </v-col>
                      <v-col md="6" lg="3">
                        <v-text-field
                          v-model="number7.insuredTelephone"
                          label="Insured's Teletephone"
                          placeholder="Insured's Teletephone"
                          :rules="[
                        (v) => !!v || 'The Insured\'s Teletephone is required',
                        (v) =>
                          (!!v && v.length > 1) ||
                          'Enter at least 2 characters',
                        (v) =>
                          (!!v && v.length <= 30) ||
                          'Enter a maximum of 30 characters',
                      ]"
                          :hide-details="true"
                        ></v-text-field>
                      </v-col>
                    </v-row>

                    <v-row>
                      <v-col md="6" lg="3">
                        <v-text-field
                          v-model="number11.c"
                          label="Insurance Plan Name"
                          placeholder="Insurance Plan Name"
                          :rules="[
                        (v) => !!v || 'The Insurance Plan Name is required',
                        (v) =>
                          (!!v && v.length > 1) ||
                          'Enter at least 2 characters',
                        (v) =>
                          (!!v && v.length <= 30) ||
                          'Enter a maximum of 30 characters',
                      ]"
                          :hide-details="true"
                        ></v-text-field>
                      </v-col>
                      <v-col md="6" lg="4">
                        <div class="d-flex flex-row align-end">
                          <label for="">Insured's Date Of Birth: </label>
                          <date-picker
                            v-model="insuredBirthDay"
                            format="MM/DD/YYYY"
                            type="date"
                            style="margin-left: 15px"
                          ></date-picker>
                        </div>
                      </v-col>
                      <v-col md="6" lg="2">
                        <v-select
                          v-model="number11.a.sex"
                          :items="sexs"
                          label="Insured's Sex"
                        ></v-select>
                      </v-col>
                      <v-col md="6" lg="3">
                        <v-select
                          v-model="number6"
                          :items="relations"
                          label="Relation with patient"
                        ></v-select>
                      </v-col>
                    </v-row>
                  </v-col>
                  <v-col md="6">
                    <v-col>
                      <p class="h6">Secondary Insurance</p>

                    </v-col>
                    <v-row>
                      <v-col md="4" lg="4">
                        <v-text-field
                          v-model="number4_2.insuredContract"
                          label="Contract"
                          placeholder="Contract"

                          :hide-details="true"
                        >
                        </v-text-field>
                      </v-col>
                      <v-col md="4" lg="4">
                        <v-text-field
                          v-model="number4_2.insuredPolicy"
                          label="Policy"
                          placeholder="Policy"

                          :hide-details="true"
                        >
                        </v-text-field>
                      </v-col>
                      <v-col md="4" lg="4">
                        <v-text-field
                          v-model="number4_2.insuredGroup"
                          label="Group"
                          placeholder="Group"

                          :hide-details="true"
                        >
                        </v-text-field>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col md="6" lg="6">
                        <v-text-field
                          v-model="number4_2.insuredName"
                          label="Insured's Name"
                          placeholder="Insured's Name"

                          :hide-details="true"
                        >
                        </v-text-field>
                      </v-col>
                      <v-col md="6" lg="6">
                        <v-text-field
                          v-model="number7_2.insuredAddress"
                          label="Insured's Address"
                          placeholder="Insured's Address"

                          :hide-details="true"
                        ></v-text-field>
                      </v-col>
                    </v-row>

                    <v-row>
                      <v-col md="6" lg="3">
                        <v-text-field
                          v-model="number7_2.insuredCity"
                          label="Insured's City"
                          placeholder="Insured's City"

                          :hide-details="true"
                        >
                        </v-text-field>
                      </v-col>
                      <v-col md="6" lg="3">
                        <v-text-field
                          v-model="number7_2.insuredState"
                          label="Insured's State"
                          placeholder="Insured's State"

                          :hide-details="true"
                        ></v-text-field>
                      </v-col>
                      <v-col md="6" lg="3">
                        <v-text-field
                          v-model="number7_2.insuredZipcode"
                          label="Insured's Zip Code"
                          placeholder="Insured's Zip Code"

                          :hide-details="true"
                        ></v-text-field>
                      </v-col>
                      <v-col md="6" lg="3">
                        <v-text-field
                          v-model="number7_2.insuredTelephone"
                          label="Insured's Teletephone"
                          placeholder="Insured's Teletephone"

                          :hide-details="true"
                        ></v-text-field>
                      </v-col>
                    </v-row>

                    <v-row>
                      <v-col md="6" lg="3">
                        <v-text-field
                          v-model="number11_2.c"
                          label="Insurance Plan Name"
                          placeholder="Insurance Plan Name"

                          :hide-details="true"
                        ></v-text-field>
                      </v-col>
                      <v-col md="6" lg="4">
                        <div class="d-flex flex-row align-end">
                          <label for="">Insured's Date Of Birth: </label>
                          <date-picker
                            v-model="secondInsuredBirthDay"
                            format="MM/DD/YYYY"
                            type="date"
                            style="margin-left: 15px"
                          ></date-picker>
                        </div>
                      </v-col>
                      <v-col md="6" lg="2">
                        <v-select
                          v-model="number11_2.a.sex"
                          :items="sexs"
                          label="Insured's Sex"
                        ></v-select>
                      </v-col>
                      <v-col md="6" lg="3">
                        <v-select
                          v-model="number6_2"
                          :items="relations"
                          label="Relation with patient"
                        ></v-select>
                      </v-col>
                    </v-row>
                  </v-col>
                </v-row>

                <v-row>
                  <v-col md="6" lg="3">
                    <v-text-field
                      v-model="number17.value"
                      label="name of referring provider"
                      placeholder="name of referring provider"
                    >
                    </v-text-field>
                  </v-col>
                  <v-col md="6" lg="3">
                    <v-text-field
                      v-model="number17.a.first"
                      label="17.a.1"
                      placeholder="17.a.1"
                    ></v-text-field>
                  </v-col>
                  <v-col md="6" lg="3">
                    <v-text-field
                      v-model="number17.a.second"
                      label="17.a.2"
                      placeholder="17.a.2"
                    >
                    </v-text-field>
                  </v-col>
                  <v-col md="6" lg="3">
                    <v-text-field
                      v-model="number17.b"
                      label="17.b"
                      placeholder="17.b"
                    >
                    </v-text-field>
                  </v-col>
                </v-row>

                <v-row>
                  <v-col md="6" lg="4">
                    <v-text-field
                      v-model="number13.value"
                      label="Insured's Sign"
                      placeholder="Insured's Sign"
                      :hide-details="true"
                    ></v-text-field>
                  </v-col>
                  <v-col md="6" lg="4">
                    <v-text-field
                      v-model="number12.signed"
                      label="Patient Sign"
                      placeholder="Patient Sign"
                      :hide-details="true"
                    >
                    </v-text-field>
                  </v-col>
                  <v-col md="6" lg="4">
                    <div class="d-flex flex-row align-end">
                      <label for="">Patient Sign Date: </label>
                      <date-picker
                        v-model="patientSignDate"
                        type="date"
                        style="margin-left: 15px"
                        format="MM/DD/YYYY"
                      ></date-picker>
                    </div>
                  </v-col>
                </v-row>

                <a-form-item class="mt-5">
                  <a-button type="primary" html-type="submit">
                    <SpinOrText v-model="loadingSaveP">
                      {{ $t('save_changes') }}
                    </SpinOrText>
                  </a-button>
                </a-form-item>
              </v-form>
            </a-tab-pane>
            <a-tab-pane key="6" tab="Medical History">
              <v-form
                ref="insuredForm"
                v-model="validInsuredForm"
                @submit.prevent="saveMedicalHistory"
              >
                <a-tabs>

                  <a-tab-pane v-for="t in tabs" :key="t.key" :tab="t.tab">
                    <v-textarea
                      v-model="t.data"
                      type="text"
                      height="100"
                      class="mt-5"
                      :label="t.tab.replaceAll('-', ' ')"

                    >
                    </v-textarea>
                  </a-tab-pane>


                </a-tabs>
                <a-form-item class="mt-5">
                  <a-button type="primary" html-type="submit">
                    <SpinOrText v-model="loadingSaveP">
                      {{ $t('save_changes') }}
                    </SpinOrText>
                  </a-button>
                </a-form-item>
              </v-form>
            </a-tab-pane>
            <!-- Claims -->
          </a-tabs>
        </div>
      </v-col>
    </a-row>

    <request-modal ref="rmodal"></request-modal>
  </div>
</v-app>
</template>

<script>
import DatePicker from 'vue2-datepicker'
import userRoleMixin from '~/mixins/userRoleMixin'
import SpinOrText from '~/components/SpinOrText.vue'
import inputMixin from '~/mixins/inputMixin'
import authMixin from '~/mixins/authMixin'
import RequestModal from '~/components/RequestModal'
import ProfilePicture from '~/components/ProfilePicture'
import uploadMixin from '~/mixins/uploadMixin'
import UserAddress from '~/components/UserAddress'
import addressMixin from '~/mixins/addressMixin'
import PhoneNo from '~/components/phoneNo'
import phoneNoMixin from '~/mixins/phoneNoMixin'
import uTcDate from '~/mixins/uTcDate'
import 'vue2-datepicker/index.css'
import dateMixin from '~/mixins/dateMixin'
export default {
  name: 'MyProfile',
  components: {
    UserAddress,
    PhoneNo,
    ProfilePicture,
    SpinOrText,
    RequestModal,
    DatePicker,
  },
  mixins: [
    userRoleMixin,
    inputMixin,
    phoneNoMixin,
    authMixin,
    uploadMixin,
    addressMixin,
    dateMixin,
    uTcDate,
  ],
  middleware: [
    'authenticated',
    'not-blocked',
    'not-deleted',
    'verified',
    'view-set',
  ],
  data() {
    return {
      email: '',
      first_name: '',
      middle_name:'',
      last_name: '',
      fetchingMedHistory: false,
      user: {},
      user_uuid: null,
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
      date_of_birth: null,
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
      recordId: 0,
      tabs: [
          {
          key: 0,
          tab: 'Allergies',
          data: '',
        },

        {
          key: 1,
          tab: 'Current-Medication',
          data: '',
        },
        {
          key: 2,
          tab: 'Pharmacies',
          data: '',
        },
        {
          key: 3,
          tab: 'Past-Medication',
          data: '',
        },
        {
          key: 4,
          tab: 'Medical-History',
          data: '',
        },
        {
          key: 5,
          tab: 'Surgical-History',
          data: '',
        },
        {
          key: 6,
          tab: 'Social-History',
          data: '',
        },
        {
          key: 7,
          tab: 'Family-History',
          data: '',
        },
      ],
      // Copy All Data
      yes: false,
      no: true,
      // Insured Information
      number4: { insuredName: '', insuredContract: '', insuredPolicy: '', insuredGroup: '' },
      number4_2: { insuredName: '', insuredContract: '', insuredPolicy: '', insuredGroup: '' },
      number5: {
        patientAddress: '',
        patientCity: '',
        patientState: '',
        patientZipcode: '',
        patientTelephone: '',
      },
      number6: '',
      number6_2: '',
      number7: {
        insuredAddress: '',
        insuredCity: '',
        insuredState: '',
        insuredZipcode: '',
        insuredTelephone: '',
        insuredContract: '',
        insuredPolicy: '',
        insuredGroup: '',
      },
      number7_2: {
        insuredAddress: '',
        insuredCity: '',
        insuredState: '',
        insuredZipcode: '',
        insuredTelephone: '',
        insuredContract: '',
        insuredPolicy: '',
        insuredGroup: '',
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
      number11_2: {
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
      insuredBirthDay: null,
      secondInsuredBirthDay: null,
      insuredSign: '',
      patientSign: '',
      patientSignDate: new Date(),
      relations: ['Self', 'Spouse', 'Child', 'Other'],
      sexs: ['male', 'female'],
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
        value: '',
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
    name() {
      return this.user.user_first_name + ' ' + this.user.user_last_name
    },
    country(){return this.selectedCountry.id},
  },
  watch: {
    categories() {
      this.specialty = null
    },
    category(v) {
      if (v && this.isModerator) {
        this.loadingSpec = true
        this.$api
          .get('/specialty/' + v)
          .then(({ data }) => {
            this.specialties = data
            if (this.specialties && this.specialties.length <= 0) {
              this.$toast.error('No specialties found')
            }
          })
          .catch(() => {
            this.$toast.error('Unable to get specialties')
          })
          .finally(() => {
            setTimeout(() => {
              this.loadingSpec = false
            }, 600)
          })
      }
    }
  },
  mounted() {
    this.getuser()
    
    this.$api.get('/medical-record/?template=key').then((x) => {
     
    })
    this.$api
      .get('/category')
      .then(({ data }) => {
        if (data) {
          this.categories = data
        
          this.getMyRecord()
        }
      })
      .catch(() => {
        this.$toast.error('Failed to load categories.')
      })
    this.$api
      .get(
        '/medical-record/record/' + this.user_uuid
      )
      .then(({ data }) => {
        if(data.length > 0) {
          this.recordId = data[0].mere_uuid;
          this.tabs[0].data = data[0].mere_allergies;
          this.tabs[1].data = data[0].mere_current_meds;
          this.tabs[2].data = data[0].mere_pharmicies;
          this.tabs[3].data = data[0].mere_past_meds;
          this.tabs[4].data = data[0].mere_medical_history;
          this.tabs[5].data = data[0].mere_surgical_history;
          this.tabs[6].data = data[0].mere_social_history;
          this.tabs[7].data = data[0].mere_family_history;
        }
      })
  },
  methods: {
    
    async updateMedHistory(tab, data) {
      const tabName = tab.toLowerCase()
      if (!this.fetchingMedHistory) {
        this.fetchingMedHistory = true
        await this.$api
          .patch('/medical-record/' + tabName + '/' + this.$auth.user.uuid, {
            v: data,
          })
          .then((res) => {
            this.fetchingMedHistory = false
            console.log(res)
          })
          .catch((err) => {
            this.fetchingMedHistory = false
            console.log(err.data)
          })
      }
    },
     getuser() {
      const q = this.$route.params
      this.user_uuid = q.uuid
      this.owner=this.user_uuid
      if (this.user_uuid) {
        this.$userApi.get('/' + this.user_uuid).then(({ data }) => {
          if (data && data.user_uuid) {
            this.user = data
            this.first_name = this.user.user_first_name
            this.middle_name=this.user.user_middle_name
            this.last_name = this.user.user_last_name
            this.email = this.user.user_email
            this.user_country=data.user_country||''
            this.phone_no = data.user_phone_no
            this.date_of_birth = this.fromUTC(data.user_date_of_birth)
            this.country_code =  data.user_country_code?`+${data.user_country_code}`:''
            
            this.picture = data.user_picture
          }
            console.log(this.user)
            
          this.getInsuranceClaimInfo()
        })
      }
    },

    getInsuranceClaimInfo() {
      this.$insuranceApi
        .get(`/insured/?id=${this.user_uuid}`)
        .then(({ data }) => {
          if (data && Object.keys(data).length > 0) {
            console.log('insured --->', data)
            this.number4 = data.number4
            this.number5 = data.number5
            this.number6 = data.number6
            this.number7 = data.number7
            this.number11 = data.number11
            this.number12 = data.number12
            this.number13 = data.number13
            this.number17 = data.number17

            if(data.number4_2) {
              this.number4_2 = data.number4_2
            }
            this.number4 = data.number4
            this.number5 = data.number5
            this.number6 = data.number6
            if(data.number6_2) {
              this.number6_2 = data.number6_2
            }

            this.number7 = data.number7
            if(data.number7_2) {
              this.number7_2 = data.number7_2
            }
            this.number11 = data.number11
            if(data.number11_2) {
              this.number11_2 = data.number11_2
            }

            // console.log(this.number11.a)
            if (this.number11.a && this.number11.a.dd) {
              const date = `${this.number11.a.mm}-${this.number11.a.dd}-${this.number11.a.yy}`
              this.insuredBirthDay = new Date(date)
            }

            if (this.number11_2.a && this.number11_2.a.dd) {
              const date = `${this.number11_2.a.mm}-${this.number11_2.a.dd}-${this.number11_2.a.yy}`
              this.secondInsuredBirthDay = new Date(date)
            }
          }

          if (this.user) {
            this.number5.patientAddress =
              this.number5.patientAddress || this.user.addr_line1
            this.number5.patientCity =
              this.number5.patientCity || this.user.addr_city
            this.number5.patientState =
              this.number5.patientState || this.user.addr_state
            this.number5.patientZipcode =
              this.number5.patientZipcode || this.user.addr_zip
            this.number5.patientTelephone =
              this.number5.patientTelephone || this.user.user_phone_no
            this.number5.patientName =
              this.number5.patientName ||
              this.user.user_first_name + ' ' + this.user.user_last_name
          }
        })
        .catch(() => {
          this.$toast.error('Failed to load insurance.')
        })

      this.$insuranceApi
        .get(`/claims/?id=${this.user_uuid}`)
        .then(({ data }) => {
          if (data && Object.keys(data).length > 0) {
            console.log('claims --->', data)
            this.number25 = data.number25
            this.number26 = data.number26
            this.number31 = data.number31
            this.number32 = data.number32
            this.number33 = data.number33
          }
        })
        .catch(() => {
          this.$toast.error('Failed to load categories.')
        })
    },
    uploadPicture() {
      // this.loadingUpload = true
      // const data = new FormData()
      // data.append('file', this.file)
      // this.$userApi
      //   .post('/picture', data)
      //   .then(({ data }) => {
      //     this.$toast.success('Your profile picture has been updated.')
      //     this.src = ''
      //     this.showUploadPicture = false
      //     this.picture = data.file
      //   })
      //   .catch((err) => {
      //     this.$refs.rmodal.$emit('error', err)
      //   })
      //   .finally(() => {
      //     this.loadingUpload = false
      //   })
    },
    cancelUpload() {
      if (!this.loadingUpload) {
        this.src = ''
        this.showUploadPicture = false
      }
    },
    handleChange(info) {
      if (info && info.file) {
        this.getSrcInfo(info)
        this.file = info.file.originFileObj
      }
    },
    handleUpload() {
      // const { fileList } = this
      // const formData = new FormData()
      // fileList.forEach((file) => {
      //   formData.append('file', file)
      // })
      // formData.append('type', this.type)
      // this.loadingUpload = true
      // this.$api
      //   .post(this.computedAction, formData, {
      //     onUploadProgress: (evt) => {
      //       this.onProgress(evt)
      //     },
      //   })
      //   .then(() => {
      //     this.fileList = []
      //     this.$message.success(this.$t('upl_succ').toString())
      //     setTimeout(() => {
      //       this.handleRemove()
      //       this.umUploadProgress = 0
      //     }, 1000)
      //   })
      //   .catch(() => {
      //     this.$message.error(this.$t('upl_fail').toString())
      //   })
      //   .finally(() => {
      //     this.loadingUpload = false
      //   })
    },
    beforeUpload(file) {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
      if (!isJpgOrPng) {
        this.$message.error('You can only upload JPG file!')
      }
      const isLt2M = file.size / 1024 / 1024 < 6
      if (!isLt2M) {
        this.$message.error('Image must smaller than 6MB!')
      }
      return isJpgOrPng && isLt2M
    },
    getMyRecord() {
      this.$api
        .get('/professional/my-record')
        .then(({ data }) => {
          if (data) {
            this.category = data.profe_cate_id
            this.isComplete =
              data.profe_specialty &&
              data.profe_practice_name &&
              data.profe_medical_license &&
              data.profe_license_state &&
              data.profe_credentials

            if (!this.isComplete) {
              this.showTabs = false
              this.tab = 4
              setTimeout(() => {
                this.$nextTick(() => {
                  this.showTabs = true
                })
              }, 100)
            }

            if (this.isModerator) {
              this.npi = data.profe_npi
              this.practice_name = data.profe_practice_name
              this.medical_license = data.profe_medical_license
              this.license_state = data.profe_license_state
              this.credentials = data.profe_credentials
              if (data.profe_spec_id) {
                this.specialty = data.profe_spec_id
              }
            }
            if (this.$refs.profAddr) {
              this.$refs.profAddr.$emit('refresh')
            }
          }
        })
        .finally(() => {
          this.loadingPage = false
        })
    },
    handleSubmit() {
      
      this.$refs.personalForm.validate()
      if (this.validPersonalForm) {
        this.loading = true
        this.$api
        .put('/user', {
            user_uuid: this.$route.params.uuid,
            country_code: this.selectedCountry.phone,
            user_country:this.selectedCountry.name,
            phone_no: this.pnumber,
            addr_is_patient: this.user.add_is_patient||false,
            line1: this.line1,
            city: this.city,
            state: this.state,
            zip: this.zip,
            first_name: this.first_name,
            last_name: this.last_name,
            middle_name:this.middle_name,
            user_email: this.email,
            date_of_birth: new Date(this.date_of_birth).toISOString(),
          })
          .then(() => {
            setTimeout(() => {
              this.getuser()
              console.log('Fetched user --->', this.$auth.user)
              this.$toast.success(this.$t('updated_suc').toString())
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
    saveProfessional() {
      this.$refs.profForm.validate()
      if (this.validProfForm) {
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
          zip: this.zip,
        }
        this.loadingSaveP = true
        this.$api
          .put('/user/', values)
          .then(() => {
            this.$toast.success(this.$t('updated_suc').toString())
          })
          .catch((e) => {
            this.$refs.rmodal.$emit('error', e)
          })
          .finally(() => {
            this.loadingSaveP = false
          })
      }
    },

    saveClaims() {
      this.$refs.claimsForm.validate()
      if (this.validClaimsForm) {
        const data = {
          user_uuid: this.user_uuid,
          claims_info: {
            number25: this.number25,
            number26: this.number26,
            number31: this.number31,
            number32: this.number32,
            number33: this.number33,
          },
        }
        this.loadingSaveP = true
        this.$insuranceApi
          .post('/claims/save', data)
          .then(() => {
            this.$toast.success(this.$t('updated_suc').toString())
          })
          .catch((e) => {
            this.$refs.rmodal.$emit('error', e)
          })
          .finally(() => {
            this.loadingSaveP = false
          })
      }
    },
    saveInsured() {
      this.$refs.insuredForm.validate()
      if (this.validInsuredForm) {
        if (this.insuredBirthDay) {
          const insuredDate = this.insuredBirthDay
            .toISOString()
            .substr(0, 10)
            .split('-')

          this.number11.a.yy = insuredDate[0]
          this.number11.a.mm = insuredDate[1]
          this.number11.a.dd = insuredDate[2]
        }

        if (this.secondInsuredBirthDay) {
          const insuredDate = this.secondInsuredBirthDay
            .toISOString()
            .substr(0, 10)
            .split('-')
          this.number11_2.a.yy = insuredDate[0]
          this.number11_2.a.mm = insuredDate[1]
          this.number11_2.a.dd = insuredDate[2]
        }

        this.number12.date = this.patientSignDate.toISOString().substr(0, 10)

        const data = {
          user_uuid: this.user_uuid,
          insured_info: {
            number4: this.number4,
            number4_2: this.number4_2,
            number5: this.number5,
            number6: this.number6,
            number6_2: this.number6_2,
            number7: this.number7,
            number7_2: this.number7_2,
            number11: this.number11,
            number11_2: this.number11_2,
            number12: this.number12,
            number13: this.number13,
            number17: this.number17,
          },
        }
        this.loadingSaveP = true
        this.$insuranceApi
          .post('/insured/save', data)
          .then(() => {
            this.$toast.success(this.$t('updated_suc').toString())
          })
          .catch((e) => {
            this.$refs.rmodal.$emit('error', e)
          })
          .finally(() => {
            this.loadingSaveP = false
          })
      }
    },

    saveMedicalHistory() {
      console.log("Save Medical History");
      this.loadingSaveP = true;
      const values = {
        allergies: this.tabs[0].data,
        current_meds: this.tabs[1].data,
        pharmacies: this.tabs[2].data,
        past_meds: this.tabs[3].data,
        medical_history: this.tabs[4].data,
        surgical_history: this.tabs[5].data,
        social_history: this.tabs[6].data,
        family_history: this.tabs[7].data,
        recordId: this.recordId
      }
      this.loadingSaveP = true
      this.$api
        .put('/medical-record/record/' + this.user_uuid, values)
        .then(() => {
          this.$toast.success(this.$t('updated_suc').toString())
        })
        .catch((e) => {
          this.$refs.rmodal.$emit('error', e)
        })
        .finally(() => {
          this.loadingSaveP = false
        })
    },

    checkCopy(value) {
      if (value) {
        this.yes = true
        this.no = false
      } else {
        this.yes = false
        this.no = true
      }
      if (this.yes) {
        this.number4.insuredName = this.number5.patientName
        this.number7.insuredAddress = this.number5.patientAddress
        this.number7.insuredCity = this.number5.patientCity
        this.number7.insuredState = this.number5.patientState
        this.number7.insuredZipcode = this.number5.patientZipcode
        this.number7.insuredTelephone = this.number5.patientTelephone
        this.insuredBirthDay = new Date(this.user.user_date_of_birth)

        this.number4_2.insuredName = this.number5.patientName
        this.number7_2.insuredAddress = this.number5.patientAddress
        this.number7_2.insuredCity = this.number5.patientCity
        this.number7_2.insuredState = this.number5.patientState
        this.number7_2.insuredZipcode = this.number5.patientZipcode
        this.number7_2.insuredTelephone = this.number5.patientTelephone
        this.secondInsuredBirthDay = new Date(this.user.user_date_of_birth)
      }

      if (this.no) {
        this.number4.insuredName = null
        this.number7.insuredAddress = null
        this.number7.insuredCity = null
        this.number7.insuredState = null
        this.number7.insuredZipcode = null
        this.number7.insuredTelephone = null
        this.insuredBirthDay = null

        this.number4_2.insuredName = null
        this.number7_2.insuredAddress = null
        this.number7_2.insuredCity = null
        this.number7_2.insuredState = null
        this.number7_2.insuredZipcode = null
        this.number7_2.insuredTelephone = null
        this.secondInsuredBirthDay = null
      }
    },
  },
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
