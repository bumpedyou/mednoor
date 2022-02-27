<template>
  <div class="mt-9">
      <v-row>
        <v-col md="8" offset-md="2">
        <v-card class="mt-6 gradient-tw" dark elevation="22" outlined :loading="loading">
          <v-card-text>
          <h1 class="h4 text-center mb-6 dark">{{$t('sign_up')}}</h1>
            <v-form ref="form" v-model="validForm" @submit.prevent="handleSubmit">
              <v-row class="mb-0 mb-0 pb-0">
                <v-col md="12" class="my-0 py-0">
                  <v-text-field v-model="email" type="search" :autocomplete="false" label="Email" :rules="[v => !!v || $t('v.email_req'), v => !!v && v.length <= 150 || $t('v.max_email_150')]" prepend-inner-icon="mdi-email"></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col sm="4" md="3">
                  <v-text-field v-model="country_code" placeholder="Country code" label="Country code" maxlength="4"></v-text-field>
                </v-col>
                <v-col sm="8" md="9">
                  <v-text-field v-model="phone_no" placeholder="Phone number" label="Phone number" maxlength="10"></v-text-field>
                </v-col>
              </v-row>
              <v-row class="my-0 py-0">
                <v-col xs="12" md="6" class="my-0 py-0">
                  <v-text-field v-model="first_name" :placeholder="$t('fn')" :label="$t('fn')" :rules="[v => !!v ||  $t('v.fn_req'), v => !!v && v.length > 2 || $t('v.min_3', v => !!v && v.length <= 30 || $t('v.max_30'))]"></v-text-field>
                </v-col>
                <v-col xs="12" md="6" class="my-0 py-0">
                  <v-text-field v-model="last_name" :placeholder="$t('ln')" :label="$t('ln')" :rules="[v => !!v ||  $t('v.fn_req'), v => !!v && v.length > 2 || $t('v.min_3', v => !!v && v.length <= 30 || $t('v.max_30'))]"></v-text-field>
                </v-col>
              </v-row>
              <!--
              <v-row class="my-0 py-0">
                <v-col md="12" class="my-0 py-0">
                  <v-text-field v-model="date" label="Date of birth" placeholder="MM-DD-YYYY"></v-text-field>
                </v-col>
              </v-row>
              -->
              <v-row class="my-0 py-0">
                <v-col xs="12" sm="12" md="6" class="my-0 py-0">
                  <v-text-field v-model="password" :autocomplete="false" label="Password" prepend-inner-icon="mdi-lock" type="password" :rules="[v => !!v || $t('v.pwd_req'), v => !!v && v.length > 5 || $t('v.min_6')]"></v-text-field>
                </v-col>
                <v-col xs="12" sm="12" md="6" class="my-0 py-0">
                  <v-text-field v-model="confirm_password" :autocomplete="false" label="Confirm Password" prepend-inner-icon="mdi-lock" type="password" :rules="[v => !!v || $t('v.pwd_req'), v => !!v && v.length > 5 || $t('v.min_6')]"></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col class="my-0 py-0">
                  <div class="d-flex" style="align-items: center !important">
                    <v-checkbox v-model="agree" :true-value="true" :false-value="false" :label="$t('i_agree')" :rules="[v => !!v || 'You must agree.']" class="mr-1">
                    </v-checkbox>
                    <a :href="localePath('/terms-and-conditions')" target="_blank" class="dark-link">{{$t('terms_cond')}}</a>
                    <span class="mx-1">&</span>
                    <a :href="localePath('/privacy-policy')" target="_blank" class="dark-link">{{$t('privacy')}}</a>
                  </div>
                </v-col>
                <v-col md="12" class="py-0">
                  <v-btn color="primary" type="submit" tile small block :loading="loading">
                    {{$t('sign_up')}}
                  </v-btn>
                </v-col>
              </v-row>
              <v-row>

              </v-row>
              <div>
                <hr />
                <small class="text-center d-block mb-0 mt-3">
                  {{$t('alr_h_acc')}}
                </small>
                <small class='text-center d-block mt-3'>
                  <v-btn color="info" tile small :to="localePath('/sign-in')">{{$t('sign_in')}}</v-btn>
                </small>
              </div>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <RequestModal ref="rmodal"></RequestModal>
  </div>
</template>

<script>
import RequestModal from '~/components/RequestModal'
import formMixin from '~/mixins/formMixin'
import inputMixin from "~/mixins/inputMixin";
export default {
  components: {
    RequestModal,
  },
  mixins: [formMixin, inputMixin],
  layout: 'home',
  middleware: ['unauthenticated'],
  data() {
    return {
      loading: false,
      validForm: false,
      email: '',
      password: '',
      confirm_password: '',
      first_name: '',
      last_name: '',
      agree: false,
    }
  },
  head() {
    return {
      title: this.$t('sign_up'),
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: this.$t('seo.sign_up')
        }
      ]
    }
  },
  methods: {
    handleSubmit() {
      this.$refs.form.validate()
      if (this.validForm){
        this.loading = true
        this.$userApi
          .post('/register', {
            first_name: this.first_name,
            last_name: this.last_name,
            email: this.email,
            password: this.password,
            confirm_password: this.confirm_password,
            phone_no: this.phone_no,
            country_code: this.country_code,
            // dob: [this.year, this.month, this.day].join('-')
          })
          .then(async () => {
            try {
              await this.$auth
                .loginWith('local', {
                  data: {
                    email: this.email,
                    password: this.password
                  }
                })
                .then(() => {
                  // redirect
                })
                .catch((e) => {
                  this.$refs.rmodal.$emit('error', e)
                })
            } catch (e) {
              this.$refs.rmodal.$emit('error', e)
            }
          })
          .catch((e) => {
            this.$refs.rmodal.$emit('error', e)
          })
          .finally(() => {
            this.loading = false
          })
      }
    }
  }
}
</script>
