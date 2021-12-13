export default {
  methods: {
    checkRedirect(){
      const q = this.$route.query
      if (q && q.callback){
        return this.$router.push(decodeURIComponent(q.callback))
      }else{
        return this.$router.push(this.localePath('/dashboard'))
      }
    }
  }
}
