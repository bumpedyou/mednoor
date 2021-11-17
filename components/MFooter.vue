<template>
  <div class="m-footer">
    <a-row>
      <a-col>
        <p class="text-center">
          <nuxt-link to="/privacy-policy">Privacy policy</nuxt-link>
          -
          <nuxt-link to="/terms-and-conditions">Terms and conditions</nuxt-link>
        </p>
        <p class="text-center">Mednoor © {{year}}</p>

      </a-col>
    </a-row>
  </div>
</template>

<script>
export default {
  name: 'MFooter',
  data: ()=>({
    year: '',
  }),
  mounted(){
    this.year = new Date().getFullYear()  // returns the current year
  },
}
</script>

<style scoped lang='sass'>
.m-footer
  padding: 1rem
  background: #eee
</style>
