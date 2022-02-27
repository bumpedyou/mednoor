<template>
  <div class="mh-100v">
    <v-row>
      <v-col class='mt-1' md="8" offset-md="2">
        <v-card class="mt-3">
          <v-card-title>
            <h1 class='h1 text-center'>{{ $t('change_pwd') }}</h1>
          </v-card-title>
          <v-card-text>
            <v-form ref="form" v-model="valid" size='small' @submit.prevent='handleSubmit'>
              <div>
                <v-text-field v-model="old_password" :rules="[
                  v => !!v || 'The password is required',
                  v => !!v && v.length >= 6 || $t('v.min_6')
                ]" label="Old password" prepend-inner-icon="mdi-lock-clock" :placeholder="$t('new_pwd')" type='password'>
                </v-text-field>
              </div>
              <v-row>
                <v-col md="6">
                  <div>
                    <v-text-field v-model="new_password" :rules="[
                  v => !!v || 'The password is required',
                  v => !!v && v.length >= 6 || $t('v.min_6')
                ]" label="New Password" :placeholder="$t('new_pwd')" type='password' prepend-inner-icon="mdi-lock">
                    </v-text-field>
                  </div>
                </v-col>
                <v-col md="6">
                  <div>
                    <v-text-field v-model="confirm_new_password" :rules="[
                  v => !!v || 'The password is required',
                  v => !!v && v.length >= 6 || $t('v.min_6')
                ]"  :placeholder="$t('v.c_npwd')" type='password' prepend-inner-icon="mdi-lock-reset">
                    </v-text-field>
                  </div>
                </v-col>
              </v-row>
              <div>
                <v-btn color='primary' small tile type='submit' block :loading="loading">
                  {{ $t('change_pwd') }}
                </v-btn>
              </div>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <RequestModal ref='rmodal'></RequestModal>
  </div>
</template>

<script>

export default {
  middleware: ['authenticated', 'not-blocked', 'not-deleted', 'verified'],
  data() {
    return {
      formLayout: 'horizontal',
      loading: false,
      valid: false,
      old_password: '',
      new_password: '',
      confirm_new_password: '',
    }
  },
  head() {
    return {
      title: this.$t('change_pwd'),
    }
  },
  methods: {
    handleSubmit() {
      this.$refs.form.validate()
      if (this.valid) {
        this.loading = true
        this.$userApi.post('/change-password', {
          old_password: this.old_password,
          password: this.new_password,
          confirm_password: this.confirm_new_password,
        }).then(() => {
          this.$router.push(this.localePath('/password-updated'))
        }).catch((e) => {
          this.$refs.rmodal.$emit('error', e)
        }).finally(() => {
            this.loading = false
          }
        )
      }
    },
  }
}
</script>
