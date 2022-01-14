<template>
  <div v-if="loading">
    <v-skeleton-loader type="card"></v-skeleton-loader>
  </div>
  <div v-else>
    <v-row>
      <v-col>
        <v-text-field v-model="line1" label="Line 1" placeholder="Eg: Mr. Smith James Flat 7" :rules="[
          v => !!v || 'This field is required',
          v => !! v && v.length >= 10 || $t('v.min_10'),
          v => !! v && v.length <= 60 || $t('v.max_60'),
        ]"></v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-col md="4">
        <v-text-field v-model="city" label="City" placeholder="City" :rules="[
          v => !!v || 'The city is required',
          v => !!v && v.length > 1 || $t('v.min_2'),
          v => !!v && v.length <= 60 || $t('v.max_60'),
        ]"></v-text-field>
      </v-col>
      <v-col md="4">
        <v-text-field v-model="state" label="State" placeholder="State" :rules="[
          v => !!v || 'The state is required',
          v => !!v && v.length > 1 || $t('v.min_2'),
          v => !!v && v.length <= 60 || $t('v.max_60'),
        ]"></v-text-field>
      </v-col>
      <v-col md="4">
        <v-text-field v-model="zip" label="ZIP" placeholder="ZIP" :rules="[
          v => !!v || 'The ZIP is required',
          v => !!v && v.length > 1 || $t('v.min_2'),
          v => !!v && v.length <= 12 || $t('v.max_60'),
        ]"></v-text-field>
      </v-col>
    </v-row>
    <RequestModal ref="rmodal"></RequestModal>
  </div>
</template>

<script>
import userRoleMixin from "~/mixins/userRoleMixin";
import RequestModal from "~/components/RequestModal";
import addressMixin from "~/mixins/addressMixin";

export default {
  name: "UserAddress",
  components: {
    RequestModal
  },
  mixins: [userRoleMixin, addressMixin],
  data (){
    return {
      loading: true,
    }
  },
  mounted(){
    this.getAddress()
    this.$on('refresh', this.getAddress)
  },
  methods: {
    getAddress(){
      this.loading = true
      this.$api.get('/address', {
        params: {
          is_patient: this.isUser
        }
      }).then(({data})=>{
        this.loading = false
        if (data){
          this.$store.commit('address/setLine1', data.addr_line1)
          this.$store.commit('address/setCity', data.addr_city)
          this.$store.commit('address/setState', data.addr_state)
          this.$store.commit('address/setZip', data.addr_zip)
        }
      }).catch((err)=>{
        this.$refs.rmodal.$emit('error', err)
      }).finally(() => {
        this.loading = false
      })
    },
  }
}
</script>
