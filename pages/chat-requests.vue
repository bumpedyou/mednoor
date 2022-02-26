<template>
  <div class="mh-100v">
    <v-row>
      <v-col>
        <p class='h4 mb-1'>
          Chat Queue
        </p>
        <v-data-table :items="items" :headers="[{
          text: 'User Name',
          value: 'user_first_name',
        }, {
          text: 'Date Requested',
          value: 'mypr_date',
        },
        {
          text: 'Accept',
          value: 'actions',
        }]">
          <template #[`item.user_first_name`] = "{item}">
            <nuxt-link :to="localePath('/user/' + item.user_uuid)">{{ item.user_first_name }} {{ item.user_last_name }}</nuxt-link>
          </template>
          <template #[`item.mypr_date`] = "{value}">
            {{dateString(value)}}
          </template>
          <template #[`item.actions`] = "{item}">
            <a href='javascript:void(0)' @click='aksAccept(item.mypr_id)'>{{$t('yes')}}</a>
            <MedDivider></MedDivider>
            {{$t('no')}}
          </template>
        </v-data-table>
      </v-col>
      <RequestDialog ref='rmodal'></RequestDialog>
      <ConfirmDialog v-model="visible" :description="$t('chat_ask_allow')" :loading="loadingModal" title="Accept chat request" @accept="allowChat" @cancel="visible = false"></ConfirmDialog>
    </v-row>
  </div>
</template>

<script>
import dateMixin from '~/mixins/dateMixin'
import authMixin from '~/mixins/authMixin'
import RequestDialog from '~/components/RequestModal'
 import ConfirmDialog from '~/components/ConfirmDialog'
export default {
  name: 'ChatRequests',
    components: {
    RequestDialog,
     ConfirmDialog
  },
  mixins: [dateMixin, authMixin],
  middleware: ['authenticated', 'not-blocked', 'not-deleted', 'verified', 'pin-set', 'view-set'],
  data (){
    return {
      selectedId: null,
      visible: false,
      loadingModal: false,
      items: [],
      columns: [
        {
          title: this.$t('usr_name'),
          dataIndex: 'user_first_name',
          key: 'user_first_name',
          slots: { title: this.$t('usr_name') },
          scopedSlots: { customRender: 'user_name' }
        },
        {
          title: this.$t('date_requested'),
          dataIndex: 'mypr_date',
          key: 'mypr_date',
          slots: { title: this.$t('date_requested') },
          scopedSlots: { customRender: 'mypr_date' }
        },
        {
          title: this.$t('accept'),
          dataIndex: 'mypr_id',
          key: 'mypr_id',
          slots: { title: this.$t('accept') },
          scopedSlots: { customRender: 'actions' }
        }
      ],
      socket: null,
    }
  },
  head() {
    return {
      title: this.$t('chat_requests'),
    }
  },
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
            this.$router.push({ path: this.localePath('/chat/' + item.user_uuid) })
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
