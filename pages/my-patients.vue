<template>
    <div class="pa-1 mh-100v">
        <a-row>
            <a-col :xs="24" :lg="24">
                <p class="h1">
                    {{$t('my_patients')}}
                </p>
            </a-col>
        </a-row>
        <a-row>
            <a-col>
                <a-table :columns="columns" :data-source="items">
                    <div  slot="actions" slot-scope="text, record">
                        <nuxt-link :to="{path: localePath('/new-emr'), query: {mere: record.mere_uuid}}">{{$t('mre')}}</nuxt-link>
                    </div>
                </a-table>
            </a-col>
        </a-row>
    </div>
</template>
<script>
export default {
    name: 'MyPatients',
    layout: 'default',
    data (){
      return {
        columns: [
          {
            title: this.$t('patients_name'),
            dataIndex: 'full_name',
            key: 'full_name',
            slots: {title: this.$t('patients_name')},
            scopedSlots: {customRender: 'full_name'}
          },
          {
            title: this.$t('actions'),
            dataIndex: 'actions',
            key: 'actions',
            slots: {title: this.$t('actions')},
            scopedSlots: {customRender: 'actions'}
          },
        ],
        items: [],
        loading: true,
      }
    },
    mounted(){
        this.$api.get('/medical-record/patients').then(({data})=>{
            this.items = data
        }).catch(()=>{
            this.$toast.error(this.$t('could_nl_p').toString())
        })
    }
}
</script>
