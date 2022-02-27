<template>
  <div class="mh-100v">
    <v-row class='mb-1'>
      <v-col>
        <v-breadcrumbs :items="[
          {
            text: $t('dashboard'),
            disabled: true
          },
          {
            text: $t('list_usrs'),
            disabled: false,
            to: localePath('/dashboard'),
          },
          {
            text: $t('list_usrs'),
            disabled: true,
          }

        ]"></v-breadcrumbs>
      </v-col>
    </v-row>
    <v-row>
      <v-col md="6" offset-md="3">
        <p class='h4 mb-1 text-center'>{{ $t('add_urs') }}</p>
        <v-form ref='form' v-model="valid" @submit.prevent='handleSubmit'>
          <div>
            <v-text-field v-model="email" type="search" :autocomplete="false" label="Email" :rules="[v => !!v || $t('v.email_req'), v => !!v && v.length <= 150 || $t('v.max_email_150')]" prepend-inner-icon="mdi-email"></v-text-field>
          </div>
          <v-row>
            <v-col>
              <div>
                <v-text-field v-model="first_name" :placeholder="$t('fn')" :label="$t('fn')" :rules="[v => !!v ||  $t('v.fn_req'), v => !!v && v.length > 2 || $t('v.min_3', v => !!v && v.length <= 30 || $t('v.max_30'))]"></v-text-field>
              </div>
            </v-col>
            <v-col>
              <div>
                <v-text-field v-model="last_name" :placeholder="$t('ln')" :label="$t('ln')" :rules="[v => !!v ||  $t('v.fn_req'), v => !!v && v.length > 2 || $t('v.min_3', v => !!v && v.length <= 30 || $t('v.max_30'))]"></v-text-field>
              </div>
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
          <v-row>
            <v-col>
              <v-text-field v-model="password" :autocomplete="false" label="Password" prepend-inner-icon="mdi-lock" type="password" :rules="[v => !!v || $t('v.pwd_req'), v => !!v && v.length > 5 || $t('v.min_6')]"></v-text-field>
            </v-col>
            <v-col>
              <v-text-field v-model="confirm_password" :autocomplete="false" label="Confirm Password" prepend-inner-icon="mdi-lock" type="password" :rules="[v => !!v || $t('v.pwd_req'), v => !!v && v.length > 5 || $t('v.min_6')]"></v-text-field>
            </v-col>
          </v-row>
          <div class="mt-3">
            <v-btn small tile color='primary' type='submit' block :loading="loading">
              {{$t('add_urs')}}
            </v-btn>
          </div>
        </v-form>
      </v-col>
      <RequestModal ref='rmodal'></RequestModal>
    </v-row>
  </div>
</template>

<script>
import formMixin from '~/mixins/formMixin'

export default {
  name: 'AddUser',

  mixins: [formMixin],
  layout: 'dashboard',
  middleware: ['authenticated', 'verified', 'not-blocked', 'not-deleted'],
  data() {
    return {
      loading: false,
      email: '',
      first_name: '',
      last_name: '',
      password: '',
      confirm_password: '',
      valid: false,
      country_code: '',
      phone_no: null,
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
          content: this.$t('seo.add_user')
        }
      ]
    }
  },
  methods: {
    handleSubmit(e) {
      e.preventDefault()
      this.$refs.form.validate()
      if (this.valid) {
        this.loading = true
        const values = {
          first_name: this.first_name,
          last_name: this.last_name,
          email: this.email,
          password: this.password,
          confirm_password: this.confirm_password,
          phone_no: this.phone_no,
          country_code: this.country_code,
        }
        // values.dob = [this.year, this.month, this.day].join('-')
        this.$userApi
          .post('/add', values)
          .then(() => {
            this.$router.push(this.localePath('/users-list'))
          })
          .catch((e) => {
            this.$refs.rmodal.$emit('error', e)
          })
          .finally(() => {
            this.loading = false
          })
      }
    }
  },
}
</script>
