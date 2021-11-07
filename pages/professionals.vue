<template>
  <a-row>
    <a-col>
      <h1>Available Professionals</h1>
      <a-skeleton v-if='loading'/>
      <a-table v-else-if="users.length > 0" :columns='columns' :data-source='users'>
            <span slot="full_name" slot-scope="text, record">
              {{ record.user_first_name }} {{ record.user_last_name }}
            </span>
        <span slot="action" slot-scope="text, record">
              <!--<span slot="action">-->
                <!--<a v-if='record.mypr_id' @click='remove(record.user_uuid)'>Remove from my professional</a>-->
                <nuxt-link v-if="record.mypr_id" :to="{
                  path: '/',
                  query: {
                    chat: record.mypr_proffesional
                  }
                }">Chat</nuxt-link>
                <a v-else @click='save(record.user_uuid)'>Save as my proffesional</a>
              </span>
      </a-table>
      <div v-else>
        <p>
          No data available at the moment.
        </p>
      </div>
    </a-col>
    <a-col>
      <RequestModal ref="rmodal"></RequestModal>
    </a-col>
    <a-col>
      <a-modal
        title="Confirm action"
        :visible="visible"
        :confirm-loading="confirmLoading"
        @ok="handleOk"
        @cancel="handleCancel"
      >
        <p>Press ok to confirm action</p>
      </a-modal>
    </a-col>
  </a-row>
</template>

<script>
import RequestModal from "~/components/RequestModal"

export default {
  name: "Professionals",
  components: {
    RequestModal,
  },
  middleware: ['authenticated', 'not-blocked', 'not-deleted', 'verified'],
  data: () => ({
    visible: false,
    columns: [
      {
        title: 'Full Name',
        dataIndex: 'user_first_name',
        key: 'user_first_name',
        slots: {title: 'Full Name'},
        scopedSlots: {customRender: 'full_name'}
      },
      {
        title: 'Action',
        key: 'action',
        scopedSlots: {customRender: 'action'}
      }
    ],
    users: [],
    loading: true,
    confirmLoading: false,
    uuid: '',
    action: '',
  }),
  mounted() {
    this.getModerators()
  },
  methods: {
    getModerators(){
      this.loading = true
      this.$api.get('/user/moderators/' + this.$auth.user.uuid).then(({data}) => {
        this.users = data
      }).catch((err) => {
        this.$refs.rmodal.$emit('error', err)
      }).finally(() => {
        this.loading = false
      })
    },
    handleCancel(){
      this.visible = false
      this.uuid = null
      this.confirmLoading = false
    },
    handleOk(){
      this.confirmLoading = true
      if (this.action === 'save'){
        this.$api.post('/my-professional', {
          professional: this.uuid
        }).then(() => {
          this.getModerators()
        }).catch((err) => {
          this.$refs.rmodal.$emit('error', err)
        }).finally(() =>{
          this.confirmLoading = false
          this.visible = false
        })
      }
    },
    save(uuid) {
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
