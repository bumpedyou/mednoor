<template>
  <div class="mh-100v">
    <div>
      <v-row>
        <v-col class='mt-1' md="6" offset-md="3">
          <v-card>
            <v-card-title>
              <h1 class='text-center w-100'>{{ $t('reset_pwd') }}</h1>
            </v-card-title>
            <v-card-text>
              <p class='text-center'>
                <b>{{ email }}</b><br>
                {{ $t('reset_y_pwd') }}
              </p>
              <v-form ref="form" v-model="valid" size='small' @submit='handleSubmit'>
                <v-row>
                  <v-col >
                    <div>
                      <v-text-field v-model="password" label="Password" prepend-inner-icon="mdi-lock" :rules="[

                        v => !!v || $t('v.pwd_req'),
                        v => !!v && v.length >= 6 || $t('v.min_6')

                    ]" :placeholder="$t('pwd')" type='password'>
                      </v-text-field>
                    </div>
                  </v-col>
                  <v-col>
                    <div >
                      <v-text-field v-model="confirm_password" label="Confirm password" prepend-inner-icon="mdi-lock-reset" :rules="[

                        v => !!v || $t('v.pwd_req'),
                        v => !!v && v.length >= 6 || $t('v.min_6')

                    ]"  :placeholder="$t('v.cpwd_req')" type='password'>
                      </v-text-field>
                    </div>
                  </v-col>
                </v-row>
                <v-btn block small tile color='primary' type='submit' class='mt-3' :loading="loading">
                  {{ $t('send_email') }}
                </v-btn>
              </v-form>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </div>
    <RequestModal ref='rmodal'></RequestModal>
  </div>
</template>

<script>

export default {
  name: 'ConfirmResetPassword',
  auth: false,

  data() {
    return {
      formLayout: 'horizontal',
      loading: false,
      password: '',
      confirm_password: '',
      valid: false,
    }
  },
  head() {
    return {
      title: this.$t('v.c_pwd_res'),
    }
  },
  computed: {
    email() {
      return this.$store.state.email
    },
    code() {
      return this.$store.state.code
    },
  },
  mounted() {
    if (!this.email || !this.code) {
      this.$router.push(this.localePath('/forgot-password'))
    }
  },
  methods: {
    handleSubmit(e) {
      e.preventDefault()
      this.$refs.form.validate()
      if (this.valid) {
        this.loading = true
        this.$userApi.patch('/password', {
          email: this.email,
          code: this.code,
          password: this.password,
          confirm_password: this.confirm_password,
        }).then(() => {
          this.$auth
            .loginWith('local', {
              data: {
                email: this.email,
                password: this.password,
              },
            })
            .then(() => {
              this.$toast.success('Your password has been updated.')
              this.$router.push(this.localePath('/'))
            })
            .catch((e) => {
              this.$router.push(this.localePath('/sign-in'))
            })
        }).catch((err) => {
          this.$refs.rmodal.$emit('error', err)
        }).finally(() => {
          this.loading = false
        })
      }

    },

  }
}
</script>
