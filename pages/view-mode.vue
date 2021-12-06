<template>
  <div class="pa-1 mh-100v">
    <a-row class='mb-1'>
      <a-col>
        <div class="flex-center">
          <img alt='Mednoor Logo' :src='require("~/static/logo.jpg")'>
        </div>
      </a-col>
    </a-row>
    <a-row :gutter="24">
      <a-col xs:="24" :sm='{span: 12}'>
        <div class='flex-center mh-50v w-100'>
          <a-card class="bg-gradient-sun clickable" style='width: 300px;max-width: 100% !important' @click="$router.push(localePath('/professionals'))">
            <div class='flex-center'>
              <p class="h3 pa-1 text-center">
                <span class='text-muted-dark'>I am a</span><br>
                <span style='font-weight: bold'>Patient</span>
              </p>
            </div>
          </a-card>
        </div>
      </a-col>
      <a-col xs:="24" :sm='{span: 12}'>
        <div class='flex-center mh-50v w-100'>
          <a-card class="bg-gradient-blue clickable" style='width: 300px;max-width: 100% !important' @click="$router.push(localePath('/pin'))">
            <div class='flex-center' >
              <p class="h3 pa-1 text-center">
                <span class='text-muted-dark'>
                  I am a
                </span><br><span style='font-weight: bold'>Professional</span>
              </p>
            </div>
          </a-card>
        </div>
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
