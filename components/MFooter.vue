<template>
  <div class="m-footer">
    <a-row>
      <a-col>
        <hr>
        <p class="text-center">Mednoor {{year}}</p>
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
  margin-top: 2rem
  padding: 1rem
</style>
