<template>
  <div>
    <navbar></navbar>
    <div id="app-content">
      <Nuxt></Nuxt>
    </div>
    <MFooter></MFooter>
  </div>
</template>

<script>
import Navbar from '~/components/Navbar'
import MFooter from '~/components/MFooter'
import authMixin from '~/mixins/authMixin'
import listenMixin from '~/mixins/listenMixin'
import userUpdatedMixin from '~/mixins/userUpdatedMixin'
export default {
  name: 'Default',
  components: {
    Navbar,
    MFooter
  },
  mixins: [authMixin, listenMixin, userUpdatedMixin],
  data: ()=>({
    socket: null,
  }),
  watch:{
    isLoggedIn(loggedIn){
      if (loggedIn){
        this.run_once(this.listen)
      }else{
        this.socket = null
      }
    }
  },
  mounted(){
  },
  methods: {
    listen() {
      this.socket = this.$nuxtSocket({ persist: 'defaultSocket' })
      this.socket.emit('join-room', this.$auth.user.uuid)
      this.socket.on('fetch-user', async ()=>{
        await this.$auth.fetchUser()
        this.user_was_updated()
      })
    }
  }
}
</script>

<style scoped lang='sass'>
#app-content
  margin-top: 50px
</style>
