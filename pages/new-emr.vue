<template>
    <a-form class="pa-1 mh-100v" :form="form" @submit="handleSubmit">
        <a-row class="mb-1">
          <a-col>
                <a-breadcrumb>
                  <a-breadcrumb-item><nuxt-link to="/dashboard">Dashboard</nuxt-link></a-breadcrumb-item>
                  <a-breadcrumb-item><nuxt-link to="/emr">EMR</nuxt-link></a-breadcrumb-item>
                  <a-breadcrumb-item>
                      <span v-if="isTemplate">
                          EMR Template
                      </span>
                      <span v-else>
                          EMR
                      </span>
                  </a-breadcrumb-item>
              </a-breadcrumb>
          </a-col>
        </a-row>
        <a-row>
            <a-col :xs="24">
                <p class="h1">
                    <span v-if="isTemplate">
                        <span v-if="recordId">Update Template</span>
                        <span v-else>Create Template</span>
                    </span>
                    <span v-else>
                        <span v-if="recordId">Update Record</span>
                        <span v-else>Create Record</span>
                        
                    </span>
                </p>
            </a-col>
        </a-row>
        <a-row>
            <a-col :xs="24" :sm="24" :md="12">
                <a-form-item>
                    <a-input v-if="isTemplate"
                        v-decorator="[
                                'template_name',
                                { rules: [
                                    { required: true, message: 'Please enter a template name' },
                                    { min: 2, message: 'Enter at least 2 characters'}
                                ] },
                            ]"
                        type="Template Name"
                        placeholder="Template Name" >
                    </a-input>
                    <a-auto-complete v-else v-model="userSearch" :data-source="usersList" placeholder="Search user" :disabled="!!recordId" >
                        <a-icon slot="suffix" type="search" style="color:rgba(0,0,0,.25)" />
                    </a-auto-complete>
                </a-form-item>
            </a-col>
            <a-col v-if="!isTemplate" :xs="24" :sm="24" :md="12">
                <a-form-item>
                    <a-auto-complete :data-source="templatesList" placeholder="Template Name" allow-clear @change="changeTemplate" />
                </a-form-item>
            </a-col>
        </a-row>
        <a-row>
            <a-col :xs="24">
                <a-tabs default-active-key="1">
                    <a-tab-pane key="1" tab="Allergies" force-render>
                        <a-form-item>
                            <a-textarea  v-decorator="['allergies', { rules: [{ max: 2000, message: 'Please enter a maximum of 2000 characters.' }] }]" placeholder="Allergies" :rows="6" :disabled="isDisabled" />
                        </a-form-item>
                    </a-tab-pane>
                    <a-tab-pane key="2" tab="Current Meds" force-render>
                        <a-form-item>
                            <a-textarea v-decorator="['current_meds', { rules: [{ max: 2000, message: 'Please enter a maximum of 2000 characters.' }] }]" placeholder="Current Meds" :rows="6" :disabled="isDisabled" />
                        </a-form-item>
                    </a-tab-pane>
                    <a-tab-pane key="3" tab="Medical history" force-render>
                        <a-form-item>
                            <a-textarea v-decorator="['medical_history', { rules: [{ max: 2000, message: 'Please enter a maximum of 2000 characters.' }] }]" placeholder="Medical History" :rows="6" :disabled="isDisabled" />
                        </a-form-item>
                    </a-tab-pane>
                    <a-tab-pane key="4" tab="Social History" force-render>
                        <a-form-item>
                            <a-textarea  v-decorator="['social_history', { rules: [{ max: 2000, message: 'Please enter a maximum of 2000 characters.' }] }]"  placeholder="Social History" :rows="6" :disabled="isDisabled" />
                        </a-form-item>
                    </a-tab-pane>
                    <a-tab-pane key="5" tab="Family History" force-render>
                        <a-form-item>
                            <a-textarea v-decorator="['family_history', { rules: [{ max: 2000, message: 'Please enter a maximum of 2000 characters.' }] }]" placeholder="Family History" :rows="6" :disabled="isDisabled" />
                        </a-form-item>
                    </a-tab-pane>
                </a-tabs>
            </a-col>
        </a-row>
        <a-row class="mt-1 mb-1">
            <a-col :xs="24">
                <div layout="vertical" class="emr-inline-inputs">
                    <a-form-item
                        label="BP">
                        <a-input v-decorator="['bp', { rules: [{ max: 10, message: 'Please enter a maximum of 10 characters.' }] }]" placeholder="BP" :disabled="isDisabled" />
                    </a-form-item>
                    <a-form-item
                        label="Pulse" >
                        <a-input v-decorator="['pulse', { rules: [{ max: 10, message: 'Please enter a maximum of 10 characters.' }] }]" placeholder="Pulse" :disabled="isDisabled" />
                    </a-form-item>
                    <a-form-item
                        label="Resp. Rate" >
                        <a-input v-decorator="['resp_rate', { rules: [{ max: 10, message: 'Please enter a maximum of 10 characters.' }] }]" placeholder="Resp. Rate" :disabled="isDisabled" />
                    </a-form-item>
                     <a-form-item
                        label="Temp" >
                        <a-input v-decorator="['temp', { rules: [{ max: 10, message: 'Please enter a maximum of 10 characters.' }] }]" placeholder="Temp" :disabled="isDisabled" />
                    </a-form-item>
                    <a-form-item
                        label="Height (in)" >
                        <a-input v-decorator="['height', {}]" placeholder="Height (in)" :disabled="isDisabled" @input="updateBMI" />
                    </a-form-item>
                    <a-form-item
                        label="Weight (lb)" >
                        <a-input v-decorator="['weight', {}]" placeholder="Weight (lb)" :disabled="isDisabled" @input="updateBMI" />
                    </a-form-item>
                    <a-form-item
                        label="BMI" >
                        <a-input v-model="bmi" placeholder="BMI" disabled />
                    </a-form-item>
                </div>
            </a-col>
        </a-row>
        <a-row>
            <a-col :xs="24">
                <a-tabs default-active-key="1">
                    <a-tab-pane key="1" tab="Chief Complaint" force-render>
                        <a-form-item>
                            <a-textarea  v-decorator="['chief_complaint', { rules: [{ max: 2000, message: 'Please enter a maximum of 2000 characters.' }] }]"  placeholder="Chief Complaint" :rows="6" :disabled="isDisabled" />
                        </a-form-item>
                    </a-tab-pane>
                    <a-tab-pane key="2" tab="HPI" force-render>
                        <a-form-item>
                            <a-textarea v-decorator="['hip', { rules: [{ max: 2000, message: 'Please enter a maximum of 2000 characters.' }] }]" placeholder="HPI" :rows="6" :disabled="isDisabled" />
                        </a-form-item>
                    </a-tab-pane>
                    <a-tab-pane key="3" tab="Subject" force-render>
                        <a-form-item>
                            <a-textarea v-decorator="['subject', { rules: [{ max: 2000, message: 'Please enter a maximum of 2000 characters.' }] }]" placeholder="Subject" :rows="6" :disabled="isDisabled" />
                        </a-form-item>
                    </a-tab-pane>
                    <a-tab-pane key="4" tab="Objective" force-render>
                        <a-form-item>
                            <a-textarea v-decorator="['objective', { rules: [{ max: 2000, message: 'Please enter a maximum of 2000 characters.' }] }]" placeholder="Objective" :rows="6" :disabled="isDisabled" />
                        </a-form-item>
                    </a-tab-pane>
                    <a-tab-pane key="5" tab="Assessment" force-render>
                        <a-form-item>
                            <a-textarea  v-decorator="['assessment', { rules: [{ max: 2000, message: 'Please enter a maximum of 2000 characters.' }] }]" placeholder="Assessment" :rows="6" :disabled="isDisabled" />
                        </a-form-item>
                    </a-tab-pane>
                    <a-tab-pane key="6" tab="Plan" force-render>
                        <a-form-item>
                            <a-textarea v-decorator="['plan', { rules: [{ max: 2000, message: 'Please enter a maximum of 2000 characters.' }] }]" placeholder="Plan" :rows="6" :disabled="isDisabled" />
                        </a-form-item>
                    </a-tab-pane>
                    <a-tab-pane key="7" tab="Sign" force-render>
                        <a-form-item>
                            <a-textarea v-decorator="['sign', { rules: [{ max: 2000, message: 'Please enter a maximum of 2000 characters.' }] }]" placeholder="Sign" :rows="6" :disabled="isDisabled" />
                        </a-form-item>
                    </a-tab-pane>
                    <a-tab-pane key="8" tab="Addendum" force-render>
                        <a-form-item>
                            <a-textarea v-decorator="['addendum', { rules: [{ max: 2000, message: 'Please enter a maximum of 2000 characters.' }] }]" placeholder="Addendum" :rows="6" />
                        </a-form-item>
                    </a-tab-pane>
                </a-tabs>
            </a-col>
        </a-row>
        <a-row class="mt-1">
            <a-col>
                <a-button type="primary" html-type="submit">
                    <SpinOrText v-model="loading">
                        <span v-if="isTemplate">
                            <span v-if="recordId">Update Template</span>
                            <span v-else>Create Template</span>
                        </span>
                        <span v-else>
                            <span v-if="recordId">Update Record</span>
                            <span v-else>Create Record</span>
                        </span>
                    </SpinOrText>
                </a-button>
                <a-button v-if="!isTemplate"  type="old-rose" @click="printRecord">
                    <SpinOrText v-model="loadingPdf">
                        <a-icon type="file-pdf"></a-icon>Print
                    </SpinOrText>
                </a-button>
            </a-col>
        </a-row>
        <RequestModal ref="rmodal" />
        <a ref="pdfDownload" :href="pdfFile" :download="pdfFile" class="d-none" target="_blank"></a>
    </a-form>
