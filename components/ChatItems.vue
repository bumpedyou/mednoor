<template>
  <div>
    <div v-if="moderators && moderators.length > 0">
      <ChatItem :can-hover="false">
        <p class="h4">
          <span v-if="isMessanger">Messenger</span>
          <span v-if="!isMessanger">Chats</span>
          
        </p>
      </ChatItem>
      <ChatItem v-for='(m,i) in moderators' :key='"chat-" + i' :class="chatItemClass(m)" :active='to === m.user_uuid' @click="$emit('open-chat', m.user_uuid)">
        <div class="profile-wrapper">
          <div class="wrapper-indicator">
            <v-icon>mdi-chevron-right</v-icon>
          </div>
          <div>
            <ProfilePicture :user="m" :small="true"></ProfilePicture>
          </div>
          <div>
            {{ m.user_last_name }}, {{ m.user_first_name }}
            <span v-if="m.profe_credentials">
              {{m.profe_credentials}}
            </span>
            <div v-if="isModerator && !m.mypr_allowed" class="ml-1">
              <v-icon color="tomato">mdi-alert</v-icon>
            </div>
            <div v-if="m.messages">
              <v-badge
                :content="m.messages"
                color="tomato"
              ></v-badge>
            </div>
          </div>

        </div>
      </ChatItem>
    </div>
    <div v-else class="pa-1">
      <v-alert
        type="info"
      >
        You do not have chats.
      </v-alert>
      <div v-if="isModerator" class="mb-1 mt-1">
        Check your <nuxt-link :to="localePath('/chat-requests')">queue</nuxt-link> of appointments
      </div>
    </div>
  </div>
</template>

<script>
import ChatItem from "~/components/ChatItem";
import userRoleMixin from "~/mixins/userRoleMixin";
import ProfilePicture from "~/components/ProfilePicture";

export default {
  name: "ChatItems",
  components: {
    ProfilePicture,
    ChatItem,
  },
  mixins: [userRoleMixin],
  props: {
    data: {
      type: Array,
      default: ()=>[],
    },
    selectedChat: {
      type: String,
      default: '',
    },
    
  },
  computed: {
    to (){
      return this.$props.selectedChat
    },
    moderators(){
      return this.$props.data
    },
    isMessanger (){
      return this.$route.path.includes('messanger')
    }
  },
  methods: {
    chatItemClass(m){
      const c = []
      if (this.isModerator && !m.mypr_allowed){
        c.push('not-allowed')
      }
      return c.join(' ')
    }
  }
}
</script>

<style scoped lang="sass">
.not-allowed
  background-color: $mdn-super-light-grey
  color: $mdn-light-grey

.profile-wrapper
  display: flex
  flex-direction: row
  flex: 1
  position: relative
  padding-top: 0.3rem
  > div
    margin-bottom: 0.3rem
    padding: 0.3rem
  .wrapper-indicator
    position: absolute
    right: -0.6rem
    top: 1rem
@media screen and (min-width: $md)
  .profile-wrapper
    flex-direction: row

</style>
