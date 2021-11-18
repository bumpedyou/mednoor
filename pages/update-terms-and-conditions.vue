<template>
<div class="pa-1 mh-100v">
  <a-row class="mb-1">
      <a-col>
            <a-breadcrumb>
            <a-breadcrumb-item><nuxt-link to="/dashboard">Dashboard</nuxt-link></a-breadcrumb-item>
          <a-breadcrumb-item>Update Terms and Conditions</a-breadcrumb-item>
        </a-breadcrumb>
      </a-col>
    </a-row>
    <a-row>
        <a-col :xs="24">
            <p class="h1">
                Update Terms and Conditions
            </p>
            <a-skeleton v-if="loading"/>
            <div v-else>
                <client-only>
                    <t-editor ref="editor" v-model="txt"></t-editor>
                </client-only>
                <a-button class="mt-1" type="primary" @click="update">
                    <spin-or-text v-model="loadingBtn">
                        Update Terms and Conditions
                    </spin-or-text>
                </a-button>
            </div>
        </a-col>
    </a-row>
</div>
</template>
<script>
import SpinOrText from '~/components/SpinOrText.vue'
import TEditor from '~/components/TEditor'
import vmodelMixin from '~/mixins/vmodelMixin'


export default {
    components: {
        TEditor,
        SpinOrText,
    },
    mixins: [vmodelMixin],
    layout: 'dashboard',
    data(){
        return {
            loadingBtn: false,
            txt: '',
            loading: true,
        }
    },
    mounted(){
        this.$api.get('/content/terms-conditions').then(({data})=>{
            console.log(data)
            if (data && data.teco_text){
                const t = data.teco_text
                this.$refs.editor.editor.commands.setContent(t)
            }
        }).finally(()=>{
            setTimeout(()=>{
                this.loading = false
            }, 600)
        })
    },
    methods: {
        update(){
            this.loadingBtn = true
            this.$api.put('/content/terms-conditions', {
                txt: this.txt,
            }).then(()=>{
                this.$message.success('Content has been updated successfully')
            }).catch(()=>{
                this.$message.error('There was a problem. Please try again later.')
            }).finally(()=>{
                this.loadingBtn = false
            })
        }
    },
}
</script>