<template>
  <div class="pa-6 mh-100v">
    <v-row class='mb-1'>
      <v-col>
        <v-breadcrumbs :items="[
          {
            text: $t('dashboard'),
            to: localePath('/dashboard'),
            disabled: false,
          },
          {
            text: 'Professional Requests',
            disabled: true,
          }
        ]"></v-breadcrumbs>
      </v-col>
    </v-row>
    <v-row>
      <v-col md="12">
        <p class="h4 mb-1">Professional Requests</p>
      </v-col>
      <v-col md="12">
        <v-skeleton-loader v-if="loading"></v-skeleton-loader>
        <v-data-table :items="data" :headers="[
          {
            text: 'Name',
            value: 'user_first_name',
            sortable: false,
          },
          {
            text: 'NPI',
            value: 'profe_npi',
            sortable: false,
          },
          {
            text: 'Category',
            value: 'cate_category',
            sortable: false,
          },
          {
            text: 'Actions',
            value: 'actions',
            sortable: false,
          },
        ]">
          <template #[`item.user_first_name`] = "{item}">
            <nuxt-link :to="localePath('/user/' + item.user_uuid)">
              {{item.user_first_name}} {{item.user_last_name}}
            </nuxt-link>
          </template>
          <template #[`item.actions`] = "{item}" >
            <span class="primary--text clickable" @click="askAllow(item.profe_uuid)">Allow</span>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
    <ConfirmDialog v-model="visible" description="The user will become a professional." :loading="confirmLoading" title="Are you sure?" @cancel="handleCancel" @accept="handleOk"></ConfirmDialog>
  </div>
</template>
<script>
import listenMixin from "~/mixins/listenMixin";

export default {
  name: "ProfessionalRequests",
  mixins: [listenMixin],
  layout: 'dashboard',
  middleware: ['authenticated' , 'verified', 'not-deleted', 'not-blocked', 'admin-or-super'],
  data (){
    return {
      confirmLoading: false,
      visible: false,
      loading: false,
      data: [],
      columns: [
        {
          title: 'Name',
          dataIndex: 'user_first_name',
          key: 'user_first_name',
          slots: { title: 'User Name' },
          scopedSlots: { customRender: 'user_first_name' }
        },
        {
          title: 'NPI',
          dataIndex: 'profe_npi',
          key: 'profe_npi',
          slots: { title: 'NPI' },
          scopedSlots: { customRender: 'profe_npi' }
        },
        {
          title: 'Category',
          dataIndex: 'cate_category',
          key: 'cate_category',
          slots: { title: 'Category' },
          scopedSlots: { customRender: 'cate_category' }
        },
        {
          title: 'Actions',
          dataIndex: 'actions',
          key: 'actions',
          slots: { title: 'Actions' },
          scopedSlots: { customRender: 'actions' }
        },
      ],
      uuid: null,
      socket: null,
    }
  },
  mounted() {
    this.run_once(this.listen)
    this.loadData()
  },
  methods: {
    loadData(){
      this.loading = true
      this.$api.get('/professional/not-accepted').then(({data})=>{
        this.loading = false
        if (data){
          this.data = data
        }
      })
    },
    listen(){
      this.socket = this.$nuxtSocket({})
      this.socket.emit('join-room', this.$auth.user.uuid)
      this.socket.on('professional-request', ()=>{
        this.loadData()
      })
    },
    handleOk(){
      this.confirmLoading = true
      this.$api.post('/professional/accept/' + this.uuid).then(()=>{
        this.data = this.data.filter((it)=>{
          return it.profe_uuid !== this.uuid
        })
      }).catch((err)=>{
        this.$toast.error(err)
      }).finally(()=>{
        this.visible = false
        this.confirmLoading = false
      })
    },
    handleCancel(){
      this.visible = false
    },
    askAllow(uuid){
      this.uuid = uuid
      this.visible = true
    }
  }
}
</script>

<style scoped>

</style>
