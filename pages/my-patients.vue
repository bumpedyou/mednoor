<template>
    <div class="pa-1 mh-100v">
        <a-row>
            <a-col :xs="24" :lg="24">
                <p class="h1">
                    My Patients
                </p>
            </a-col>
        </a-row>
        <a-row>
            <a-col>
                <a-table :columns="columns" :data-source="items">
                    <div  slot="actions" slot-scope="text, record">
                        <nuxt-link :to="{path: '/new-emr', query: {mere: record.mere_uuid}}">MRE</nuxt-link>
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
    data: ()=>({
        columns: [
            {
                title: 'Patient\'s name',
                dataIndex: 'full_name',
                key: 'full_name',
                slots: {title: 'Patient\'s name'},
                scopedSlots: {customRender: 'full_name'}
            },
            {
                title: 'Action',
                dataIndex: 'actions',
                key: 'actions',
                slots: {title: 'Actions'},
                scopedSlots: {customRender: 'actions'}
            },
        ],
        items: [],
        loading: true,
    }),
    mounted(){
        this.$api.get('/medical-record/patients').then(({data})=>{
            this.items = data
        }).catch(()=>{
            this.$message.error('Could not load the')
        })
    }
}
</script>