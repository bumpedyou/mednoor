<template>
    <div class="pa-1 mh-100v">
        <a-row class="mb-1">
            <a-col>
                <a-breadcrumb>
                <a-breadcrumb-item><nuxt-link to="/dashboard">Dashboard</nuxt-link></a-breadcrumb-item>
                <a-breadcrumb-item>Pages</a-breadcrumb-item>
                </a-breadcrumb>
            </a-col>
        </a-row>
        <a-row>
            <a-col :xs="24">
                <p class="h1">Pages</p>
                <a-button type="raisin-black" @click="$router.push('/new-page')">New Page</a-button>
                <a-skeleton v-if="loading"/>
                <a-table v-else :columns='columns' :data-source='items'>
                    <div slot='page_actions' slot-scope='text, record'>
                        <nuxt-link :to="{path: '/new-page', query: {page: record.page_uuid}}">Update</nuxt-link>
                        <a-divider type='vertical' />
                        <span class="red--text clickable" @click="deleteItem(record.page_uuid)">Delete</span>
                    </div>
                </a-table>
            </a-col>
        </a-row>
    </div>
</template>
<script>
export default {
    layout: 'dashboard',
    middleware: ['authenticated', 'verified', 'not-blocked', 'not-deleted', 'admin-or-super'],
    data: ()=>({
        loading: true,
        items: [],
        columns: [
            {
                title: 'Title',
                dataIndex: 'page_title',
                key: 'page_title',
                slots: {title: 'page_title'},
                scopedSlots: {customRender: 'page_title'}
            },
            {
                title: 'Slug',
                dataIndex: 'page_slug',
                key: 'page_slug',
                slots: {title: 'page_slug'},
                scopedSlots: {customRender: 'page_slug'}
            },
            {
                title: 'Keywords',
                dataIndex: 'page_keywords',
                key: 'page_keywords',
                slots: {title: 'page_keywords'},
                scopedSlots: {customRender: 'page_keywords'}
            },
            {
                title: 'Actions',
                dataIndex: 'page_actions',
                key: 'page_actions',
                slots: {title: 'page_actions'},
                scopedSlots: {customRender: 'page_actions'}
            },
        ]
    }),
    mounted (){
        this.$api.get('/page').then(({data})=>{
            this.items = data
        }).finally(()=>{
            this.loading = false
        })
    },
    methods: {
        deleteItem(v){
            console.log('Delete Item!')
                    const that = this
            this.$confirm({
                content: 'Are you sure you want to delete this item?',
                onOk() {
                    return new Promise((resolve, reject)=>{
                        that.$api.delete('/page/' + v).then(()=>{
                            setTimeout(()=>{
                                that.items = that.items.filter((it)=>{
                                    return it.page_uuid !== v
                                })
                                resolve()
                            }, 600)
                        }).catch((err)=>{
                            resolve(err)
                        })
                    })
                },
                cancelText: 'Cancel',
                onCancel() {
                    that.$destroyAll();
                },
            });
        },
    }
}
</script>