<template>
  <div>
    <ChatItem v-for='(m,i) in moderators' :key='"chat-" + i' :active='to === m.user_uuid' @click="$emit('open-chat', m.user_uuid)">
      {{ m.user_first_name }} {{ m.user_last_name }}
      <div v-if="m.messages">
        <a-badge :count="m.messages" class="ml-1" :number-style="{
                    backgroundColor: 'tomato',
                    color: '#fff',
                    boxShadow: '0 0 0 1px #eee inset',
                    }"
        />
      </div>
    </ChatItem>
  </div>
</template>

<script>
import ChatItem from "~/components/ChatItem";
export default {
  name: "ChatItems",
  components: {
    ChatItem,
  },
  props: {
    data: {
      type: Array,
      default: ()=>[],
    },
    selectedChat: {
      type: String,
      default: '',
    }
  },
  computed: {
    to (){
      return this.$props.selectedChat
    },
    moderators(){
      return this.$props.data
    }
  }
}
</script>

<style scoped>

</style>
