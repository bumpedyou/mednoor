<template>
  <div v-if='isLoggedIn' class='mb-1 heart-actions'>
    <a-button :type='owned ? "danger" : "old-rose"' @click='toggleOwned'>
      <SpinOrText v-model='loadingHeart' dark>
                <span v-if='owned'>
                  Remove from my doctors <a-icon type='heart' theme='filled' />
                </span>
        <span v-else>
                  Add to my doctors. <a-icon type='heart' />
                </span>
      </SpinOrText>
    </a-button>
  </div>
</template>

<script>
import SpinOrText from "~/components/SpinOrText";
import authMixin from "~/mixins/authMixin";

export default {
  name: "AddMyDoctors",
  components: {
    SpinOrText,
  },
  mixins: [authMixin],
  props: {
    uuid: {
      type: String,
      default: null,
    }
  },
  data: ()=>({
    owned: false,
    loadingHeart: false,
  }),
  computed: {
    id (){
      return this.$props.uuid
    }
  },
  mounted (){
    if (this.isLoggedIn) {
      this.$api.get('/my-doctor/' + this.id).then(({ data }) => {
        this.owned = data.owned
      })
    }
  },
  methods: {
    toggleOwned(){
      this.loadingHeart = true
      if (this.uuid){
        this.$api.post('/my-doctor/toggle/' + this.id).then(()=>{
          this.owned = !this.owned
        }).catch((err) => {
          this.$refs.rmodal.$emit('error', err)
        }).finally(() => {
          this.loadingHeart = false
        })
      }
    },
  }
}
</script>

<style scoped>
</style>
