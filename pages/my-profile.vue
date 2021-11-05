<template>
<div>
  <a-row>
    <a-col class='mt-1'>
      <a-card>
        <h1 class='h1'>Welcome - {{name}}</h1>
        <div v-if="!isUser && userRole !== 'guest'" class="user-role">
          Your Role:
          <b>{{userRole}}</b>
        </div>
      </a-card>
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
    }
  }
}
</script>

<style scoped lang="sass">
  .user-role
    background-color: tomato
    color: #fff
    border: 0
    border-radius: 0
    padding: 0.5rem 1rem
    display: inline-block
    text-transform: capitalize
</style>
