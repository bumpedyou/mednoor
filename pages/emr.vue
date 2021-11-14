<template>
    <div class="pa-1 mh-100v">
        <a-row class="mb-1">
          <a-col>
                <a-breadcrumb>
                  <a-breadcrumb-item><nuxt-link to="/dashboard">Dashboard</nuxt-link></a-breadcrumb-item>
                  <a-breadcrumb-item>EMR</a-breadcrumb-item>
              </a-breadcrumb>
          </a-col>
        </a-row>
        <a-row>
            <a-col :xs="24" :sm="24">
                <p class="h1">
                    Electronic Medical Record
                </p>
                <a-button type="success" class="mb-1" @click="$router.push('/new-emr')">
                    <a-icon type="medicine-box"></a-icon>
                    New EMR 
                </a-button>
                <a-button type="raisin-black" class="mb-1" @click="$router.push({path: '/new-emr', query: {type: 'template'}})">
                    <a-icon type="medicine-box"></a-icon>
                    New Template
                </a-button>
            </a-col>
            <a-col :xs=24 class="mb-1">
                <a-select v-model="type" style="width: 120px" @change="handleChange">
                    <a-select-option value="record">
                        Record
                    </a-select-option>
                    <a-select-option value="template">
                        Template
                    </a-select-option>
                </a-select>
            </a-col>
            <a-col :xs="24" :sm="24">
                <a-table :columns='columns' :data-source='items'>
                    <div slot='patient' slot-scope='text, record'>
                        {{ record.user_first_name }} {{ record.user_last_name }}
                    </div>
                    <div slot="actions" slot-scope='text, record'>
                        <nuxt-link :to="{
                            path: '/new-emr',
                            query: {
                                mere: record.mere_uuid
                            }
                        }">Edit</nuxt-link>
                        <a-divider type='vertical' />
                        <span class="red--text clickable" @click="deleteItem(record.mere_uuid)">Delete</span>
                    </div>
                    <div slot="owner_name" slot-scope='text, record'>
                        {{record.owner_name}} {{record.owner_last_name}}
                    </div>
                    <div slot="mere_date" slot-scope='text, record'>
                        {{dateString(record.mere_date)}}
                    </div>
                </a-table>
            </a-col>
        </a-row>
    </div>    
</template>

<script>
import dateMixin from '~/mixins/dateMixin';
import userRoleMixin from '~/mixins/userRoleMixin';
export default {
    name: "EMR",
    mixins: [dateMixin, userRoleMixin],
    layout: "dashboard",
    middleware: ['authenticated', 'not-blocked', 'not-deleted'],
    data: ()=>({
        columns: [],
        items: [],
        type: 'record',
    }),
    mounted() {
        this.setColumns()
    },
    methods: {
        deleteItem(v){
            const that = this
            this.$confirm({
                content: 'Are you sure you want to delete this item?',
                onOk() {
                    return new Promise((resolve, reject)=>{
                        that.$api.delete('/medical-record/' + v).then(()=>{
                            setTimeout(()=>{
                                that.items = that.items.filter((it)=>{
                                    return it.mere_uuid !== v
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
        handleChange(v){
            console.log('Handle change!', v)
            this.setColumns()
        },
        setColumns(){
            if (this.type === 'record'){
                this.columns = [
                    {
                        title: 'Patient',
                        dataIndex: 'Patient',
                        key: 'patient',
                        slots: {title: 'patient'},
                        scopedSlots: {customRender: 'patient'}
                    },
                ]
                this.columns.push(
                    {
                        title: 'Created At',
                        dataIndex: 'mere_date',
                        key: 'mere_date',
                        slots: {title: 'Created At'},
                        scopedSlots: {customRender: 'mere_date'}
                    }, 
                    {
                        title: 'Actions',
                        dataIndex: 'actions',
                        key: 'actions',
                        slots: {title: 'Actions'},
                        scopedSlots: {customRender: 'actions'}
                })
                
            }else{
                this.columns = [
                    {
                        title: 'Template Name',
                        dataIndex: 'mere_name',
                        key: 'mere_name',
                        slots: {title: 'Template Name'},
                        scopedSlots: {customRender: 'mere_name'}
                    }
                ]

                if (this.isAdmin || this.isSuper){
                    this.columns.push(
                    {
                        title: 'Created By',
                        dataIndex: 'owner_name',
                        key: 'owner_name',
                        slots: {title: 'Created By'},
                        scopedSlots: {customRender: 'owner_name'}
                    })
                }

                this.columns.push(
                {
                    title: 'Created At',
                    dataIndex: 'mere_date',
                    key: 'mere_date',
                    slots: {title: 'Created At'},
                    scopedSlots: {customRender: 'mere_date'}
                }, 
                {
                    title: 'Actions',
                    dataIndex: 'actions',
                    key: 'actions',
                    slots: {title: 'Actions'},
                    scopedSlots: {customRender: 'actions'}
                })
            }
            this.$api.get('/medical-record', {
                params: {
                    type: this.type
                }
            }).then(({data})=>{
                this.items = data
                console.log(this.items)
            })
        }
    }
}
</script>