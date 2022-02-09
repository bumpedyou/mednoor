<template>
  <div class='pa-6 mh-100v'>
    <!-- eslint-disable vue/no-v-html -->
    <pre v-html='content'></pre>
    <!--eslint-enable-->
  </div>
</template>

<script>
export default {
  data() {
    return {
      title: this.$t('privacy_p'),
      content: ''
    }
  },
  mounted() {
    this.$api.get('/content/privacy-policy').then(({ data }) => {
      if (data && data.prpo_text) {
        this.content = data.prpo_text
      }
    })
  }
}
</script>
