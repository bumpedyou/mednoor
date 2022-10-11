<template>
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
                  <!-- country code -->
                  <v-col sm="2" md="2">
                    <v-combobox 
                      v-model="global_lists.selected_country"
                      :hint="`${global_lists.selected_country.name} ${' '} ${global_lists.selected_country.code}`"
                      :items="global_lists.countries_list"
                      item-value="name"
                      item-text="name"
                      :label="$t('country_code')"
                      persistent-hint 
                      auto-select-first
                      return-object
                      :rules="[v => !!v || $t('v.country_code'), v => !!v &&v.name && v.name.length >=4 || $t('v.country_code')]"
                      @change="handleSelectCountry"
                      >
                      <template #[`item`] = "{item}">
                       <v-row   ma-0 pa-0 fill-height  >
                        <v-col  cols="2" ><div>
                              <v-avatar tile>
                                {{item.phone}}
                              </v-avatar>
                            </div></v-col>
                          <v-col cols="7"><div>
                            <v-avatar tile width="250">{{item.name}}</v-avatar>
                          </div></v-col>
                          <v-col cols="2">
                          <v-avatar tile><v-img :src="`https://flagcdn.com/${item.alpha2.toLowerCase()}.svg`" max-height="20" max-width="30"  ></v-img></v-avatar>
                        </v-col>
                            
                       </v-row>
                      </template>
                      <template slot="selection"   >
                        <v-avatar  tile size="25%" >
                          <v-img v-if="global_lists.selected_country.alpha2" :src="`https://flagcdn.com/${global_lists.selected_country.alpha2.toLowerCase()}.svg`" max-height="20" max-width="30"  ></v-img>
                        </v-avatar>
                        <v-avatar  tile size="75%">{{global_lists.selected_country.phone}}</v-avatar>   
                      </template>
                    </v-combobox>
                  </v-col>
                  <v-col sm="3" md="3">
                    <v-text-field v-model="phone_no"  :value="phone_no" :placeholder="$t('phone_no')" :label="$t('phone_no')" maxlength="10" :hint="`${global_lists.selected_country.phone}${' '}${phone_no}`"
                  :rules="[v => !!v || $t('v.phone_req'), v => !!v && v.length >=10 || $t('v.min_10')]" 
                  persistent-hint	
                  @keypress="handlePhone"
                  ></v-text-field> 
                  </v-col>
                  <v-col sm="3" md="3">
                    <v-combobox
                      v-model="global_lists.selected_state"
                      :hint="`${global_lists.selected_state.code} `"
                      :items="global_lists.state_list"
                      item-value="name"
                      item-text="name"
                      :label="$t('state')"
                      persistent-hint
                      auto-select-first
                      return-object
                      :rules="[v => !!v || $t('v.state'), v => !!v && v.name && v.name.length >=1 || $t('v.state')]"
                      @change="handleSelectState"
                      >  
                    </v-combobox>
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
                <v-row >
                <v-col md="8" sm="8">
                  <v-text-field v-model="user_addr.address"  :autocomplete="false" :label="$t('address')" :rules="[v => !!v ||  $t('v.address_req'), v => !!v  && v.length >= 10  || $t('v.min_10', v => !!v && v.length <= 30 || $t('v.max_30'))]"></v-text-field>
                </v-col>
                <v-col  md="2" sm="2">
                  <v-combobox
                      v-model="global_lists.selected_city"
                      :items="global_lists.city_list"
                      item-value="name"
                      item-text="name"
                      :label="$t('city')"
                      return-object
                      auto-select-first
                      :rules="[v => !!v || $t('v.city'), v => !!v && v.name && v.name.length >=1 || $t('v.city')]"
                      @change="handleSelectCity"
                      >  
                      </v-combobox>
                </v-col>
                <v-col  md="2" sm="2">
                  <v-combobox
                      v-model="global_lists.selected_zip"
                      :items="global_lists.zip_list"
                      item-value="code"
                      item-text="code"
                      :label="$t('zip_code')"
                      return-object
                      auto-select-first
                      :rules="[v => !!v || $t('v.zip'), v => !!v && v.code && v.code.length >=1 || $t('v.zip')]"
                      @change="handleSelectZip"
                      >  
                  </v-combobox>
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

