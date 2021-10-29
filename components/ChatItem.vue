<template>
  <div :class='computedClass'>
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
    }
  },
  computed: {
    computedClass (){
      const c = ['chat-item']
      if (this.$props.active){
        c.push('active')
      }
      return c.join(' ')
    }
  }
}
</script>

<style scoped lang='sass'>
.chat-item
  width: 100%
  padding: 2rem 1rem
  display: flex
  align-items: center
  &:hover
    cursor: pointer
    background-color: $mdn-super-light-grey
.chat-item.active
  background-color: $mdn-primary
  color: $mdn-white
</style>
