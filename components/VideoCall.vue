<template>
  <div class="video-call">
    <div class="flex-center">
      <!--Video container #1-->
      <p >
        Container A
      </p>
    </div>
    <div class="flex-center">
      <!--Video container #2-->
      <p>
        Container B
      </p>
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
