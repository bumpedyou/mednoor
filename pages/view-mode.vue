<template>
  <div class="pa-1 mh-100v">
    <a-row>
      <a-col>
        <div class="flex-center">
          <img alt='Mednoor Logo' :src='require("~/static/logo.jpg")'>
        </div>
        <p class='primary--text text-center'>
          Medical Center
        </p>
      </a-col>
    </a-row>
    <div class='pa-1'>
      <a-row>
        <a-col xs:="24" :sm='{span: 12}' :md='{span: 5, offset: 7}' :lg='{span: 3, offset: 9}'>
          <div class='flex-center mh-300p w-100'>
            <div class="bg-gradient-sun clickable pa-05" style='width: 183px;max-width: 100% !important' @click="$router.push(localePath('/professionals'))">
              <div class='flex-center'>
                <p class="h3 text-center">
                  <small class='text-muted-dark'>I am a</small><br>
                  <span style='font-weight: bold; color: #ffffff' class='h4'>Patient</span>
                </p>
              </div>
            </div>
          </div>
        </a-col>
        <a-col xs:="24" :sm='{span: 12}' :md='{span: 5}' :lg='{span: 3}'>
          <div class='flex-center mh-300p w-100'>
            <div class="bg-gradient-blue clickable pa-05" style='width: 183px;max-width: 100% !important' @click="$router.push(localePath('/pin'))">
              <div class='flex-center' >
                <p class="h3 text-center">
                <small class='text-muted-dark'>
                  I am a
                </small><br><span class='h4' style='font-weight: bold; color: #fff !important' >Professional</span>
                </p>
              </div>
            </div>
          </div>
        </a-col>
      </a-row>
    </div>
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
