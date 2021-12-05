<template>
  <div class="pa-1 mh-100v">
    <a-row class='mb-1'>
      <a-col>
        <div class="flex-center">
          <img alt='Mednoor Logo' :src='require("~/static/logo.jpg")'>
        </div>
      </a-col>
    </a-row>
    <a-row :gutter="16">
      <a-col xs:="24" :sm='{span: 12}'>
        <a-card class="bg-gradient-sun clickable" @click="$router.push(localePath('/professionals'))">
          <div class='flex-center mh-50v'>
            <p class="h3">
              I'm a patient
            </p>
          </div>
        </a-card>
      </a-col>
      <a-col xs:="24" :sm='{span: 12}'>
        <a-card class="bg-gradient-blue clickable" @click="$router.push(localePath('/pin'))">
          <div class='flex-center mh-50v' >
            <p class="h3">
              I'm a professional
            </p>
          </div>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script>
export default {
  name: "ViewMode",
  middleware: ['authenticated', 'verified', 'not-blocked', 'not-deleted'],
}
</script>

<style scoped>

</style>
