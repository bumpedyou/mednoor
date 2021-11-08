<template>
  <a-row>
    <a-col>
      <p class='h1'>
        Chat Requests
      </p>
      <a-table :columns='columns' :data-source='items'>
        <div slot='user_name' slot-scope='text, record'>
          {{ record.user_first_name }} {{ record.user_last_name }}
        </div>
        <div slot='mypr_date' slot-scope='text'>
          {{dateString(text)}}
        </div>
        <div slot='actions' slot-scope='text, record'>
          <a href='javascript:void(0)' @click='aksAccept(record.mypr_id)'>Yes</a>
          <a-divider type='vertical' />
          No
        </div>
      </a-table>
    </a-col>
    <RequestDialog ref='rmodal'></RequestDialog>
    <a-modal v-model='visible' title='Accept chat request' ok-text='Accept chat request' :confirm-loading='loadingModal' cancel-text='Cancel'  @ok='allowChat'>
      <p>
        Do you really want to allow this user to chat with you?
      </p>
    </a-modal>
  </a-row>
</template>

<script>
import RequestDialog from '~/components/RequestModal'
import dateMixin from '~/mixins/dateMixin'
import authMixin from '~/mixins/authMixin'

export default {
  name: 'ChatRequests',
  components: {
    RequestDialog
  },
  mixins: [dateMixin, authMixin],
  middleware: ['authenticated', 'not-blocked', 'not-deleted'],
  data: () => ({
    selectedId: null,
    visible: false,
    loadingModal: false,
    items: [],
    columns: [
      {
        title: 'User Name',
        dataIndex: 'user_first_name',
        key: 'user_first_name',
        slots: { title: 'User Name' },
        scopedSlots: { customRender: 'user_name' }
      },
      {
        title: 'Date Requested',
        dataIndex: 'mypr_date',
        key: 'mypr_date',
        slots: { title: 'Date Requested' },
        scopedSlots: { customRender: 'mypr_date' }
      },
      {
        title: 'Accept',
        dataIndex: 'mypr_id',
        key: 'mypr_id',
        slots: { title: 'Accept' },
        scopedSlots: { customRender: 'actions' }
      }
    ],
    socket: null,
  }),
  mounted() {
    this.socket = this.$nuxtSocket({})
    this.socket.emit('join-room', this.myUserId)
    this.socket.on('chat-request', ()=>{
      this.loadRequests()
    })
    this.loadRequests()
  },
  methods: {
    loadRequests(){
      this.$api.get('/my-professional/not-accepted').then(({ data }) => {
        this.items = data
      }).catch((err) => {
        this.$refs.rmodal.$emit('error', err)
      })
    },
    aksAccept(id){
      this.selectedId = id
      this.visible = true
    },
    allowChat(){
      this.loadingModal = true
      this.$api.post('/my-professional/allow/' + this.selectedId).then(()=>{
        this.items = this.items.filter((item)=>{
          if (item.mypr_id === this.selectedId){
            this.$router.push({
              path: '/',
              query: {
                chat: item.user_uuid
              }
            })
          }
          return item.mypr_id !== this.selectedId
        })
      }).catch((err)=>{
        this.$refs.rmodal.$emit('error', err)
      }).finally(()=>{
        this.visible = false
        this.loadingModal = false
        this.selectedId = null
      })
    }
  }
}
</script>

<style scoped>

</style>
