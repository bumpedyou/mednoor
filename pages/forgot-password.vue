<template>
  <div class="mh-100v">
    <div>
      <v-row>
        <v-col class='mt-1' md='6' offset-md="3">
          <v-card>
            <v-card-title>
              <h1 class='text-center w-100'>{{ $t('forgot_pwd') }}</h1>
            </v-card-title>
            <v-card-text>
              <p class='text-center'>
                {{ $t('fpwd_desc') }}
              </p>
              <v-form ref='form' v-model="valid" @submit.prevent='handleSubmit'>
                <div class="mb-1">
                  <v-text-field v-model="email"
                                :rules="[
                    v => !!v || $t('v.email_req'),
                    v => !!v && v.length <= 150 || $t('v.max_email_150')
                  ]"
                                label="Email"
                                :placeholder="$t('email')"
                  />
                </div>
                <v-btn block color='primary' small tile type='submit' :loading="loading">
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
  name: 'ForgotPassword',
  auth: false,

  data() {
    return {
      formLayout: 'horizontal',
      loading: false,
      code: '',
      email: '',
      valid: false,
    }
  },
  head() {
    return {
      title: this.$t('forgot_pwd'),
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: this.$t('reset_pwd_desc')
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
        this.$userApi.post('/forgot-password', {
          email: this.email,
        }).then(() => {
          this.$store.commit('setEmail', this.email)
          this.$router.push({
            path: this.localePath('/reset-password'),
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
