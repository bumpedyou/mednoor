<template>
  <div>
    <a-row>
      <a-col>
        <h1>Users list</h1>
        <a-skeleton v-if='loading' />
        <a-table v-else :columns='columns' :data-source='users'>
              <span slot="action" slot-scope="text, record">
              <!--<span slot="action">-->
                <a v-if="record.usro_key === 'USER'" @click='updateToProfessional(record.user_uuid)'>Update to Professional</a>
                <a v-if="record.usro_key === 'MODERATOR'" @click='downgradeProfessional(record.user_uuid)'>Remove from Professionals</a>
                <a-divider type="vertical" />
                <a v-if='record.user_blocked' @click='unblock(record.user_uuid)'>
                  Unblock
                </a>
                <a v-else @click='block(record.user_uuid)'>
                  Block
                </a>
                <a-divider type="vertical" />
                <a v-if="(Boolean(record.user_deleted)) === false"  @click='deleteUser(record.user_uuid)'>Delete</a>
              </span>
        </a-table>
      </a-col>
    </a-row>
    <RequestModal ref='rmodal'></RequestModal>
    <a-modal v-model="visible" title="Confirm action" ok-text="Ok" :loading='loadingModal' cancel-text="Cancel" @ok="confirmAction">
      <p v-if="action === 'delete'">
        Delete this element
      </p>
      <p v-else>
        Confirm this action
      </p>
    </a-modal>
  </div>
</template>

<script>
import RequestModal from '~/components/RequestModal'

export default {
  name: 'UsersList',
  components: {
    RequestModal
  },
  layout: 'default',
  middleware: ['authenticated', 'moderator-or-higher', 'not-blocked', 'not-deleted'],
  data: () => ({
    users: [],
    columns: [
      {
        dataIndex: 'user_email',
        key: 'email',
        slots: { title: 'Email' },
        scopedSlots: { customRender: 'email' }
      },
      {
        title: 'Role',
        dataIndex: 'usro_role',
        key: 'role'
      },
      {
        title: 'Action',
        key: 'action',
        scopedSlots: { customRender: 'action' }
      }
    ],
    visible: false,
    action: '',
    loading: true,
    loadingModal: false,
    uuid: null,
  }),
  mounted() {
    this.$api.get('/user').then(({ data }) => {
      this.users = data
    }).catch(err => {
      this.$refs.rmodal.$emit('error', err)
    }).finally(() =>{
      this.loading = false
    })
  },
  methods: {
    askConfirmation(uuid){
      this.uuid = uuid
      this.visible = true
    },
    block(uuid){
      this.askConfirmation(uuid)
      this.action = 'block'
      console.log('Block', uuid)
    },
    unblock(uuid){
      this.askConfirmation(uuid)
      this.action = 'unblock'
    },
    downgradeProfessional(uuid){
      this.askConfirmation(uuid)
      this.action = 'update-to-user'
    },
    confirmAction(){
      this.loadingModal = true
      if (this.action === 'delete'){
        this.$api.delete('/user/' + this.uuid).then(()=>{
          this.users = this.users.filter((user)=>{
            return user.user_uuid !== this.uuid
          })
          this.uuid = null
        }).catch((err)=>{
          this.$refs.rmodal.$emit('error', err)
        }).finally(() =>{
          this.visible = false
          this.loadingModal = false
        })
      }else if (this.action === 'update-to-professional' || this.action === 'update-to-user'){
        this.loadingModal = true
        this.$api.put('/user/role/' + this.uuid, {
          key: this.action === 'update-to-professional' ? 'MODERATOR' : 'USER'
        }).then(({data})=>{
          console.log('Updated. New data --->', data)
          this.users = this.users.map((usr)=>{
            if (usr.user_uuid === this.uuid){
              usr.usro_id = data.usro_id
              usr.usro_key = data.usro_key
              usr.usro_role = data.usro_role
            }
            return usr
          })
        }).catch((err)=>{
          this.$refs.rmodal.$emit('error', err)
        }).finally(() =>{
          this.visible = false
          this.loadingModal = false
        })
      }else if (this.action === 'block' || this.action === 'unblock'){
        this.loadingModal = true
        const blocked = this.action === 'block'
        this.$api.put('/user/blocked/' + this.uuid, {
          blocked
        }).then(() =>{
          this.users = this.users.map((user)=>{
            if (user.user_uuid === this.uuid){
              user.user_blocked = blocked
            }
            return user
          })
        }).catch((err) =>{
          this.$refs.rmodal.$emit('error', err)
        }).finally(() =>{
          this.loadingModal = false
          this.visible = false
          this.uuid = null
        })
      }
    },
    updateToProfessional(uuid){
      this.uuid = uuid
      this.visible = true
      this.action = 'update-to-professional'
      console.log('Update to professional ' + uuid)
    },
    deleteUser(uuid){
      this.uuid = uuid
      this.visible = true
      this.action = 'delete'
      console.log('Delete user ' + uuid)
    }
  }
}
</script>

<style scoped>

</style>
