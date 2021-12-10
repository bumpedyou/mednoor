<template>
  <div class="pa-1 mh-100v">
    <a-row class='mb-1'>
      <a-col>
        <a-breadcrumb>
          <a-breadcrumb-item>
            <nuxt-link :to="localePath('/dashboard')">{{ $t('dashboard') }}</nuxt-link>
          </a-breadcrumb-item>
          <a-breadcrumb-item>Main Text</a-breadcrumb-item>
        </a-breadcrumb>
      </a-col>
    </a-row>
    <a-row>
      <a-col>
        <p class="h4 mb-1">
          Main Text
        </p>
        <p>
          Text that is shown above the footer.
        </p>
        <a-skeleton v-if="loading"></a-skeleton>
        <a-form v-else :form="form" @submit="handleSubmit">
          <a-row :gutter="6">
            <a-col :md='12'>
              <client-only>
                <VueEditor v-model='text' placeholder='Left side text.' />
              </client-only>
            </a-col>
            <a-col :md='12'>
              <client-only>
                <VueEditor v-model='text_b' placeholder='Right side text' />
              </client-only>
            </a-col>
          </a-row>
          <a-form-item>
            <a-button type="primary" html-type="submit">
              <SpinOrText v-model="saving">Save</SpinOrText>
            </a-button>
          </a-form-item>
        </a-form>
      </a-col>
    </a-row>
    <request-modal ref="rmodal"></request-modal>
  </div>
</template>

<script>
import SpinOrText from '~/components/SpinOrText'
import RequestModal from '~/components/RequestModal'

export default {
  name: "MainText",
  components: {
    SpinOrText,
    RequestModal,
  },
  layout: 'dashboard',
  middleware: ['authenticated', 'verified', 'not-blocked', 'not-deleted', 'admin-or-super'],
  data() {
    return {
      saving: false,
      form: this.$form.createForm(this),
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