import addressMixin from '~/mixins/addressMixin'
import uTcDate from '~/mixins/uTcDate'
import 'vue2-datepicker/index.css'
import dateMixin from '~/mixins/dateMixin'
export default {
  name: 'MyProfile',
  components: {
    ProfilePicture,
    SpinOrText,
    RequestModal,
    DatePicker,
  },
  mixins: [
    userRoleMixin,
    inputMixin,
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
      global_lists:{
        countries_list:[],
        selected_country:{ id:"d2b7d01d-33c6-45e8-9fac-24fcbc386e17",code: "USA",name: "United States of America",alpha2: "US",phone: "+1",capital: "DCA"},
      state_list:[],
      selected_state:{code: "AL",id: "110c1a91-fb92-41e8-b40d-37d3befefafe",name:"Alabama"},
      city_list:[],
      selected_city:{id:"81db56a1-a665-46b7-8df0-6e59fba0e7c0",name:"Abernant"},
      zip_list:[],selected_zip:{id:"072afa05-c93c-4a78-9b8f-8b7427c42124",code:"35440"}
      },user_addr:{
        country:'',
        state:'',
        address:'',
        city:'',
        zip_code:'',
      },
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
    },
    zip(v) {
      if (v) {
        this.zip = this.numbersOnly(v)
      }
    },
  },
  mounted() {
    this.getuser()
    
    this.$api.get('/medical-record/?template=key').then((x) => {
      //console.log('res', x)
      // res {data: Array(6), status: 200, statusText: 'OK', headers: {…}, config: {…}, …}
    })
    this.$api
      .get('/category')
      .then(({ data }) => {
        if (data) {
          this.categories = data
         // console.log('Categories --->', data)
         //Categories ---> (4) [{…}, {…}, {…}, {…}, __ob__: Observer]
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
        //console.log(data);
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
    async handleSelectCountry(){
      const selectedCountry= this.global_lists.selected_country
      if (selectedCountry===null || selectedCountry==="" || !selectedCountry.id){
        this.global_lists.selected_country={ id:"",code: "",name: "",alpha2: "",phone: "",capital: ""}
        this.global_lists.state_list=[]
        this.global_lists.selected_state={code: "",id:"",name:""}
        this.global_lists.city_list=[]
        this.global_lists.selected_city={id:'',name:''}
        this.global_lists.zip_list=[]
        this.global_lists.selected_zip={id:"",code:""}
        return 
      }
       const res = await this.$globalApi.get('/state',{params:{country:this.global_lists.selected_country.id}})
          if (res.data.length>0){this.global_lists.state_list = res.data.map(s=>{
            return {code:s.code,id:s.id,name:s.name}
          })}
          else {this.global_lists.state_list = [{code: "N/A",id:"N/A",name:"N/A"}]}
          this.global_lists.selected_state=this.global_lists.state_list[0]
          this.user_addr.country=this.global_lists.selected_country.name
          this.country_code=this.global_lists.selected_country.phone
            this.handleSelectState()
      },
      async handleSelectState(){
        const selectedState = this.global_lists.selected_state
        if (selectedState===null || selectedState==="" || !selectedState.id){
        this.global_lists.selected_state={code: "",id:"",name:""}
        this.global_lists.city_list=[]
        this.global_lists.selected_city={id:'',name:''}
        this.global_lists.zip_list=[]
        this.global_lists.selected_zip={id:"",code:""}
        return 
      }
        const res = await this.$globalApi.get('/city',{params:{state:selectedState.id}})
        if (res.data.length>0){this.global_lists.city_list = res.data.map(c=>{
          return {id:c.id,name:c.name}
        })}
        else {this.global_lists.city_list = [{id:"N/A",name:"N/A"}]}
        this.global_lists.selected_city=this.global_lists.city_list[0]
        this.user_addr.state=this.global_lists.selected_state.name
        this.handleSelectCity()
      },
      async handleSelectCity(){
        const selectedCity = this.global_lists.selected_city
        if (selectedCity===null || selectedCity==="" || !selectedCity.id){
        this.global_lists.selected_city={id:'',name:''}
        this.global_lists.zip_list=[]
        this.global_lists.selected_zip={id:"",code:""}
        return 
      }
        const res= await this.$globalApi.get('/zip',{params:{city:selectedCity.id}})
        if (res.data.length>0){this.global_lists.zip_list = res.data.map(z=>{
          return {id:z.id,code:z.code}
        })}
        else {this.global_lists.zip_list=[{id:"N/A",code:"N/A"}]}
        this.global_lists.selected_zip=this.global_lists.zip_list[0]
        this.user_addr.city=this.global_lists.selected_city.name
        this.handleSelectZip()
      },
      handleSelectZip(){
        const selectedZip = this.global_lists.selected_zip
        if (selectedZip===null || selectedZip==="" || !selectedZip.id){
        this.global_lists.selected_zip={id:"",code:""}
        return 
      }
        this.user_addr.zip_code=this.global_lists.selected_zip.code
      },
       handlePhone(e){
        if ( !e )e = window.event 
      const val = e.target.value.toString() + e.key.toString();
      return  !/^[-+]?[0-9]*\.?[0-9]*$/.test(val)? e.preventDefault():true 
      },
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
    async getuser() {
      const q = this.$route.params
      this.user_uuid = q.uuid
      let res = await this.$globalApi.get('/country')
      res= res.data.filter(c=>{
        return c.name && c.name.length>3 
      })
          this.global_lists.countries_list=res.map(c=>{
            return { 
            id:c.id, code: c.code?c.code:"N/A",
            name: c.name,
            alpha2: c.alpha2?c.alpha2:c.code?c.code.substr(0,2):c.name.substr(0,2),
            phone: c.phone?c.phone.startsWith("+")?c.phone: `+${c.phone}`:"+00",
            capital: c.capital
          }
          })
      
      if (this.user_uuid) {
        this.$userApi.get('/' + this.user_uuid).then(({ data }) => {
          if (data && data.user_uuid) {
            this.user = data
            this.first_name = this.user.user_first_name
            this.middle_name=this.user.user_middle_name
            this.last_name = this.user.user_last_name
            this.email = this.user.user_email
            this.phone_no = data.user_phone_no?data.user_phone_no:''
            this.date_of_birth = this.fromUTC(data.user_date_of_birth)
            this.country_code = '+' + data.user_country_code
            this.user_addr.address=this.user.user_address
            this.user_addr.city=this.user.user_city
            this.user_addr.state=this.user.user_state
            this.user_addr.zip_code=this.user.user_zip_code
            this.picture = data.user_picture
            this.number5.patientAddress=this.user.user_address
            this.number5.patientTelephone=this.phone_no
            this.number5.patientCity=this.user_addr.city
            this.number5.patientState=this.user_addr.state
            this.number5.patientZipcode=this.user_addr.zip_code
          }
          
          const phone= this.user.user_country_code?`+${this.user.user_country_code}`:this.global_lists.selected_country.phone
          const country=this.user.user_country?this.user.user_country: this.global_lists.selected_country.name
          this.global_lists.selected_country=this.global_lists.countries_list.filter(c=>{
            return c.name === country
          })[0]
          this.user_addr.country=country
          this.country_code=phone
          this.$globalApi.get('/state',{params:{country:this.global_lists.selected_country.id}}).then(d=>{
            if (d.data.length){this.global_lists.state_list=d.data.map(s=>{
              return {code: s.code,id:s.id,name:s.name}
            })}
            else{
              this.global_lists.state_list=[{code:'N/A',id:'N/A',name:'N/A'}]
            }
            if (this.user.user_state&& this.global_lists.state_list.length>1){
              this.global_lists.selected_state=this.global_lists.state_list.filter(s=>{
                return s.name=== this.user.user_state
              })[0]
            }
            else{this.global_lists.selected_state=this.global_lists.state_list[0]}
            this.user_addr.state= this.global_lists.selected_state.name
            this.$globalApi.get('/city',{params:{state:this.global_lists.selected_state.id}}).then(d=>{
              if (d.data.length){
                this.global_lists.city_list=d.data.map(c=>{
                  return {id:c.id,name:c.name}
                })
              }
              else {this.global_lists.city_list=[{id:"N/A",name:"N/A"}]}
              if(this.user.user_city && this.global_lists.city_list.length>1){
                this.global_lists.selected_city=this.global_lists.city_list.filter(c=>{
                  return c.name===this.user.user_city
                })[0]
              }
              else{this.global_lists.selected_city= this.global_lists.city_list[0]}
              this.user_addr.city=this.global_lists.selected_city.name
              this.$globalApi.get('/zip',{params:{city:this.global_lists.selected_city.id}}).then(d=>{
                
                if(d.data.length){
                  this.global_lists.zip_list=d.data.map(z=>{
                    return {id:z.id,code:z.code}
                  })
                }
                else{
                  this.global_lists.zip_list=[{id:"N/A",code:"N/A"}]
                  }
                if (this.user.user_zip_code && this.global_lists.zip_list.length>1){
                  this.global_lists.selected_zip=this.global_lists.zip_list.filter(z=>{
                    return Number(z.code) === Number(this.user.user_zip_code)
                  })[0]
                }
                else{this.global_lists.selected_zip=this.global_lists.zip_list[0]}
              })
            })
            
          })
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
            user_uuid: this.user_uuid,
            country_code: this.country_code,
            phone_no: this.phone_no,
            is_patient: false,
            city: this.user_addr.city,
            state: this.user_addr.state,
            country:this.user_addr.country,
            zip: this.user_addr.zip_code,
            address:this.user_addr.address,
            first_name: this.first_name,
            middle_name:this.middle_name,
            last_name: this.last_name,
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
