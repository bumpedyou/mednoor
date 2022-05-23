<template>
  <div class="pa-6 mh-100v">
    <v-row class="mb-1">
      <v-col>
        <v-breadcrumbs
          :items="[
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
            },
          ]"
        ></v-breadcrumbs>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <p class="h1">
          {{ $t('new_page') }}
        </p>
        <v-skeleton-loader v-if="loading"></v-skeleton-loader>
        <v-form v-else ref="form" v-model="valid" @submit.prevent>
          <div>
            <v-text-field
              v-model="title"
              :rules="[
                (v) => !!v || $t('v.title_req'),
                (v) => (!!v && v.length >= 3) || $t('v.min_3'),
              ]"
              :label="$t('title')"
              :placeholder="$t('title')"
            >
            </v-text-field>
          </div>
          <div>
            <v-text-field
              v-model="header_subtitile"
              :rules="[
                (v) => !!v || 'The Header Subtitle are required',
                (v) => (!!v && v.length <= 330) || $t('v.max_330'),
              ]"
              :placeholder="$t('header_s')"
            >
            </v-text-field>
          </div>
          <div>
            <v-select
              v-model="slug"
              :rules="[(v) => !!v || 'Submenu is required']"
              :items="menus"
              label="Page for Submenu"
            >
            </v-select>
            <!-- <v-text-field v-model="slug" :rules="[
              v => !!v || 'The slug is required',
              v => !!v && v.length<= 330 || $t('v.max_330')
            ]" :label="$t('slug_p')"  :placeholder="$t('slug_p')">
            </v-text-field> -->
          </div>
          <div>
            <v-text-field
              v-model="keywords"
              :rules="[
                (v) => !!v || 'The keywords are required',
                (v) => (!!v && v.length <= 330) || $t('v.max_330'),
              ]"
              :placeholder="$t('keywords_p')"
            >
            </v-text-field>
          </div>

          <div class="d-flex">
            <div class="col-md-6">
              <label for="">{{ $t('header_bg') }}</label>
              <v-color-picker
                v-model="header_background"
                mode="hexa"
                hide-mode-switch
                hide-inputs
              ></v-color-picker>
            </div>

            <div class="col-md-6">
              <label for="">{{ $t('body_bg') }}</label>
              <v-color-picker
                v-model="body_background"
                mode="hexa"
                hide-mode-switch
                hide-inputs
              ></v-color-picker>
            </div>
          </div>
          <div>
            <client-only>
              <ckeditor-nuxt v-model="txt" :config="editorConfig" />
            </client-only>
          </div>
          <div class="mt-3">
            <v-btn
              small
              tile
              color="primary"
              :loading="loadingCreate"
              @click="handleSubmit"
            >
              <span v-if="uuid">
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
    <RequestModal ref="rmodal" />
  </div>
</template>
<script>
export default {
  layout: 'dashboard',
  components: {
    'ckeditor-nuxt': () => { if (process.client) { return import('@blowstack/ckeditor-nuxt') } },
  },
  middleware: ['authenticated', 'not-blocked', 'not-deleted', 'verified'],
  data() {
    return {
      editorConfig: {
        simpleUpload: {
          uploadUrl: 'path_to_image_controller',
          headers: {
            'Authorization': 'optional_token'
          }
        }
      },
      loadingCreate: false,
      txt: '',
      uuid: null,
      loading: true,
      title: '',
      slug: '',
      keywords: '',
      header_subtitile: '',
      header_background: [],
      body_background: [],
      valid: false,
      menus: [],
    }
  },
  head() {
    return {
      title: this.$t('new_page'),
    }
  },
  mounted() {
    this.getSubMenuItem()
    if (this.$route.query && this.$route.query.page) {
      this.loading = true
      this.uuid = this.$route.query.page
      this.$api
        .get('/page/' + this.uuid)
        .then(({ data }) => {
          this.loading = false
          if (data) {
            this.title = data.page_title
            this.slug = data.page_slug
            this.keywords = data.page_keywords
            this.txt = data.page_content
            this.header_subtitile = data.page_header_subtitile
            this.header_background = data.page_header_background || '#212a43'
            this.body_background = data.page_body_background || '#FFFFFF'
          } else {
            this.uuid = null
          }
        })
        .catch(() => {
          this.uuid = null
          this.$refs.rmodal.$emit('error', this.$t('page_does_not_exist'))
          this.loading = false
        })
    } else {
      this.loading = false
    }
  },
  methods: {
    getSubMenuItem() {
      this.$api
        .get('/submenu')
        .then(({ data }) => {
          if (data) {
            this.menus = data.map((item) => {
              return item.url_end_point
            })
          }
        })
        .catch((err) => {
          console.log(err)
        })
    },
    handleSubmit() {
      this.$refs.form.validate()
      const values = {
        title: this.title,
        keywords: this.keywords,
        slug: this.slug,
        header_subtitile: this.header_subtitile,
        header_background: this.header_background || '#212a43',
        body_background: this.body_background || '#FFFFFF',
      }

      if (this.valid) {
        this.loadingCreate = true
        values.txt = this.txt
        if (this.uuid) {
          this.$api
            .put('/page/' + this.uuid, values)
            .then((data) => {
              this.$toast.success(data.data.result.message)
            })
            .catch((err) => {
              this.$refs.rmodal.$emit('error', err)
            })
            .finally(() => {
              this.loadingCreate = false
            })
        } else {
          this.$api
            .post('/page/', values)
            .then((data) => {
              this.$toast.success(data.data.result.message)
              this.$router.push(this.localePath('/pages'))
            })
            .catch((err) => {
              this.$refs.rmodal.$emit('error', err)
            })
            .finally(() => {
              this.loadingCreate = false
            })
        }
      }
    },
  },
}
</script>
