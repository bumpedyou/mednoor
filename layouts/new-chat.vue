<template>
  <div>
    <Navbar :hide-middle="true"></Navbar>
    <div id="app-content">
      <Nuxt></Nuxt>
    </div>
  </div>
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
