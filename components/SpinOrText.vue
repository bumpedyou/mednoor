<template>
  <span v-if='localValue'>
    <v-progress-circular :color="color"></v-progress-circular>
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
  props: {
    dark: {
      type: Boolean,
      default: false,
    }
  },
  computed: {
    color () {
      if (this.$props.dark){
        return 'black'
      }
      return 'white'
    },
  }
}
</script>
