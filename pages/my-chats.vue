<template>
<a-row class="pa-1 mh-100v">
  <a-col :xs='24' :sm='24'>
    <p class='h1'>
      Previous Chats (PDF)
    </p>
    <a-skeleton v-if="loading"/>
    <a-table v-else :columns='columns' :data-source='items'>
      <div slot='date' slot-scope='text, record'>
        {{dateString(record.date)}}
      </div>
      <div slot="pdf" slot-scope="text, record">
        <a :href='pdfPath(record.pdf)' :download='pdfPath(record.pdf)' target='_blank'>Download PDF</a>
      </div>
    </a-table>
  </a-col>
  <RequestModal ref='rmodal'></RequestModal>
</a-row>
</template>

<script>
import RequestModal from '~/components/RequestModal'
import authMixin from '~/mixins/authMixin'
import dateMixin from '~/mixins/dateMixin'
export default {
  name: 'MyChats',
  components: { RequestModal },
  mixins: [authMixin, dateMixin],
  middleware: ['authenticated', 'not-blocked', 'not-deleted'],
  data: ()=>({
    loading: true,
    items: [],
    components: {
      RequestModal
    },
    columns: [
      {
        title: 'Chat with',
        dataIndex: 'full_name',
        key: 'full_name',
        slots: {title: 'Chat with'},
        scopedSlots: {customRender: 'full_name'}
      },
      {
        title: 'Date',
        dataIndex: 'date',
        key: 'date',
        slots: {title: 'Date'},
        scopedSlots: {customRender: 'date'}
      },
      {
        title: 'PDF',
        dataIndex: 'pdf',
        key: 'pdf',
        slots: {title: 'PDF'},
        scopedSlots: {customRender: 'pdf'}
      },
    ]
  }),
  head() {
    return {
      title: 'My Chats',
    }
  },
  mounted(){
    console.log('Mounted')
    this.$api.get('/previous-chats').then(({data})=>{
      console.log('My previous chats are --->', data)
      this.items = []
      data.forEach((item)=>{

        if (item.uuid2 === this.myUserId){
          this.items.push({
            full_name: item.fn1 + ' ' + item.ln1,
            uuid: item.uuid1,
            pdf: item.prco_pdf,
            date: item.prco_date
          })
        }else {
          this.items.push({
            full_name: item.fn2 + ' ' + item.ln2,
            uuid: item.uuid2,
            pdf: item.prco_pdf,
            date: item.prco_date
          })
        }

      })
    }).catch((err)=>{
      this.$refs.rmodal.$emit('error', err)
    }).finally(()=>{
      this.loading = false
    })
  },
  methods: {
    pdfPath(pdfName){
      return process.env.API_URL + '/generated/' + pdfName
    }
  }
}
</script>

<style scoped>

</style>
