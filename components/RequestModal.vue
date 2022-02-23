<template>
  <div>
    <v-dialog v-model="localValue" persistent max-width="320px">
      <v-card>
        <v-card-title>
          {{title}}
        </v-card-title>
        <v-card-text>
          <p>
            {{description}}
          </p>
        </v-card-text>
        <v-card-actions>
          <v-btn small tile color="primary" @click="handleOk">Ok</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
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
      if (err !== null && err !== undefined){
        if (err.response){
          const r = err.response
          let d = {}
          if (r.data){
            d = r.data
          }
          if (r){
            if (r.status === 404){
              this.title = this.$t('not_found') + ' - ' + r.status
              this.description = this.$t('endp_not_found')
            }else if (r.status === 500){
              this.title = this.$t('int_srv_err') + ' ' + r.status
              this.description = this.$t('isnt_flt')
            }else if (r.message){
              this.description = r.message
            }else if (d.message) {
              this.description = d.message
            }
          }else if (d.message){
            this.description = d.message
          }else{
            this.description = this.$t('un_err')
          }
        }else if (typeof err === 'string'){
          this.description = err
        }else if (!err.status){
          this.description = this.$t('un_conn')
        }
      }else{
        console.log('no error?')
      }
      this.localValue = true
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