</template>
<script>
import RequestModal from '~/components/RequestModal.vue'
import SpinOrText from '~/components/SpinOrText.vue'
const debounce = require('lodash.debounce');

export default {
    name: "NewEmr",
    components: {
        RequestModal,
        SpinOrText,
    },
    layout: 'dashboard',
    middleware: ['authenticated', 'not-blocked', 'not-deleted'],
    data () {
        return {
            form: this.$form.createForm(this, { name: 'medical-record-' + this.type }),
            loading: false,
            templates: [], // Full data of the templates
            templatesList: [], // key and value
            usersList: [],
            userSearch: '',
            recordId: null,
            bmi: 0,
            isTemplateD: false,
            loadingPdf: false,
            pdfFile: '',
        }
    },
    computed: {
        isDisabled(){
            return !!this.recordId && this.type === 'record' || this.recordId && !this.isTemplate
        },
        type() {
            let type = 'new'
            const q = this.$route.query
            if (q){
                if (q.type && q.type.toLowerCase() === 'template'){
                    type = 'template'
                }
            }
            return type
        },
        isTemplate(){
            return this.type === 'template' || this.isTemplateD
        }
    },
    watch: {
        userSearch: debounce (function (v){
            if (v && v.length > 0){
                this.$api.get('/user/search', {
                    params: {
                        searchTerm: v,
                    }
                }).then(({data})=>{
                    if (data && data.length){
                        this.usersList = data.map((user)=>{
                            return {
                                text: user.full_name,
                                value: user.uuid
                            }
                        })
                    }
                }).catch((e)=>{
                    this.$message.error('Unable to get the search results')
                })
            }else{
                this.usersList = []
            }

        }, 600),
    },
    mounted(){
        
        if (this.$route.query.mere){
            this.recordId = this.$route.query.mere
            this.$api.get('/medical-record/' + this.recordId).then(({data})=>{
                this.setData(data)
                if (data.mrus_user_uuid){
                    this.usersList = [
                        {
                            text: data.user_first_name + ' ' + data.user_last_name,
                            value: data.user_uuid
                        }
                    ]
                    this.userSearch = data.user_uuid
                }


                if (data && data.mrus_mere_uuid){
                    this.$route.query.type = 'record'
                    this.isTemplateD = false
                }else{
                    this.$route.query.type = 'template'
                    this.isTemplateD = true
                }


                this.updateBMI()

            }).catch(()=>{
                this.recordId = null
                this.$message.error('Could not find the record.')
            })
        }

        this.$api.get('/medical-record', {
            params: {
                type: 'template'
            }
        }).then(({data})=>{
            this.templates = data
            this.templatesList = data.map((tmp)=>{
                return {
                    text: tmp.mere_name,
                    value: tmp.mere_uuid,
                }
            })
           
        })
    },
    methods: {
        printRecord(){
            if(this.recordId){
                this.loadingPdf = true
                this.$api.get('/medical-record/pdf/' + this.recordId).then(({data})=>{
                    this.$message.success('PDF File Generated successfully')
                    this.pdfFile = process.env.API_URL + '/generated/record/' + data.file
                    setTimeout(()=>{
                        this.$refs.pdfDownload.click()
                    }, 500)
                }).catch(()=>{
                    this.$message.error('Could not generate the PDF')
                }).finally(()=>{
                    this.loadingPdf = false
                })
            }else{
                this.$message.error('The record has not been created yet. Create it first.')
            }
        },
        isValidUser(){
            let r = false
            this.usersList.forEach((user)=>{
                if (user.value === this.userSearch){
                    r = true
                }
            })
            return r
        },
        updateBMI(){
            const d = this.form.getFieldsValue()
            let w = d.weight
            let h = d.height
            let r  = 0
            if (w && h){
                // [weight (lb) / height (in) / height (in)] x 703
                w = parseFloat(w)
                h = parseFloat(h)
                r = (w / h / h) * 703
            }
            this.bmi = r
        },
        handleSubmit(e) {
            e.preventDefault();
            this.form.validateFields((err, values) => {
                if (err) {
                    return console.log(err)
                }
                this.loading = true
                const keys = Object.keys(values)
                const nv = {}
                keys.forEach((key)=>{
                    nv[key] = values[key] || ''
                })
                if (this.recordId) {
                    nv.patient = this.userSearch
                    if (!this.isTemplate && !this.isValidUser()){
                        this.loading = false
                        this.$message.error('Please select an existing user.')
                        return
                    }

                    this.$api.put('/medical-record/' + this.recordId, nv).then(()=>{        
                        this.form.resetFields()
                        this.$message.success('The record has been updated')
                        setTimeout(()=>{
                            this.$router.push('/emr')
                        }, 500)
                        }).catch((err)=>{
                            this.$refs.rmodal.$emit('error', err)
                        }).finally(()=>{
                            this.loading = false
                        })    
                
                } else if (this.isTemplate) {
                        this.$api.post('/medical-record', nv).then(()=>{        
                            this.form.resetFields()
                            this.$message.success('The template has been created')
                            setTimeout(()=>{
                                this.$router.push('/emr')
                            }, 500)
                        }).catch((err)=>{
                            this.$refs.rmodal.$emit('error', err)
                        }).finally(()=>{
                            this.loading = false
                        })
                } else {
                        nv.patient = this.userSearch
                        

                        if (this.isValidUser()){
                            this.$api.post('/medical-record/record', nv).then(()=>{        
                                this.form.resetFields()
                                this.$message.success('The record has been created')
                                setTimeout(()=>{
                                    this.$router.push('/emr')
                                }, 500)
                            }).catch((err)=>{
                                this.$refs.rmodal.$emit('error', err)
                            }).finally(()=>{
                                this.loading = false
                            })
                        }else{
                            this.loading = false
                            this.$message.error('Please select an existing user.')
                        }
                }
            });
        },
        setData(tm){
            this.$nextTick(()=>{
                setTimeout(()=>{
                    this.form.setFieldsValue({
                            template_name: tm.mere_name,
                            allergies: tm.mere_allergies,
                            current_meds: tm.mere_current_meds,
                            medical_history: tm.mere_medical_history,
                            social_history: tm.mere_social_history,
                            family_history: tm.mere_family_history,
                            bp: tm.mere_bp,
                            pulse: tm.mere_pulse,
                            resp_rate: tm.mere_resp_rate,
                            temp: tm.mere_temp,
                            height: tm.mere_height,
                            weight: tm.mere_weight,
                            chief_complaint: tm.mere_chief_complaint,
                            hip: tm.mere_hpi,
                            subject: tm.mere_subject,
                            objective: tm.mere_objective,
                            assessment: tm.mere_assessment,
                            plan: tm.mere_plan,
                            sign: tm.mere_sign,
                            addendum: tm.mere_addendum
                    });
                }, 600)
            })
        },
        changeTemplate(t){
            this.templates.forEach((tm)=>{
                if (tm.mere_uuid === t){
                    this.setData(tm)
                }
            })

        },
    },

}
</script>
<style scoped lang="sass">
.emr-inline-inputs
    .ant-row.ant-form-item
        width: 100% !important
        display: block

@media screen and(min-width: $md)
    .emr-inline-inputs
        display: flex
        .ant-row.ant-form-item
            width: 50% !important
</style>