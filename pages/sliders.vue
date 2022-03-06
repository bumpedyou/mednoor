<template>
  <div class="pa-6 mh-100v">
    <v-row>
      <v-col md="12">
        <v-breadcrumbs
          :items="[
            {
              text: 'Dashboard',
              to: localePath('/dashboard'),
              disabled: false
            },
            {
              text: $t('home_screen'),
              disabled: true
            }
          ]"
        ></v-breadcrumbs>
      </v-col>
    </v-row>
    <v-row>
      <v-col md="12">
        <p class="h4 mb-1">Sliders</p>
        <p>Here you can manage the home screen sliders</p>
      </v-col>
    </v-row>
    <v-row v-if="isAddNew">
      <v-col>
        <div class="slider-container mb-3" @dragover.prevent @drop.prevent>
          <div v-if="src">
            <div
              v-if="id"
              class="slider-view"
              :style="'background-image: url(' + src + ')'"
            ></div>
            <cropper
              v-else
              class="cropper"
              :src="src"
              :stencil-props="{ aspectRatio: 21 / 9 }"
              @change="change"
            ></cropper>
            <v-text-field
              v-model="title"
              label="Title"
              placeholder="title"
            ></v-text-field>
            <v-textarea
              v-model="description"
              label="Description"
              placeholder="Description"
              filled
            ></v-textarea>
          </div>
          <label v-else class="upload-box" for="file" @drop="newFile">
            <p class="text-muted">
              Click or drag & drop an image here.
              <v-icon>mdi-upload</v-icon>
            </p>
          </label>
          <input
            id="file"
            ref="file"
            accept="image/*"
            type="file"
            class="d-none"
            @change="newFile"
          />
        </div>
        <div v-if="src">
          <v-btn color="primary" small tile @click="cropAndUpload">
            <span v-if="id"> Update <v-icon>mdi-content-save</v-icon> </span>
            <span v-else>
              Crop and Upload
              <v-icon>mdi-upload</v-icon>
            </span>
          </v-btn>
          <v-btn color="error" small tile @click="removeFileSelected"
            >Cancel <v-icon>mdi-close</v-icon></v-btn
          >
        </div>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <slider ref="slider" edit @add="addSlider"  @edit="editSlide" @delete="deleteSlide"  @activeToggle="activeToggleSlider"/>
      </v-col>
    </v-row>
    <request-modal ref="rmodal"></request-modal>
    <ConfirmDialog
      v-model="confirm"
      title="Do you want to delete this item?"
      :loading="loadingDelete"
      @accept="confirmDelete"
      @cancel="confirm = false"
    ></ConfirmDialog>
  </div>
</template>

<script>
import { Cropper } from 'vue-advanced-cropper'
import 'vue-advanced-cropper/dist/style.css'
import Slider from '../components/Slider.vue'
import uploadMixin from '~/mixins/uploadMixin'

export default {
  components: {
    Cropper,
    Slider
  },
  mixins: [uploadMixin],
  layout: 'dashboard',
  data: () => ({
    file: null,
    left: null,
    top: null,
    width: null,
    height: null,
    title: '',
    description: '',
    confirm: false,
    loadingDelete: false,
    id: null,
    isAddNew : false
  }),
  methods: {
    confirmDelete() {
      if (this.id) {
        this.loadingDelete = true
        this.$api
          .delete('/slider/' + this.id)
          .then(() => {
            this.$toast.success('The slider has been deleted successfuly.')
            this.$refs.slider.$emit('get-items')
          })
          .catch((err) => {
            this.$refs.rmodal.$emit('error', err)
          })
          .finally(() => {
            this.loadingDelete = false
            this.confirm = false
            this.id = null
          })
      }
    },
    editSlide(id) {
      this.isAddNew = true;
      this.id = id
      this.$api
        .get('/slider/' + this.id)
        .then(({ data }) => {
          this.title = data.slid_title
          this.description = data.slid_description
          this.src = process.env.API_URL + '/slider/' + data.slid_image
        })
        .catch((err) => {
          this.$refs.rmodal.$emit('error', err)
        })
    },

    activeToggleSlider(slider) {
     // console.log(slider)
      this.id = slider.slid_id;
      const model= {
      
        slid_active:!slider.slid_active
      }
      this.$api
        .post('/slider/active/' + this.id,model)
        .then(({ data }) => {
           this.$refs.slider.$emit('get-items')
            this.$toast.success('The slider has been updated successfully.')
        })
        .catch((err) => {
          this.$refs.rmodal.$emit('error', err)
        })
    },
    deleteSlide(id) {
      this.id = id
      this.confirm = true
      console.log('Delete slide')
    },
    addSlider() {
  this.isAddNew = true
    },
    removeFileSelected() {
      this.$refs.file.value = ''
      this.src = ''
      this.file = null
      this.title = ''
      this.description = '',
      this.isAddNew = false;
    },
    change({ coordinates, canvas }) {
      this.left = coordinates.left
      this.top = coordinates.top
      this.width = coordinates.width
      this.height = coordinates.height
    },
    newFile(e) {
      const files = e.target.files || e.dataTransfer.files
      if (files && files.length) {
        this.file = files[0]
        const type = this.file.type
        if (type.includes('image')) {
          this.getSrc(this.file)
        } else {
          this.removeFileSelected()
          this.$refs.rmodal.$emit('error', 'Only images are allowed.')
        }
      } else {
        this.src = ''
      }
    },
    cropAndUpload() {
      if (this.id) {
        this.$api
          .put('/slider/' + this.id, {
            title: this.title,
            description: this.description
          })
          .then(() => {
            this.$refs.slider.$emit('get-items')
            this.$toast.success('The slider has been updated successfully.')
            this.removeFileSelected()
            this.id = null
          })
          .catch((err) => {
            this.$refs.rmodal.$emit('err', err)
          })
      } else if (this.src && this.file) {
        const data = new FormData()
        data.append('file', this.file)
        data.append('left', this.left)
        data.append('top', this.top)
        data.append('width', this.width)
        data.append('height', this.height)
        data.append('title', this.title)
        data.append('description', this.description)
        this.$api
          .post('/slider', data, () => {})
          .then(() => {
            this.removeFileSelected()
            this.$toast.success('The image has been uploaded succesfully')
            this.$refs.slider.$emit('get-items')
          })
          .catch((err) => {
            this.$refs.rmodal.$emit('err', err)
          })
      } else {
        this.$refs.rmodal.$emit('error', 'Select an image first')
      }
    }
  }
}
</script>
<style scoped lang="sass">

.slider-view
    width: 100%
    height: 300px
    background-size: cover
    background-position: center center


.slider-container
    img
        max-width: 100% !important
        max-height: 100% !important
    .cropper
        height: 300px
    .upload-box
        width: 100%
        height: 300px
        border: 3px dashed $mdn-primary
        display: flex
        align-items: center
        justify-content: center
        &:hover
            cursor: pointer


@media screen and (min-width: $md)
    .slider-view
        height: 400px
    .slider-container
        .cropper
            height: 400px
        .upload-box
            height: 400px

@media screen and (min-width: $lg)
    .slider-view
        height: 600px

    .slider-container
        .cropper
            height: 600px
        .upload-box
            height: 600px
</style>
