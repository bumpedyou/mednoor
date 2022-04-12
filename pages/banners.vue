<template>
  <div class="pa-6 mh-100v">
    <v-row class='mb-1'>
      <v-col>
        <v-breadcrumbs :items="[
          {
            text: $t('dashboard'),
            to: localePath('/dashboard'),
          },
          {
            text: 'Banners',
            disabled: true,
          }
        ]"></v-breadcrumbs>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <p class="h4 mb-1">
          Banners
        </p>
        <v-skeleton-loader v-if="loading"></v-skeleton-loader>
        <v-form v-else ref="form" @submit="handleSubmit">
          <v-row>
            <v-col md="6">
              <h5>First Banner</h5>
              <client-only>
                <VueEditor v-model='first_banner' placeholder='First Banner' />
              </client-only>
            </v-col>
            <v-col md='6'>
              <h5>Second Banner</h5>
              <client-only>
                <VueEditor v-model='second_banner' placeholder='Second Banner' />
              </client-only>
            </v-col>
            <v-col md='6'>
              <h5>Third Banner</h5>
              <client-only>
                <VueEditor v-model='third_banner' placeholder='Third Banner' />
              </client-only>
            </v-col>
          </v-row>
          <div class='mt-3'>
            <v-btn color="primary" small tile type="submit" :loading="saving">
              Save
            </v-btn>
          </div>
        </v-form>
      </v-col>
    </v-row>
    <request-modal ref="rmodal"></request-modal>
  </div>
</template>

<script>

export default {
  name: "MainText",
  layout: 'dashboard',
  middleware: ['authenticated', 'verified', 'not-blocked', 'not-deleted', 'admin-or-super'],
  data() {
    return {
      saving: false,
      loading: true,
      first_banner: '',
      second_banner: '',
      third_banner: '',
    }
  },
  mounted() {
    this.$api.get('/banners').then(({data})=>{
      this.loading = false
      if (data){
        this.first_banner = data.first_banner
        this.second_banner = data.second_banner
        this.third_banner = data.third_banner
      }
    }).finally(() => {
      this.loading = false
    })
  },
  methods: {
    handleSubmit(e) {
      e.preventDefault()
      this.saving = true
      const values = {
        first_banner: this.first_banner,
        second_banner: this.second_banner,
        third_banner: this.third_banner
      }

      this.$api.post('/banners', values).then(()=>{
        this.$toast.success('Banners updated successfully')
      }).catch((err)=>{
        this.$refs.rmodal.$emit('error', err)
      }).finally(() => {
        this.saving = false
      })
    }
  }
}
</script>

<style scoped lang="sass">

</style>
