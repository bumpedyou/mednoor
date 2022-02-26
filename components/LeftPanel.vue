<template>
  <div class="left-panel">
    <div class="main-container-w">
      <div class="main-w-content">
      </div>
    </div>
    <div class='w-controls'>
      <v-icon>mdi-upload</v-icon>
    </div>
  </div>
</template>

<style scoped lang="sass">
.left-panel
  display: flex !important
  flex-direction: column !important
  flex-grow: 1
  width: 100%

  > div
    display: flex
    flex: 1

  .w-controls
    position: fixed
    left: 0
    bottom: 0
    width: 100%
    background: #fff
    border-top: 1px solid $mdn-super-light-grey
    box-shadow: inset 0 1px 3px $mdn-super-light-grey
    padding: 0.5rem
    height: 60px
    display: flex
    align-items: center
    justify-content: center

  .main-container-w
    position: fixed
    width: 100%
    bottom: 60px
    top: 100px
    overflow-y: auto
    overflow-x: hidden
    display: flex
    flex-wrap: wrap

    .main-w-content
      width: 50%
      min-width: 300px
      height: fit-content

@media screen and (min-width: $md)
  .left-panel
    flex-direction: row

    .main-container-w
      width: 50%

    .w-controls
      width: 50%
      right: 50%

.main-w-content.zoom
  position: fixed
  top: 50px
  bottom: 60px
  padding: 1px
  align-content: center
  height: calc(100% - 110px)
  display: flex
  right: 0
  width: 100% !important
  line-height: 0
  z-index: 1000
  background: white

</style>
