<template>
  <div class="pa-6 mh-100v">
    <v-row class="mb-1">
      <v-col class="saved-header">
        <v-breadcrumbs
          :items="[
            {
              text: $t('dashboard'),
              to: localePath('/dashboard'),
            },
            {
              text: $t('Saved'),
              to: localePath('/saved-hcfa'),
            },
            {
              text: 'Batch',
              disabled: false,
            },
          ]"
        ></v-breadcrumbs>
      </v-col>
    </v-row>
    <v-row>
      <v-col md="12">
        <v-skeleton-loader v-if="loadingData" />
        <v-data-table v-else :items="batchItems" :headers="headers">
          <template #[`item.batch_sl`]="{ item }">
            {{ item.sl }}
          </template>

          <template #[`item.hcfa_batch_date`]="{ value }">
            {{ dateString(value) }} {{ timeString(value) }}
          </template>

          <template #[`item.actions`]="{ item }">
            <div class="emr-action">
              <span class="red--text clickable" @click="export2xml(item)">{{
                $t('Download')
              }}</span>
            </div>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
    <a
      ref="pdfDownload"
      :href="pdfFile"
      :download="pdfFile"
      class="d-none"
      target="_blank"
    ></a>
    <ConfirmDialog
      v-model="confirm"
      title="Do you want to delete this item?"
      :loading="loadingDelete"
      @accept="confirmDelete"
      @cancel="confirm = false"
    ></ConfirmDialog>

    <ConfirmDialog
      v-model="isConfirm"
      title="Do you want to sumit this list?"
      :loading="loadingSubmit"
      @accept="confirmSubmit"
      @cancel="isConfirm = false"
    ></ConfirmDialog>
  </div>
</template>

<script>
import authMixin from '~/mixins/authMixin'
import dateMixin from '~/mixins/dateMixin'
import timeMixin from '~/mixins/timeMixin'
import exportHcfa from '~/mixins/exportHcfa'
import exportAsZip from '~/mixins/exportAsZip'
import userRoleMixin from '~/mixins/userRoleMixin'
// import MedDivider from '~/components/MedDivider'
import ConfirmDialog from '~/components/ConfirmDialog'

const debounce = require('lodash.debounce')
const groupBy = require('lodash.groupby')
export default {
  name: 'EMR',
  components: {
    ConfirmDialog,
  },
  mixins: [
    dateMixin,
    userRoleMixin,
    authMixin,
    timeMixin,
    exportHcfa,
    exportAsZip,
  ],
  layout: 'dashboard',
  middleware: [
    'authenticated',
    'not-blocked',
    'not-deleted',
    'verified',
    'pin-set',
  ],
  data: () => ({
    items: [],
    batchItems: [],
    type: 'record',
    pdfFile: '',
    loadingPdf: false,
    printing: null,
    searchTerm: '',
    loadingData: false,
    valid: false,
    headers: [],
    confirm: false,
    isConfirm: false,
    deleteId: null,

    loadingDelete: false,
    loadingSubmit: false,
  }),
  head() {
    return {
      title: 'Hcfa',
    }
  },
  watch: {
    searchTerm: debounce(function (v) {
      //   this.$api
      //     .get('/medical-record', {
      //       params: {
      //         type: this.type,
      //         search: v
      //       }
      //     })
      //     .then(({ data }) => {
      //       this.items = data;
      //       console.log('records',data)
      //     })
    }, 500),
  },
  mounted() {
    this.setColumns()
  },
  methods: {
    submitHcfa() {
      this.isConfirm = true
    },

    confirmSubmit() {},

    isPdfLoading(recordId) {
      return this.printing === recordId
    },

    confirmDelete() {
      this.loadingDelete = true
      this.$insuranceApi
        .delete('/hcfa/' + this.deleteId)
        .then(() => {
          this.$toast.success('Record deleted successfully')
          this.items = this.items.filter((it) => {
            return it.hcfa_uuid !== this.deleteId
          })
        })
        .catch((err) => {
          this.$toast.error(err)
        })
        .finally(() => {
          this.confirm = false
          this.deleteId = null
          this.loadingDelete = false
        })
    },
    deleteItem(v) {
      this.confirm = true
      this.deleteId = v
    },
    handleChange(v) {
      this.setColumns()
    },
    setColumns() {
      this.headers = [
        {
          text: 'Batch',
          value: 'sl',
          sortable: false,
        },
        {
          text: 'Create Date',
          value: 'hcfa_batch_date',
          sortable: false,
        },
      ]

      this.headers.push({
        text: 'Actions',
        value: 'actions',
        sortable: false,
      })

      this.getSavedHcfaList()
    },

    getSavedHcfaList() {
      this.loadingData = true
      this.$insuranceApi
        .get(`hcfa/saved-list`)
        .then(({ data }) => {
          // this.items = [];
          this.batchItems = []
          const hcfaList = []
          if (data && data.length) {
            data.forEach((_h, index) => {
              if (_h.hcfa.hcfa_batch_no !== null) {
                const o = {
                  hcfa_uuid: _h.hcfa.hcfa_uuid,
                  hcfa_patient_id: _h.hcfa.hcfa_patient_id,
                  hcfa_doctor_id: _h.hcfa.hcfa_doctor_id,
                  hcfa_sl: index + 1,
                  hcfa: _h.hcfa,
                  insured_info: _h.insured_info,
                  claims_info: _h.claims_info,
                  patient: _h.patient,
                  doctor: _h.doctor,
                  hcfa_date: _h.hcfa.hcfa_date,
                  hcfa_create_date: _h.hcfa.hcfa_create_date,
                  hcfa_batch_no: _h.hcfa.hcfa_batch_no,
                  hcfa_batch_date: _h.hcfa.hcfa_batch_date,
                }
                this.items.push(o)
                hcfaList.push(o)
              }
            })
          }
          const groupBatch = groupBy(hcfaList, 'hcfa_batch_no')
          //   console.log(groupBatch)
          let sl = 1
          for (const key in groupBatch) {
            if (Object.hasOwnProperty.call(groupBatch, key)) {
              const element = {}
              element.sl = sl
              element.batch_items = groupBatch[key]
              element.hcfa_batch_date = groupBatch[key][0].hcfa_batch_date
              this.batchItems.push(element)
              sl++
            }
          }
          console.log('--->', this.batchItems, '<---')
        })
        .finally(() => {
          this.loadingData = false
        })
    },
    export2xml(item) {
      console.log(item)
      this.zipDownload(item.batch_items, item.hcfa_batch_date)
    },
  },
}
</script>


<style scoped lang="sass">
.emr-action
  display: flex
.saved-header
  display: flex
  align-items: center
  justify-content: space-between
  margin-right: 5%
</style>