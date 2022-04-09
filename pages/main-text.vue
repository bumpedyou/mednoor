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
            text: 'For Patient and Provider Section',
            disabled: true,
          }
        ]"></v-breadcrumbs>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <p class="h4 mb-1">
          For Patient and Provider Section
        </p>
        <v-row>
        <v-col md="6">
        <p>For Patient</p>
        </v-col>
        <v-col md="6">
        <p>For Provider</p>
        </v-col>
        </v-row>
        <v-skeleton-loader v-if="loading"></v-skeleton-loader>
        <v-form v-else ref="form" @submit="handleSubmit">
          <v-row>
            <v-col md="6">
              <client-only>
                <VueEditor v-model='text' placeholder='Left side text.' />
              </client-only>
            </v-col>
            <v-col md='6'>
              <client-only>
                <VueEditor v-model='text_b' placeholder='Right side text' />
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
      text: '',
      text_b: '',
    }
  },
  mounted() {
    this.$api.get('/main-text').then(({data})=>{
      this.loading = false
      if (data){
        this.text = data.mate_text
        this.text_b = data.mate_text_b
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
        text: this.text,
        text_b: this.text_b
      }

      this.$api.post('/main-text', values).then(()=>{
        this.$toast.success('Main text has been updated successfully')
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
