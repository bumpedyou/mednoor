<template>
  <div v-if='isLoggedIn' class='mb-1 heart-actions'>
    <v-btn :color='owned ? "error" : "info"' small tile :loading="loadingHeart" @click='toggleOwned'>
      <span v-if='owned'>
        Remove from my doctors <v-icon>mdi-heart-off</v-icon>
      </span>
      <span v-else>
        Add to my doctors. <v-icon>mdi-heart-plus</v-icon>
      </span>
    </v-btn>
  </div>
</template>

<script>
import authMixin from "~/mixins/authMixin";

export default {
  name: "AddMyDoctors",
  mixins: [authMixin],
  props: {
    uuid: {
      type: String,
      default: null,
    }
  },
  data: () => ({
    owned: false,
    loadingHeart: false,
  }),
  computed: {
    id() {
      return this.$props.uuid
    }
  },
  mounted() {
    if (this.isLoggedIn) {
      this.$api.get('/my-doctor/' + this.id).then(({data}) => {
        this.owned = data.owned
      })
    }
  },
  methods: {
    toggleOwned() {
      this.loadingHeart = true
      if (this.uuid) {
        this.$api.post('/my-doctor/toggle/' + this.id).then(() => {
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
