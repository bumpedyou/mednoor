<template>
  <div class='mh-100v pa-6'>
    <v-row>
      <v-col md="12">
        <v-breadcrumbs :items="[
          {
            text: 'Dashboard',
            to: localePath('/dashboard'),
            disabled: false,
          },{
            text: $t('home_screen'),
            disabled: true,
          }
        ]"></v-breadcrumbs>
      </v-col>
    </v-row>
    <v-row v-if='src === ""'>
      <v-col md="12">
        <p class='h4 mb-1'>{{ $t('home_screen') }}</p>
        <div>
          <label class="d-block mb-3">What screen do you want to replace?</label>
          <v-select placeholder="Screen to replace" label="Screen to replace" :items="[
            {
              text: $t('sign_up'),
              value: 'sign-up'
            },
                 {
              text: $t('sign_in'),
              value: 'sign-in'
            }
          ]" prepend-inner-icon="mdi-view-gallery" @change="setType">
          </v-select>
        </div>
        <v-file-input id="upload_field" v-model="file" placeholder="Image" label="Image" prepend-inner-icon="mdi-paperclip" prepend-icon="" class=""></v-file-input>
      </v-col>
    </v-row>
    <div v-else class='mt-2'>
      <v-row class='mt-1'>
        <v-col md="6">
          <background-item :file='src' source='empty' height='80vh'></background-item>
        </v-col>
        <v-col md="6">
          <p class='h3'>
            {{ $t('prev_ex') }}
          </p>
          <v-skeleton-loader />
          <div class="my-3">
            <v-progress-linear color="success" :value='umUploadProgress'></v-progress-linear>
          </div>
          <v-btn color='error' small tile @click='handleRemove'>
            {{ $t('cancel') }}
          </v-btn>
          <v-btn color='primary' small tile @click='handleUpload'>
            {{ $t('upl_repl') }}
          </v-btn>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script>
import breakpoints from '~/mixins/breakpoints'
import uploadMixin from '~/mixins/uploadMixin'

export default {

  mixins: [breakpoints, uploadMixin],
  layout: 'dashboard',
  middleware: ['authenticated', 'not-blocked', 'not-deleted', 'verified'],
  data() {
    return {
      file: null,
      headers: {
        authorization: this.$auth.strategy.token.get()
      },
      fileList: [],
      uploading: false,
      type: 'sign-up',
    }
  },
  head(){
    return {
      title: this.$t('home_screen')
    }
  },
  computed: {
    computedAction() {
      return process.env.API_URL + '/home-screen'
    }
  },
  watch: {
    file(v){
      if (v){
        this.getSrc(v)
      }
    }
  },
  methods: {
    setType(t){
      this.type = t
    },
    handleRemove() {
      this.file = null
      this.src = ''
    },
    beforeUpload(file) {
      this.fileList = [...this.fileList, file]
      this.getSrc(file)
      return false
    },
    handleUpload() {
      const formData = new FormData()
      formData.append('file', this.file)
      formData.append('type', this.type)
      this.uploading = true
      this.$api.post(this.computedAction, formData, {
        onUploadProgress: (evt) => {
          this.onProgress(evt)
        }
      }).then(() => {
        this.fileList = []
        this.$toast.success(this.$t('upl_succ').toString())
        setTimeout(() => {
          this.handleRemove()
          this.umUploadProgress = 0
        }, 1000)

      }).catch(() => {
        this.$toast.error(this.$t('upl_fail').toString())
      }).finally(() => {
        this.uploading = false
      })
    }
  }
}
</script>
