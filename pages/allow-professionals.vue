<template>
<a-row>
  <a-col>
    <h1>Allow Users</h1>
    <p>
      Allow users to send messages to a professional.
    </p>
    <a-table :columns='columns' :data-source='items'>
            <span slot="professional" slot-scope="text, record">
              {{ record.fn1 }} {{ record.ln1 }}
            </span>
      <span slot="user" slot-scope="text, record">
              {{ record.fn2 }} {{ record.ln2 }}
            </span>
      <span slot="action" slot-scope="text, record">
              <!--<span slot="action">-->
                <span v-if="record.mypr_allowed">This user is allowed</span>
                <a v-else @click='allow(record.mypr_id)'>Allow user</a>
              </span>
    </a-table>
  </a-col>
  <RequestModal ref='rmodal'></RequestModal>
</a-row>
</template>

<script>
import RequestModal from '~/components/RequestModal'

export default {
  name: "AllowProfessionals",
  components: {
    RequestModal
  },
  middleware: ['authenticated'],
  data: ()=>({
    items: [],
    columns: [
      {
        title: 'Professional',
        dataIndex: 'fn1',
        key: 'fn1',
        slots: {title: 'Professional'},
        scopedSlots: {customRender: 'professional'}
      },
      {
        title: 'User',
        dataIndex: 'fn2',
        key: 'fn2',
        slots: {title: 'User'},
        scopedSlots: {customRender: 'user'}
      },
      {
        title: 'Action',
        key: 'action',
        scopedSlots: {customRender: 'action'}
      }
    ],
  }),
  mounted (){
    this.getItems()
  },
  methods: {
    getItems(){
      this.$api.get('/my-professional/all').then(({data})=>{
        console.log('Data is', data)
        this.items = data
      })
    },
    allow (id) {
      console.log('Allow', id)
      this.$api.post('/my-professional/allow/' + id).then(({data})=>{
        this.getItems()
      }).catch((err)=>{
        this.$refs.rmodal.$emit('error', err)
      })
    }
  }
}
</script>

<style scoped>

</style>
