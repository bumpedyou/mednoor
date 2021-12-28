<template>
  <div :class='computedClass' @click='$emit("click", $event)'>
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'ChatItem',
  props: {
    active: {
      type: Boolean,
      default: false,
    },
    canHover: {
      type: Boolean,
      default: true,
    }
  },
  computed: {
    computedClass (){
      const c = ['chat-item']
      if (this.$props.active){
        c.push('active')
      }
      if (this.$props.canHover){
        c.push('can-hover')
      }
      return c.join(' ')
    }
  }
}
</script>

<style scoped lang='sass'>
.chat-item
  width: 100%
  background: #fff
  padding: 0.3rem
  display: flex
  align-items: center
  border: 1px solid $mdn-super-light-grey
.chat-item.can-hover
  &:hover
    cursor: pointer
    background-color: $mdn-super-light-grey
.chat-item.active
  background-color: $mdn-primary
  color: $mdn-white
</style>
