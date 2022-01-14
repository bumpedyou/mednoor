<template>
  <div class='pa-6 mh-100v'>
    <v-row class='mb-1'>
      <v-col>
        <v-breadcrumbs :items="[
          {
            text: $t('dashboard'),
            to: localePath('/dashboard'),
            disabled: false,
          },
          {
            text: $t('pages'),
            to: localePath('/pages'),
            disabled: false,
          },
          {
            text: $t('new_page'),
            disabled: true,
          }
        ]"></v-breadcrumbs>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <p class='h1'>
          {{ $t('new_page') }}
        </p>
        <v-skeleton-loader v-if='loading'></v-skeleton-loader>
        <v-form v-else ref='form' v-model="valid" @submit.prevent>
          <div>
            <v-text-field v-model="title" :rules="[
              v => !!v || $t('v.title_req'),
              v => !!v && v.length >= 3 || $t('v.min_3')
            ]" :label="$t('title')" :placeholder="$t('title')">
            </v-text-field>
          </div>
          <div>
            <v-text-field v-model="slug" :rules="[
              v => !!v || 'The slug is required',
              v => !!v && v.length<= 330 || $t('v.max_330')
            ]" :label="$t('slug_p')"  :placeholder="$t('slug_p')">
            </v-text-field>
          </div>
          <div>
            <v-text-field v-model="keywords" :rules="[
              v => !!v || 'The keywords are required',
              v => !!v && v.length <= 330 || $t('v.max_330'),
            ]" :placeholder="$t('keywords_p')">
            </v-text-field>
          </div>
          <div>
            <client-only>
              <VueEditor v-model='txt'/>
            </client-only>
          </div>
          <div class='mt-3'>
            <v-btn small tile color='primary' :loading="loadingCreate" @click="handleSubmit">
              <span v-if='uuid'>
                {{ $t('update') }}
              </span>
              <span v-else>
                {{ $t('create_new_page') }}
              </span>
            </v-btn>
          </div>
        </v-form>
      </v-col>
    </v-row>
    <RequestModal ref='rmodal' />
  </div>
</template>
<script>
import RequestModal from '~/components/RequestModal'

export default {
  components: {
    RequestModal
  },
  layout: 'dashboard',
  middleware: ['authenticated', 'not-blocked', 'not-deleted', 'verified'],
  data() {
    return {
      loadingCreate: false,
      txt: '',
      uuid: null,
      loading: true,
      title: '',
      slug: '',
      keywords: '',
      valid: false,
    }
  },
  head(){
    return {
      title: this.$t('new_page')
    }
  },
  mounted() {
    if (this.$route.query && this.$route.query.page) {
      this.loading = true
      this.uuid = this.$route.query.page
      this.$api.get('/page/' + this.uuid).then(({ data }) => {
        this.loading = false
        if (data) {
          this.title = data.page_title
          this.slug = data.page_slug
          this.keywords = data.page_keywords
          this.txt = data.page_content
        } else {
          this.uuid = null
        }

      }).catch(() => {
        this.uuid = null
        this.$refs.rmodal.$emit('error', this.$t('page_does_not_exist'))
        this.loading = false
      })
    } else {
      this.loading = false
    }
  },
  methods: {
    handleSubmit() {
      console.log('handleSubmit')
      this.$refs.form.validate()
      const values = {
        title: this.title,
        keywords: this.keywords,
        slug: this.slug
      }

      if (this.valid) {
        this.loadingCreate = true
        values.txt = this.txt
        if (this.uuid) {
          this.$api.put('/page/' + this.uuid, values).then(() => {
            this.$toast.success(this.$t('page_hb_updated').toString())
          }).catch((err) => {
            this.$refs.rmodal.$emit('error', err)
          }).finally(() => {
            this.loadingCreate = false
          })
        } else {
          this.$api.post('/page/', values).then(() => {
            this.$toast.success(this.$t('page_hb_created').toString())
            this.$router.push(this.localePath('/pages'))
          }).catch((err) => {
            this.$refs.rmodal.$emit('error', err)
          }).finally(() => {
            this.loadingCreate = false
          })
        }
      }
    }
  }
}
</script>
