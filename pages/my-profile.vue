<template>
<div>
  <a-row class="pa-1">
    <a-col :xs="24">
      <div>
        <h1 class="h1 mb-1"  style="display: flex; align-items: center">
          My Profile <span v-if="!isUser && userRole !== 'guest'" class="user-role ml-1">
        Your Role:
        <b class="b-white">{{userRoleTxt}}</b>
      </span></h1>
      </div>
    </a-col>
    <a-col :xs="24" :sm="24" :md="12">
      <p>
        <b>Your Name:</b>
        <span>{{name}}</span>
      </p>
      <p>
        <b>Your Email:</b>
        <span>{{email}}</span>
      </p>

    </a-col>
    <a-col :xs="24" :sm="24" :md="12">
      <p class="h3 mb-0">
        Options:
      </p>
      <ul>
        <li>
          <nuxt-link to="/change-my-password">
            Change my password
          </nuxt-link>
        </li>
        <li>
          <nuxt-link to="/sign-out">Sign out <img :src="require('~/static/icon/sign-out.svg')" height="20px" alt="sign out icon" /></nuxt-link>
        </li>
      </ul>
    </a-col>
  </a-row>

</div>
</template>

<script>
import userRoleMixin from "~/mixins/userRoleMixin";

export default {
  name: "MyProfile",
  mixins: [userRoleMixin],
  middleware: ['authenticated', 'not-blocked', 'not-deleted', 'verified'],
  computed: {
    user() {
      return this.$auth.user
    },
    name (){
      return this.user.user_first_name + ' ' + this.user.last_name
    },
    email (){
      return this.user.email
    }
  },
  head() {
    return {
      title: 'My Profile',
    }
  },
}
</script>

<style scoped lang="sass">
  .user-role
    background-color: $mdn-primary
    color: #fff
    border: 0
    border-radius: 0
    padding: 0.5rem 1rem
    display: inline-block
    text-transform: capitalize
    font-size: 15px !important
</style>
