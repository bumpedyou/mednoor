<template>
  <div v-if="loading">
    <a-skeleton></a-skeleton>
  </div>
  <div v-else>
    <a-row>
      <a-col>
        <a-form-item label="Line 1">
          <a-input v-decorator="['line1', {
                  rules: [
                    {required: true, message: 'This field is required.'},
                    {min: 10, message: $t('v.min_10')},
                    {max: 60, message: $t('v.max_60')},
                  ]
                }]"  placeholder="Eg: Mr. Smith James Flat 7"></a-input>
        </a-form-item>
      </a-col>
    </a-row>
    <a-row>
      <a-col :md="8">
        <a-form-item label="City">
          <a-input v-decorator="['city', {
                  rules: [
                    {required: true, message: 'The City is required'},
                    {min: 2, message: $t('v.min_2')},
                    {max: 60, message: $t('v.max_60')},
                  ]
                }]"  placeholder="City"></a-input>
        </a-form-item>
      </a-col>
      <a-col :md="8">
        <a-form-item label="State">
          <a-input v-decorator="['state', {
                  rules: [
                    {required: true, message: 'The State is required'},
                    {min: 2, message: $t('v.min_2')},
                    {max:60, message: $t('v.max_60')},
                  ]
                }]"  placeholder="State"></a-input>
        </a-form-item>
      </a-col>
      <a-col :md="8">
        <a-form-item label="ZIP">
          <a-input v-decorator="['zip', {
                  rules: [
                    {required: true, message: 'The ZIP is required'},
                    {min: 2, message: $t('v.min_2')},
                    {max: 12, message: $t('v.max_12')},
                  ]
                }]"  placeholder="ZIP"></a-input>
        </a-form-item>
      </a-col>
    </a-row>
    <RequestModal ref="rmodal"></RequestModal>
  </div>
</template>

<script>

import userRoleMixin from "~/mixins/userRoleMixin";
import RequestModal from "~/components/RequestModal";

export default {
  name: "UserAddress",
  components: {
    RequestModal
  },
  mixins: [userRoleMixin],
  props: {
    form: {
      type: Object,
      default: ()=>({})
    }
  },
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
          this.$nextTick(()=>{
            this.$props.form.setFieldsValue({
              line1: data.addr_line1,
              city: data.addr_city,
              state: data.addr_state,
              zip: data.addr_zip,
            })
          })
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
