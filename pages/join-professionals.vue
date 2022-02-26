<template>
  <div class="pa-6 mh-100v">
    <v-row class='mb-1'>
      <v-col>
        <v-btn small tile color="success" @click='$router.push(localePath("/view-mode"))'>Go Back
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>
      </v-col>
    </v-row>
    <v-row v-if='loading'>
      <v-skeleton-loader></v-skeleton-loader>
    </v-row>
    <v-row v-else>
      <v-col md="12">
        <p class='h4 mb-1'>Required Information</p>
      </v-col>
      <v-col v-if="error" md="12">
        <p class="h1">
          Error while loading the data.
        </p>
        <p>
          Please Try again later
        </p>
      </v-col>
      <v-col v-else>
        <v-form ref="form" v-model="valid" @submit.prevent="handleSubmit">
          <v-row>
            <v-col md="12">
              <v-checkbox v-model='checked' :rules="[v => !!v || 'You have to check the checkbox']" label="I would like to be a new provider at Mednoor."></v-checkbox>
            </v-col>
            <v-col md="12">
              <v-text-field v-model="npi" :rules="[
                v => !!v || 'The NPI is required',
                v => !!v && v.length === 10 || 'The NPI must have exactly 10 characters']" placeholder="My NPI" maxlength="10"></v-text-field>
            </v-col>
            <v-col md="12">
              <v-autocomplete v-model="category" :rules="[v => !!v || 'The category is required']" :items="categories" item-text="cate_category" item-value="cate_id" placeholder="Enter a category">
              </v-autocomplete>
            </v-col>
          </v-row>
          <v-btn color="primary" small tile type="submit" :loading="loadingSubmit">
            Join Providers
          </v-btn>
        </v-form>
      </v-col>
    </v-row>
    <RequestModal ref="rmodal"></RequestModal>
  </div>
</template>

<script>

export default {
  name: "JoinProfessionals",
  middleware: ['authenticated', 'verified', 'not-blocked', 'not-deleted'],
  data() {
    return {
      category: '',
      categories: [],
      loadingSubmit: false,
      loading: true,
      error: false,
      checked: false,
      npi: '',
      valid: false,
    }
  },
  mounted() {
    this.$api.get('/professional/my-record').then(({data}) => {
      if (data && data.profe_uuid) {
        console.log(data)
        if (data.profe_is_active) {
          this.$router.push(this.localePath('/'))
        } else {
          this.$router.push(this.localePath('/thanks-for-applying'))
        }
      }
      this.$api.get('/category').then(({data}) => {
        if (data) {
          this.categories = data
        }
      }).catch((err) => {
        console.log(err)
        this.$toast.error('Failed to load categories.')
      })
    }).catch((err) => {
      console.log(err)
      this.error = true
    }).finally(() => {
      this.loading = false
    })
  },
  methods: {
    handleSubmit() {
      this.$refs.form.validate()
      if (this.valid) {
        const values = {
          npi: this.npi
        }
        if (isNaN(this.npi)) {
          this.$toast.error('NPI must contain numbers only.')
          return 0
        }
        if (!this.checked) {
          this.$toast.error('Please check the checkbox.')
          return 0
        }
        if (this.category) {
          this.loadingSubmit = true
          this.$api.post('/professional', {
            npi: values.npi,
            category: this.category,
          }).then(() => {
            this.$router.push(this.localePath('/thanks-for-applying'))
            // this.$toast.success('Thank you for your interest in being a Provider at Mednoor Medical Center. Mednoor credentialing department will contact you as soon as possible')
          }).catch((err) => {
            this.$refs.rmodal.$emit('error', err)
          }).finally(() => {
            this.loadingSubmit = false
          })
        } else {
          this.$toast.error('Select a category')
        }
      }
    }
  }
}
</script>

<style scoped>

</style>
