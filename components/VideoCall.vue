<template>
  <div class="video-call">
    <div class="flex-center">
      <!--Video container #1-->
    </div>
    <div class="flex-center">
      <!--Video container #2-->
    </div>
  </div>
</template>

<script>
export default {
  name: "VideoCall"
}
</script>

<style scoped lang="sass">
.video-call
  display: flex
  flex-direction: column
  flex: 1
  width: 100%

  > div
    display: flex
    flex: 1

@media screen and (min-width: $md)
  .video-call
    flex-direction: row
</style>
