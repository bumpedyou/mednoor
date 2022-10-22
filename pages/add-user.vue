<template>
  <div class="mh-100v">
    <v-row class="mb-1">
      <v-col>
        <v-breadcrumbs
          :items="[
            {
              text: $t('dashboard'),
              disabled: true,
            },
            {
              text: isProfessional ? 'Patient\'s List' : $t('list_usrs'),
              disabled: false,
              to: localePath('/dashboard'),
            },
            {
              text: isProfessional ? 'Patient\'s List' : $t('list_usrs'),
              disabled: true,
            },
          ]"
        ></v-breadcrumbs>
      </v-col>
    </v-row>
    <v-row>
      <v-col md="6" offset-md="3">
        <p class="h4 mb-1 text-center">
          {{ isProfessional ? 'Add patient' : $t('add_urs') }}
        </p>
        <v-form ref="form" v-model="valid" @submit.prevent="handleSubmit">
         <!-- <v-row>
            
            <v-col>
              <div>
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
                  @change="generateEmail"
                ></v-text-field>
              </div>
            </v-col>
            <v-col>
              <div>
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
                  @change="generateEmail"
                ></v-text-field>
              </div>
            </v-col> 
          </v-row> -->
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
                      @change="generateEmail"
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
                      @change="generateEmail"
                    ></v-text-field>
                  </v-col>
                </v-row>
          <v-row>
            <v-col>
              <div>
                <v-text-field
                  v-model="email"
                  type="search"
                  :autocomplete="false"
                  label="Email"
                  disabled
                  prepend-inner-icon="mdi-email"
                ></v-text-field>
              </div>
            </v-col>
            <v-col>

                     <div>
                <v-text-field
                  v-model="dob"
                  type="search"
                  :label="$t('dob')"
                    placeholder="MM.DD.YYYY"
                  :autocomplete="false"
            
                  :rules="[(v) => !!v || $t('v.dob')]"
                ></v-text-field>
              </div>
              <!-- <div class="d-flex flex-column align-start">
                <label class="v-label theme--light" style="margin-bottom: 10px">
                  Date Of Birth:
                </label>
                <date-picker
                  v-model="dob"
                  type="date"
                  :rules="[(v) => !!v || $t('Date of Birth required')]"
                ></date-picker>
              </div> -->
            </v-col>
          </v-row>

          <v-row>
            <v-col sm="12" md="12">
            <PhoneNo :cc="country_code" :pn="phone_no" :uc="user_country"></PhoneNo>
          </v-col>
          </v-row>
          <v-row>
            <v-col sm="12" md="12">
              <UserAddress :ac="country" :owner="owner"></UserAddress>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-text-field
                v-model="password"
                :autocomplete="false"
                label="Password"
                prepend-inner-icon="mdi-lock"
                type="password"
              ></v-text-field>
            </v-col>
            <v-col>
              <v-text-field
                v-model="confirm_password"
                :autocomplete="false"
                label="Confirm Password"
                prepend-inner-icon="mdi-lock"
                type="password"
              ></v-text-field>
            </v-col>
          </v-row>
          <div class="mt-3">
            <v-btn
              small
              tile
              color="primary"
              type="submit"
              block
              :loading="loading"
            >
              {{ isProfessional ? 'Add patient' : $t('add_urs') }}
            </v-btn>
          </div>
        </v-form>
      </v-col>
      <RequestModal ref="rmodal"></RequestModal>
    </v-row>
  </div>
</template>

<script>

import formMixin from '~/mixins/formMixin'
import userRoleMixin from '~/mixins/userRoleMixin'
import UserAddress from '~/components/UserAddress'
import addressMixin from '~/mixins/addressMixin'
import PhoneNo from '~/components/phoneNo'
import phoneNoMixin from '~/mixins/phoneNoMixin'
export default {
  name: 'AddUser',
  comments:{
    UserAddress,PhoneNo
  },
  mixins: [formMixin, userRoleMixin,addressMixin,phoneNoMixin],
  layout: 'dashboard',
  middleware: ['authenticated', 'verified', 'not-blocked', 'not-deleted'],
  data() {
    return {
      startDateMenu: false,
      loading: false,
      email: ``,
      first_name: '',
      middle_name:'',
      last_name: '',
      password: '',
      owner:'',
      confirm_password: '',
      valid: false,
      country_code: '+1',
      user_country:'',
      phone_no: null,
      dob: '',
    }
  },
  head() {
    return {
      title: this.$t('add_urs'),
      meta: [
        // hid is used as unique identifier. Do not use `vmid` for it as it will not work
        {
          hid: 'description',
          name: 'description',
          content: this.$t('seo.add_user'),
        },
      ],
    }
  },
  computed:{
    country(){return this.selectedCountry.id},
  },
  
  methods: {
    generateEmail() {
      console.log(this.first_name, this.last_name)
      if (this.first_name && this.last_name) {
        this.email = `${String(this.first_name).trim().toLowerCase()}.${String(this.last_name).trim().toLowerCase()}@pronoor.com`
      }
    },
    handleSubmit(e) {
      e.preventDefault()
      this.$refs.form.validate()

      if (!this.dob) {
        const err = {
          response: { message: 'Date of birth required', status: 400 },
        }
        this.$refs.rmodal.$emit('error', err)
        return
      }
      if(this.dob){
        const isValid = this.dob.split(".").length===3
        console.log(isValid)
        if(!isValid){
              const err = {
          response: { message: 'Invalid date formate ', status: 400 },
        }
        this.$refs.rmodal.$emit('error', err)
        }
      }

      if (this.password) {
        if (this.password !== this.confirm_password) {
          const err = {
            response: { message: 'Password not match', status: 400 },
          }
          this.$refs.rmodal.$emit('error', err)
          return
        }
      }
      if (this.valid) {
        const _dob = this.dob.split('.')
        this.loading = true
        const values = {
          first_name: this.first_name,
          middle_name:this.middle_name,
          last_name: this.last_name,
          email: this.email,
          password: this.password,
          confirm_password: this.confirm_password,
          phone_no: this.number,
          country_code: this.selectedCountry.phone,
          user_country:this.selectedCountry.name,
          state:this.state,
          city:this.city,
          zip:this.zip,
          address:this.line1,
          date_of_birth: _dob.join('-'),
        }

        //  console.log(this.isProfessional)

        console.log(values)

            const url = this.isProfessional ? '/add-patient' : '/add-patient'
        this.$userApi
          .post(url, values)
          .then((r) => {
            if(this.$route.query && this.$route.query.redirect){
                this.$router.push(this.localePath('/'+this.$route.query.redirect))
            } else{
            this.$router.push(this.localePath('/users-list'))
            }
          
          })
          .catch((err) => {
            console.log(err)
            this.$refs.rmodal.$emit('error', err)
          })
          .finally(() => {
            this.loading = false
          })
      }
    },
  },
}
</script>
