<template>
  <div>
    <a-modal v-model="localValue" :title="title" on-ok="handleOk">
      <template slot="footer">
        <a-button key="submit" type="primary" @click="handleOk">
          Ok
        </a-button>
      </template>
      <p>{{description}}</p>
    </a-modal>
  </div>
</template>

<script>
import vModelMixin from '~/mixins/vmodelMixin'

export default {
  name: 'RequestModal',
  mixins: [vModelMixin],
  data: ()=>({
    title: 'Error',
    description: 'Oops! Something has happened here', // Default message
  }),
  mounted() {
    this.$on('error', (err) => {
      console.log('ON ERR err --->', err)

      if (err !== null && err !== undefined){
        if (err.response){
          const r = err.response
          let d = {}
          if (r.data){
            d = r.data
          }
          if (r.status === 404){
            this.title = 'Not found - ' + r.status
            this.description = 'The endpoint was not found'
          }else if (r.status === 500){
            this.title = 'Internal server error ' + r.status
            this.description = "This isn't your fault. We are working hard to fix this problem."
          }else if (r.msg){
            this.description = r.msg
          }else if (d.msg){
            this.description = d.msg
          }
        }else if (typeof err === 'string'){
          this.description = err
        }else if (!err.status){
          this.description = "Unable to connect to the server. Please check your internet connection."
        }
      }
      this.localValue = true
    })
    this.$on('success', (message) => {
      console.log('Success ' + message)
    })
  },
  methods: {
    handleOk(){
      this.localValue = false
      this.$emit('ok')
    },
  }
}
</script>

<style scoped>

</style>
