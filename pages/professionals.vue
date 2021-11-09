<template>
  <a-row>
    <a-col>
      <h1>Available Professionals</h1>
      <a-skeleton v-if='loading' />
      <a-table v-else-if='users.length > 0' :columns='columns' :data-source='users'>
        <div slot='full_name' slot-scope='text, record'>
          {{ record.user_first_name }} {{ record.user_last_name }}
        </div>
        <div slot='action' slot-scope='text, record'>
          <span v-if='record.mypr_id'>
            <span v-if='record.mypr_allowed'>
              Your request has been accepted.
            </span>
            <span v-else>
              Chat Request Sent
            </span>
          </span>
          <a v-else @click='save(record.user_uuid)'>Send Chat Request</a>
        </div>
      </a-table>
      <div v-else>
        <p>
          No data available at the moment.
        </p>
      </div>
    </a-col>
    <a-col>
      <RequestModal ref='rmodal'></RequestModal>
    </a-col>
    <a-col>
      <a-modal
        title='Confirm action'
        :visible='visible'
        :confirm-loading='confirmLoading'
        @ok='handleOk'
        @cancel='handleCancel'
      >
        <p>Do you want to send a chat request to this user?</p>
      </a-modal>
    </a-col>
  </a-row>
</template>

<script>
import RequestModal from '~/components/RequestModal'
import authMixin from '~/mixins/authMixin'

export default {
  name: 'Professionals',
  components: {
    RequestModal
  },
  mixins: [authMixin],
  middleware: ['authenticated', 'not-blocked', 'not-deleted', 'verified'],
  data: () => ({
    visible: false,
    columns: [
      {
        title: 'Full Name',
        dataIndex: 'user_first_name',
        key: 'user_first_name',
        slots: { title: 'Full Name' },
        scopedSlots: { customRender: 'full_name' }
      },
      {
        title: 'Action',
        key: 'action',
        scopedSlots: { customRender: 'action' }
      }
    ],
    users: [],
    loading: true,
    confirmLoading: false,
    uuid: '',
    action: '',
    socket: null,
  }),
  mounted() {
    this.getModerators()
    this.socket = this.$nuxtSocket({})
    this.socket.emit('join-room', this.myUserId)
    console.log('Listening to chat-allowed on channel ' + this.myUserId)
    this.socket.on('chat-allowed', ()=>{
      this.getModerators()
    })
  },
  methods: {
    getModerators() {
      this.loading = true
      this.$api.get('/user/moderators/' + this.$auth.user.uuid).then(({ data }) => {
        this.users = data
      }).catch((err) => {
        this.$refs.rmodal.$emit('error', err)
      }).finally(() => {
        this.loading = false
      })
    },
    handleCancel() {
      this.visible = false
      this.uuid = null
      this.confirmLoading = false
    },
    handleOk() {
      this.confirmLoading = true
      if (this.action === 'save') {
        this.$api.post('/my-professional', {
          professional: this.uuid
        }).then(() => {
          console.log('then. getModerators')
          this.getModerators()
        }).catch((err) => {
          this.$refs.rmodal.$emit('error', err)
        }).finally(() => {
          this.confirmLoading = false
          this.visible = false
        })
      }
    },
    save(uuid) {
      console.log('Save --->', uuid)
      this.uuid = uuid
      this.action = 'save'
      this.visible = true
    },
    remove(uuid) {
      this.uuid = uuid
      this.action = 'remove'
      this.visible = true

    }
  }
}
</script>

<style scoped>

</style>
