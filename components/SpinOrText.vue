<template>
  <span v-if='localValue'>
    <a-spin class='white-spin'></a-spin>
  </span>
  <span v-else>
    <slot></slot>
  </span>
</template>

<script>
import vModelMixin from '~/mixins/vmodelMixin'
export default {
  name: 'SpinOrText',
  mixins: [vModelMixin],
}
</script>

<style scoped>

</style>
