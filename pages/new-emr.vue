<template>
  <div class='pa-6 mh-100v'>
    <v-row class='mb-1'>
      <v-col>
        <v-breadcrumbs :items="[
          {
            text: $t('dashboard'),
            to: localePath('/dashboard'),
            disabled: false,
          },
          {
            text: $t('emr'),
            to: localePath('/emr'),
            disabled: false,
          },
          {
            text: isTemplate ? $t('emr_template') : 'Encounter',
            disabled: true,
          }
        ]"></v-breadcrumbs>
      </v-col>
    </v-row>
    <div v-if='loadingData'>
      <v-skeleton-loader/>
    </div>
    <v-form v-else ref="form" v-model="valid" @submit.prevent='handleSubmit'>
      <v-row>
        <v-col>
          <p class='h4 mb-1'>
                    <span v-if='isTemplate'>
                        <span v-if='recordId'>{{ $t('update_template') }}</span>
                        <span v-else>{{ $t('create_template') }}</span>
                    </span>
            <span v-else>
                        <span v-if='recordId'>{{ $t('update_record') }}</span>
                        <span v-else>New Encounter</span>
                    </span>
          </p>
        </v-col>
      </v-row>
      <v-row>
        <v-col md="12">
          <div>
            <v-text-field v-if='isTemplate' v-model="template_name" :rules="[

              v => !!v ||  $t('v.en_tmp_name'),
              v => !!v && v.length >= 2 || $t('v.min_2')

            ]"
                          type='text'
                          :label="$t('template_name')"
                          :placeholder="$t('template_name')"
                          @input="inputReceived('template_name')">
            </v-text-field>
            <v-autocomplete v-else v-model="selectedUser" :search-input.sync="userSearch"
                            :loading="loadingUsers" hide-no-data :items="usersList" placeholder="Search patient" :disabled="!!recordId && draft"></v-autocomplete>
          </div>
        </v-col>
        <v-col v-if="!isTemplate" md="6">
          <div>
            <v-text-field v-model="picker" placeholder="Date" readonly @click="visiblePicker = true"></v-text-field>
            <v-dialog v-model="visiblePicker" persistent max-width="320px">
              <v-date-picker
                v-model="picker"
                year-icon="mdi-calendar-blank"
                prev-icon="mdi-skip-previous"
                next-icon="mdi-skip-next"
                @change="visiblePicker = false"
              ></v-date-picker>
            </v-dialog>
          </div>
        </v-col>
        <v-col v-if='!isTemplate' md="6">
          <v-autocomplete :disabled="isDisabled" :items="templatesList" :label="$t('template_name')" :placeholder="$t('template_name')" clearable @change="changeTemplate"></v-autocomplete>
        </v-col>
      </v-row>
      <v-row>
        <v-col md="12">
          <v-tabs v-model="tab">
            <v-tab>{{ $t('allergies') }}</v-tab>
            <v-tab>{{ $t('current_meds') }}</v-tab>
            <v-tab>{{ $t('med_htry') }}</v-tab>
            <v-tab>{{ $t('soc_htry') }}</v-tab>
            <v-tab>{{ $t('fam_hry') }}</v-tab>

          </v-tabs>
          <v-tabs-items v-model="tab">
            <v-tab-item>
              <v-textarea v-model="allergies" :label="$t('allergies')" :placeholder="$t('allergies')" :disabled='isDisabled' @input="inputReceived('allergies')"/>
            </v-tab-item>
            <v-tab-item>
              <v-textarea v-model="current_meds" :label="$t('current_meds')" :placeholder="$t('current_meds')" :disabled='isDisabled' @input="inputReceived('current_meds')"/>
            </v-tab-item>
            <v-tab-item>
              <v-textarea
                v-model="medical_history"
                :label="$t('med_htry')"
                :placeholder="$t('med_htry')" :disabled='isDisabled' @input="inputReceived('medical_history')"/>
            </v-tab-item>
            <v-tab-item>
              <v-textarea
                v-model="social_history"
                :label="$t('soc_htry')"
                :placeholder="$t('soc_htry')" :disabled='isDisabled' @input="inputReceived('social_history')"/>
            </v-tab-item>
            <v-tab-item>
              <v-textarea
                v-model="family_history"
                :label="$t('fam_hry')"
                :placeholder="$t('fam_hry')" :disabled='isDisabled' @input="inputReceived('family_history')"/>
            </v-tab-item>
          </v-tabs-items>
        </v-col>
      </v-row>
      <v-row class='mt-1 mb-1'>
        <v-col>
          <div class='emr-inline-inputs'>
            <div>
              <v-text-field
                v-model='bp'
                :label="$t('bp')"
                :placeholder="$t('bp')" :disabled='isDisabled'/>
            </div>
            <div>
              <v-text-field
                :label="$t('pulse')"
                :placeholder="$t('pulse')" :disabled='isDisabled' @input="inputReceived('pulse')"/>
            </div>
            <div>
              <v-text-field
                v-model="resp_rate"
                :label="$t('resp_rate')"
                :placeholder="$t('resp_rate')" :disabled='isDisabled' @input="inputReceived('resp_rate')"/>
            </div>
            <div>
              <v-text-field v-model="temp"
                            :placeholder="$t('temp')" :label="$t('temp')" :disabled='isDisabled' @input="inputReceived('temp')"/>
            </div>
            <div>
              <v-text-field v-model="height" :label="$t('height_in')" :placeholder="$t('height_in')" :disabled='isDisabled'
                            @input='updateBMI("height")'/>
            </div>
            <div>
              <v-text-field v-model="weight" :label="$t('weight_lb')" :placeholder="$t('weight_lb')" :disabled='isDisabled'
                            @input='updateBMI("weight")'/>
            </div>
            <div>
              <v-text-field v-model='bmi' :label="$t('bmi')" :placeholder="$t('bmi')" disabled/>
            </div>
          </div>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-tabs v-model="tab2">
            <v-tab>{{ $t('chief_complaint') }}</v-tab>
            <v-tab>{{ $t('hpi') }}</v-tab>
            <v-tab>{{ $t('subject') }}</v-tab>
            <v-tab>{{ $t('objective') }}</v-tab>
            <v-tab>{{ $t('assessment') }}</v-tab>
            <v-tab>{{ $t('plan') }}</v-tab>
            <v-tab>{{ $t('sign') }}</v-tab>
            <v-tab>{{ $t('addendum') }}</v-tab>
          </v-tabs>
          <v-tabs-items v-model="tab2">
            <v-tab-item>
              <v-textarea
                v-model="chief_complaint"
                :label="$t('chief_complaint')"
                :placeholder="$t('chief_complaint')" :disabled='isDisabled' @input="inputReceived('chief_complaint')"/>
            </v-tab-item>
            <v-tab-item>
              <v-textarea
                v-model="hip"
                :label="$t('hpi')"
                :placeholder="$t('hpi')" :disabled='isDisabled' @input="inputReceived('hip')"/>
            </v-tab-item>
            <v-tab-item>
              <v-textarea
                v-model="subject"
                :label="$t('subject')"
                :placeholder="$t('subject')" :disabled='isDisabled' @input="inputReceived('subject')"/>
            </v-tab-item>
            <v-tab-item>
              <v-textarea
                v-model="objective"
                :label="$t('objective')"
                :placeholder="$t('objective')" :disabled='isDisabled' @input="inputReceived('objective')"/>
            </v-tab-item>
            <v-tab-item>
              <v-textarea
                v-model="assessment"
                :label="$t('assessment')"
                :placeholder="$t('assessment')" :disabled='isDisabled' @input="inputReceived('assessment')"/>
            </v-tab-item>
            <v-tab-item>
              <v-textarea
                v-model="plan"
                :label="$t('plan')"
                :placeholder="$t('plan')" :disabled='isDisabled' @input="inputReceived('plan')"/>
            </v-tab-item>
            <v-tab-item>
              <v-textarea
                v-model="sign"
                :label="$t('sign')"
                :placeholder="$t('sign')" :disabled='isDisabled' @input="inputReceived('sign')"/>
            </v-tab-item>
            <v-tab-item>
              <v-textarea
                v-model="addendum"
                :label="$t('addendum')"
                :placeholder="$t('addendum')" :disabled="locked" @input="inputReceived('addendum')"/>
            </v-tab-item>
          </v-tabs-items>
        </v-col>
      </v-row>
      <v-row v-if="!locked" class='mt-1'>
        <v-col>
          <v-btn color='primary' small tile type='submit' :loading="loading">
            <span v-if='isTemplate'>
              <span v-if='recordId'>{{ $t('update_template') }}</span>
              <span v-else>{{ $t('create_template') }}</span>
            </span>
            <span v-else>
              <span v-if='recordId'>{{ $t('update_record') }}</span>
              <span v-else>{{ $t('chat_record') }}</span>
            </span>
          </v-btn>
          <v-btn v-if='!isTemplate' small tile color='pink' dark :loading="loadingPdf" @click='printRecord'>
            <v-icon>mdi-file</v-icon>
            {{ $t('print') }}
          </v-btn>
        </v-col>
      </v-row>
      <v-row v-else class="mt-1">
        <v-col>
          <v-btn small tile color='success' @click.prevent="$router.push(localePath('/emr'))">
            Go Back
            <v-icon>mdi-arrow-left</v-icon>
          </v-btn>
        </v-col>
      </v-row>
      <RequestModal ref='rmodal'/>
      <a ref='pdfDownload' :href='pdfFile' :download='pdfFile' class='d-none' target='_blank'></a>
    </v-form>
  </div>

