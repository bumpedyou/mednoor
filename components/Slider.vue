<template>
  <div>
    <div v-if="sliders && sliders.length <= 0"></div>
    <VueSlickCarousel v-else :arrows="true" :dots="false">
      <div v-for="(s, i) in sliders" :key="'slide-' + i">
        <div class="slider-item">
          <div class="slider-bg" :style="sliderBg(s.slid_image)">
            <div v-if="$props.edit" class="edit-top-bar">
                  <v-icon @click="$emit('add')">mdi-plus</v-icon>
              <v-icon @click="$emit('delete', s.slid_id)">mdi-delete</v-icon>
              <v-icon @click="$emit('edit', s.slid_id)">mdi-pencil</v-icon>
           <v-icon  @click="$emit('activeToggle', s)">{{s.slid_active? 'mdi-check-circle':'mdi-check-circle-outline'}}</v-icon>
            </div>
            <div class="slider-content">
              <p class="h1">{{ s.slid_title }}</p>
              <p class="text-center">{{ s.slid_description }}</p>
            </div>
          </div>
        </div>
      </div>
    </VueSlickCarousel>
  </div>
</template>

<script>
import 'vue-slick-carousel/dist/vue-slick-carousel.css'
import 'vue-slick-carousel/dist/vue-slick-carousel-theme.css'

import VueSlickCarousel from 'vue-slick-carousel'

export default {
  name: 'Slider',
  components: { VueSlickCarousel },
  props: {
    edit: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    settings: {
      dots: true,
      dotsClass: 'slick-dots custom-dot-class',
      edgeFriction: 0.35,
      infinite: false,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1
    },
    sliders: []
  }),
  computed: {
    src_path() {
      return process.env.API_URL + '/slider'
    }
  },
  mounted() {
    this.getItems()
    this.$on('get-items', () => {
      this.getItems()
    })
  },
  methods: {
    sliderBg(img) {
      return `background-image: url(${this.src_path + '/' + img})`
    },
    getItems() {
      this.$api.get('/slider').then(({ data }) => {
        this.sliders = data
      })
    }
  }
}
</script>

<style scoped>
.slider-bg {
  position: relative;
}


.mdi-check-circle {
  color: #89c8fd!important;
}
.v-icon {
  color: #cccccc;
}
.edit-top-bar {
  position: absolute;
  right: 0;
  top: 0;
  padding: 1rem;
}

.edit-top-bar button {
  font-size: 2rem;
}

.edit-top-bar button:hover {
  color: #000;
  cursor: pointer;
}

.carousel-cell {
  max-height: 450px !important;
}
.slick-prev:before,
.slick-next:before {
  font-size: 30px;
  color: lightgray;
  opacity: 1;
}
.slick-prev,
.slick-next {
  z-index: 1;
  background-color: transparent;
  color: white;
  border-radius: 50%;
}
.slick-next {
  right: 20px;
}
.slick-prev {
  left: 10px;
}
.slick-next:hover,
.slick-prev:hover {
  /* background-color: #ddd; */
  color: black;
}
.slick-next:hover:before,
.slick-prev:hover:before {
  background-color: transparent;
  color: black;
}
.slider-item .slider-bg {
  background-size: cover;
  background-position: center center;
  height: 100%;
}
.slider-item .slider-content {
  position: relative;
  top: 50%; /* transform:
translateY(-30%); */
  text-align: center; /* width: 50%; */
  padding: 0 15%;
}
.slider-content {
  color: #fff !important;
  font-size: 3.125rem;
  line-height: 3.75rem;
  margin-bottom: 0.23438rem;
}
.slider-content .h1 {
  color: #fff;
  font-weight: bolder;
}
@media (min-width: 900px) {
  .slider-item {
    min-height: 500px;
  }
}
@media (min-width: 320px) {
  .slider-item {
    height: 350px;
  }
}
@media (max-width: 425px) {
  .slider-item .slider-content {
    top: 20%;
  }
}
</style>
