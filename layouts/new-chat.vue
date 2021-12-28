<template>
  <v-app>
    <Navbar :hide-middle="true"></Navbar>
    <div id="app-content">
      <Nuxt></Nuxt>
    </div>
  </v-app>
</template>

<script>
import Navbar from "~/components/Navbar";
export default {
  name: "NewChat",
  components: {
    Navbar
  },

}
</script>

<style scoped>
</style>