</template>
<script>
import formMixin from '~/mixins/formMixin'

const debounce = require('lodash.debounce')
const {validate} = require('uuid');


export default {
  name: 'NewEmr',

  mixins: [formMixin],
  layout: 'dashboard',
  middleware: ['authenticated', 'not-blocked', 'not-deleted', 'verified', 'pin-set'],
  data: () => ({
    selectedUser: null,
    loadingUsers: false,
    tab: 0,
    tab2: 0,
    allergies: '',
    current_meds: '',
    medical_history: '',
    social_history: '',
    family_history: '',
    chief_complaint: '',
    hip: '',
    subject: '',
    objective: '',
    assessment: '',
    plan: '',
    sign: '',
    addendum: '',
    resp_rate: '',
    temp: '',
    height: '',
    weight: '',
    locked: false,
    loadingData: false,
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
    bp: '',
    draft: null,
    canSaveDraft: false,
    valid: false,
    template_name: '',
    picker: new Date().toISOString().substr(0,10),
    visiblePicker: false,
  }),
  head() {
    return {
      title: 'New Encounter'
    }
  },
  computed: {
    isDisabled() {
      // return !!this.recordId && this.type === 'record' || this.recordId && !this.isTemplate
      return this.locked
    },
    type() {
      let type = 'new'
      const q = this.$route.query
      if (q) {
        if (q.type && q.type.toLowerCase() === 'template') {
          type = 'template'
        }
      }
      return type
    },
    isTemplate() {
      return this.type === 'template' || this.isTemplateD
    }
  },
  watch: {
    date(v) {
      console.log('The date is now ', v)
    },
    bp(v) {
      let nv = ''
      if (v) {
        v.split('').forEach((k, i) => {
          if (this.allowed.includes(k) || (i === 3 && k === '/')) {
            nv += k
          }
        })
      }
      this.bp = nv
      if (nv.length === 4) {
        this.bp = this.addSlash(this.bp)
      }
      if (this.bp.length > 7) {
        this.bp = this.bp.substr(0, 7)
      }
      this.saveDraft('bp')
    },
    userSearch: debounce(function (v) {
      if (validate(v)) {
        // The professional selected a valid user.
        this.saveDraft('user')
      }
      if (v && v.length > 0) {
        this.loadingUsers = true
        this.$userApi.get('/search', {
          params: {
            searchTerm: v
          }
        }).then(({data}) => {
          if (data && data.length) {
            this.usersList = data.map((user) => {
              return {
                text: user.full_name,
                value: user.uuid
              }
            })
          }
        }).catch(() => {
          this.$toast.error(this.$t('unable_search').toString())
        }).finally(() => {
          this.loadingUsers = false
        })
      } else {
        this.usersList = []
      }
    }, 600)
  },
  mounted() {
    const c = this.$route.query
    if (c.mere) {
      this.recordId = c.mere
      this.loadingData = true
      this.$api.get('/medical-record/' + this.recordId).then(({data}) => {
        this.selectedUser = data.user_uuid
        this.setData(data)
        if (data.mrus_user_uuid) {
          this.usersList = [
            {
              text: data.user_first_name + ' ' + data.user_last_name,
              value: data.user_uuid
            }
          ]
          this.userSearch = data.user_uuid
        }
        if (data && data.mrus_mere_uuid) {
          this.$route.query.type = 'record'
          this.isTemplateD = false
        } else {
          this.$route.query.type = 'template'
          this.isTemplateD = true
        }
        this.updateBMI()
        setTimeout(() => {
          this.canSaveDraft = true
        }, 1000)
      }).catch(() => {
        this.recordId = null
        this.$toast.error(this.$t('could_nf_rec').toString())
      }).finally(() => {
        this.loadingData = false
      })
    } else {
      this.canSaveDraft = true
    }
    this.$api.get('/medical-record', {
      params: {
        type: 'template'
      }
    }).then(({data}) => {
      this.templates = data
      this.templatesList = data.map((tmp) => {
        return {
          text: tmp.mere_name,
          value: tmp.mere_uuid
        }
      })
    })
    if (c.mode && c.mode === 'view') {
      this.locked = true
    }
  },
  methods: {
    inputReceived: debounce(function (arg) {
      this.saveDraft(arg)
    }, 1000),
    saveDraft(arg, valueOverride) {
      if (this.canSaveDraft) {


        console.log('Save draft. Update -->', arg)
        const v = this[arg]
        console.log(`The new value of ${arg} is ${v}`)
        if (this.draft === null && !this.recordId) {
          // type ---> new || template
          this.$api.post('/medical-record/draft', {
            type: this.type,
            arg,
          }).then(({data}) => {
            if (data && data.mere_uuid) {
              this.recordId = data.mere_uuid
              this.$toast.success('A new draft has been created')
              this.draft = true
              this.putData(arg, v || valueOverride)
            }
          }).catch(() => {
            this.$toast.error('Failed to create a new draft. You can continue but your changes won\'t be saved automatically.')
          })
        } else if (validate(this.recordId)) {
          this.putData(arg, v || valueOverride)
        }
      }
    },
    putData(name, value) {

      const values = this[name]
      let v = value || values[name]
      if (!v) {
        if (name === 'user') {
          v = this.userSearch
        }
      }
      name = name.replace(/_/g, '-')
      this.$api.patch('/medical-record/' + name + '/' + this.recordId, {
        value: v
      }).then(({data}) => {
        console.log(`Updated ${name} successfully`)
      }).catch(() => {
        this.$toast.error(`Failed to update ${name}`)
      })
    },
    printRecord() {
      if (this.recordId) {
        this.loadingPdf = true
        this.$api.get('/medical-record/pdf/' + this.recordId).then(({data}) => {
          this.$toast.success(this.$t('pdf_gend').toString())
          this.pdfFile = process.env.API_URL + '/generated/record/' + data.file
          setTimeout(() => {
            this.$refs.pdfDownload.click()
          }, 500)
        }).catch(() => {
          this.$toast.error(this.$t('pdf_fail').toString())
        }).finally(() => {
          this.loadingPdf = false
        })
      } else {
        this.$toast.success(this.$t('record_hnb_cy').toString())
      }
    },
    isValidUser() {
      let r = false
      this.usersList.forEach((user) => {
        if (user.value === this.selectedUser) {
          r = true
        }
      })
      return r
    },
    updateBMI(arg) {

      let w = this.weight
      let h = this.height
      let r = 0
      if (w && h) {
        // [weight (lb) / height (in) / height (in)] x 703
        w = parseFloat(w)
        h = parseFloat(h)
        r = (w / h / h) * 703
      }
      this.bmi = r.toFixed(2)
      this.saveDraft(arg)
    },
    handleSubmit() {
      console.log('Handle submit')
      this.$refs.form.validate()

      if (this.valid) {
        const values = {
          template_name: this.template_name,
          patient: this.selectedUser,
          allergies: this.allergies,
          current_meds: this.current_meds,
          medical_history: this.medical_history,
          social_history: this.social_history,
          family_history: this.family_history,
          bp: this.bp,
          pulse: this.pulse,
          resp_rate: this.resp_rate,
          temp: this.temp,
          height: this.height,
          weight: this.weight,
          chief_complaint: this.chief_complaint,
          hip: this.hpi,
          subject: this.subject,
          objective: this.objective,
          assessment: this.assessment,
          plan: this.plan,
          sign: this.sign,
          addendum: this.addendum,
        }


        /*
        if (!this.date || !this.date.isValid()){
          return this.$toast.error('Please enter a valid date')
        }
         */

        // nv.date = this.date.format('YYYY-MM-DD')

        values.date = this.picker
        console.log('The values --->', values)
        // 2022-01-14

        this.loading = true

        if (this.recordId) {
          values.patient = this.selectedUser
          if (!this.isTemplate && !this.isValidUser()) {
            this.loading = false
            this.$toast.error(this.$t('please_select_user').toString())
            return false
          }

          this.$api.put('/medical-record/' + this.recordId, values).then(() => {
            this.$toast.success(this.$t('record_hb_updated').toString())
            this.$router.push(this.localePath('/emr'))
          }).catch((err) => {
            this.$refs.rmodal.$emit('error', err)
          }).finally(() => {
            this.loading = false
          })
        } else if (this.isTemplate) {
          this.$api.post('/medical-record', values).then(() => {

            this.$toast.success(this.$t('template_hb_created').toString())
            this.$router.push(this.localePath('/emr'))
          }).catch((err) => {
            this.$refs.rmodal.$emit('error', err)
          }).finally(() => {
            this.loading = false
          })
        } else if (this.isValidUser()) {
            this.$api.post('/medical-record/record', values).then(() => {
              this.$refs.form.reset()
              this.$toast.success(this.$t('record_hb_created').toString())
              setTimeout(() => {
                this.$router.push(this.localePath('/emr'))
              }, 500)
            }).catch((err) => {
              this.$refs.rmodal.$emit('error', err)
            }).finally(() => {
              this.loading = false
            })
          } else {
            this.loading = false
            this.$toast.error(this.$t('please_select_user').toString())
          }
      }
    },
    setData(tm) {
      console.log('Setting data.',tm)
      this.template_name = tm.mere_name
      this.allergies = tm.mere_allergies
      this.current_meds = tm.mere_allergies
      this.medical_history = tm.mere_current_meds
      this.social_history = tm.mere_social_history
      this.family_history = tm.mere_family_history
      this.bp = tm.mere_bp
      this.pulse = tm.mere_pulse
      this.resp_rate = tm.mere_resp_rate
      this.temp = tm.mere_temp
      this.height = tm.mere_height
      this.weight = tm.mere_weight
      this.chief_complaint = tm.mere_chief_complaint
      this.hip = tm.mere_hpi
      this.subject = tm.mere_subject
      this.objective = tm.mere_objective
      this.assessment = tm.mere_assessment
      this.plan = tm.mere_plan
      this.sign = tm.mere_sign
      this.addendum = tm.mere_addendum
    },
    changeTemplate(t) {
      this.templates.forEach((tm) => {
        if (tm.mere_uuid === t) {
          this.setData(tm)
        }
      })
    }
  }

}
</script>
<style scoped lang='sass'>
.emr-inline-inputs
  .ant-row.ant-form-item
    width: 100% !important
    display: block

@media screen and (min-width: $md)
  .emr-inline-inputs
    display: flex

    .ant-row.ant-form-item
      width: 50% !important
</style>
