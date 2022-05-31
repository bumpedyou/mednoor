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
              text: 'Saved',
              disabled: false,
            },
          ]"
        ></v-breadcrumbs>
        <v-btn
          style="margin-left: 10px"
          depressed
          color="primary"
          @click="submitHcfa"
        >
          Submit
        </v-btn>
      </v-col>
    </v-row>
    <v-row>
      <!-- <v-col md="12">
        <p class="h4 mb-1">
          {{ $t('emr_lng') }}
        </p>
      </v-col> -->

      <v-col md="12">
        <v-skeleton-loader v-if="loadingData" />
        <v-data-table v-else :items="items" :headers="headers">
          <template #[`item.hcfa_sl`]="{ item }">
            {{ item.hcfa_sl }}
          </template>
          <template #[`item.patient`]="{ item }">
            <nuxt-link
              :to="localePath('/user-profile/' + item.patient.user_uuid)"
            >
              {{ item.patient.user_first_name }}
              {{ item.patient.user_last_name }}
            </nuxt-link>
          </template>

          <template #[`item.hcfa_create_date`]="{ value }">
            {{ dateString(value) }} {{ timeString(value) }}
          </template>
          <template #[`item.hcfa_date`]="{ value }">
            {{ dateString(value) }} {{ timeString(value) }}
          </template>
          <template #[`item.doctor`]="{ item }">
            <span>
              {{ item.doctor.user_first_name }} {{ item.doctor.user_last_name }}
            </span>
          </template>
          <template #[`item.actions`]="{ item }">
            <div class="emr-action">
              <nuxt-link
                class="mr-5"
                :to="{
                  path: localePath('/hcfa'),

                  query: {
                    patientId: item.hcfa_patient_id,
                    id: item.hcfa_uuid,
                  },
                }"
                >{{ $t('edit') }}
              </nuxt-link>
              <span class="clickable mr-5" @click="export2xml(item)">{{
                item.hcfa.hcfa_is_submitted===true?'Send': 'Ready'
              }}</span>
              <span
                class="red--text clickable"
                @click="deleteItem(item.hcfa_uuid)"
                >{{ $t('delete') }}</span
              >
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

export default {
  name: 'EMR',
  components: {
    ConfirmDialog,
  },
  mixins: [dateMixin, userRoleMixin, authMixin, timeMixin, exportHcfa,exportAsZip],
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

    confirmSubmit() {
      this.loadingSubmit = true

      // this.$insuranceApi
      //   .put(`hcfa/submit-list`,{is_submit:true})
      //   .then(({ data }) => {
      //     this.loadingSubmit = false;
      //     this.getSavedHcfaList();
      //   })
      //   .finally(() => {
      //     this.loadingSubmit = false
      //     this.isConfirm = false
      //   })

      this.zipDownload(this.items);
        this.isConfirm = false
        this.loadingSubmit = false
    },

    isPdfLoading(recordId) {
      return this.printing === recordId
    },
    printRecord(id) {
      //   this.printing = id
      //   this.loadingPdf = true
      //   this.$api
      //     .get('/medical-record/pdf/' + id)
      //     .then(({ data }) => {
      //       this.$toast.success(this.$t('pdf_gend').toString())
      //       this.pdfFile = process.env.API_URL + '/generated/record/' + data.file
      //       setTimeout(() => {
      //         this.$refs.pdfDownload.click()
      //       }, 500)
      //     })
      //     .catch(() => {
      //       this.$toast.error(this.$t('pdf_fail').toString())
      //     })
      //     .finally(() => {
      //       this.loadingPdf = false
      //       this.printing = null
      //     })
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
          text: 'Hcfa',
          value: 'hcfa_sl',
          sortable: false,
        },
        {
          text: 'Patient',
          value: 'patient',
          sortable: false,
        },
      ]
      if (this.isAdmin || this.isSuper) {
        this.headers.push({
          text: this.$t('created_by'),
          value: 'doctor',
        })
      }

      this.headers.push(
        {
          text: 'Created At',
          value: 'hcfa_create_date',
          sortable: false,
        },
        {
          text: 'Updated At',
          value: 'hcfa_date',
          sortable: false,
        },

        {
          text: 'Actions',
          value: 'actions',
          sortable: false,
        }
      )

      this.getSavedHcfaList();
    },

    getSavedHcfaList() {

      this.loadingData = true
      this.$insuranceApi
        .get(`hcfa/saved-list`)
        .then(({ data }) => {
          this.items=[];
          if (data && data.length) {
         
            data.forEach((_h, index) => {
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
              }
              this.items.push(o)
            })
          }
          console.log('--->', this.items, '<---')
        })
        .finally(() => {
          this.loadingData = false
        })
    },
    export2xml(item) {
      this.exportHcfa(item)
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