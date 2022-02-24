<template>
  <div class="pa-6 mh-100v">
    <v-row class="mb-1">
      <v-col>
        <v-breadcrumbs
          :items="[
            {
              text: $t('dashboard'),
              to: localePath('/dashboard')
            },
            {
              text: $t('emr'),
              disabled: false
            }
          ]"
        ></v-breadcrumbs>
      </v-col>
    </v-row>
    <v-row>
      <v-col md="12">
        <p class="h4 mb-1">
          {{ $t('emr_lng') }}
        </p>
        <v-btn
          color="success"
          small
          tile
          class="mb-1"
          :to="localePath('/new-emr')"
        >
          <v-icon class="mr-1">mdi-medical-bag</v-icon>
          New Encounter
        </v-btn>
        <v-btn
          dark
          small
          tile
          class="mb-1"
          @click="
            $router.push({
              path: localePath('/new-emr'),
              query: { type: 'template' }
            })
          "
        >
          <v-icon class="mr-1">mdi-medical-bag</v-icon>
          {{ $t('new_template') }}
        </v-btn>
      </v-col>
      <v-col class="mb-1">
        <v-form ref="form" v-model="valid">
          <v-row>
            <v-col md="3">
              <v-select
                v-model="type"
                :items="[
                  {
                    text: $t('record'),
                    value: 'record'
                  },
                  {
                    text: $t('template'),
                    value: 'template'
                  }
                ]"
                @change="handleChange"
              >
              </v-select>
            </v-col>
            <v-col md="3">
              <v-text-field
                v-model="searchTerm"
                :placeholder="
                  type === 'record' ? $t('search_pl1') : $t('search_pl2')
                "
              />
            </v-col>
          </v-row>
        </v-form>
      </v-col>
      <v-col md="12">
        <v-skeleton-loader v-if="loadingData" />
        <v-data-table v-else :items="items" :headers="headers">
          <template #[`item.patient`]="{ item }">
            <nuxt-link :to="localePath('/user/' + item.user_uuid)">
              {{ item.user_first_name }} {{ item.user_last_name }}
            </nuxt-link>
          </template>
          <template #[`item.mere_is_draft`]="{ item }">
            <span v-if="item.mere_is_draft" class="text-muted"> [Draft] </span>
          </template>
          <template #[`item.mere_date`]="{ value }">
            {{ dateString(value) }}
          </template>
          <template #[`item.actions`]="{ item }">
            <nuxt-link
              :to="{
                path: localePath('/new-emr'),
                query: {
                  mere: item.mere_uuid,
                  mode: 'view'
                }
              }"
              >View
            </nuxt-link>
            <MedDivider></MedDivider>
            <nuxt-link
              :to="{
                path: localePath('/new-emr'),
                query: {
                  mere: item.mere_uuid
                }
              }"
              >{{ $t('edit') }}
            </nuxt-link>
            <div
              v-if="
                item.user_uuid &&
                (isAdmin || isSuper || myUserId === item.mere_owner)
              "
            >
              <MedDivider></MedDivider>
              <a
                href="javascript:void(0)"
                type="old-rose"
                @click="printRecord(item.mere_uuid)"
              >
                <v-progress-circular
                  v-if="isPdfLoading(item.mere_uuid)"
                  indeterminate
                ></v-progress-circular>
                <div v-else>
                  <v-icon type="file-pdf">mdi-file</v-icon>
                  {{ $t('print') }}
                </div>
              </a>
            </div>
            <MedDivider></MedDivider>
            <span
              class="red--text clickable"
              @click="deleteItem(item.mere_uuid)"
              >{{ $t('delete') }}</span
            >
          </template>
          <template #[`item.owner_name`]="{ item }">
            Owner name:
            <nuxt-link
              v-if="item && item.owner_uuid"
              :to="localePath('/user/' + item.owner_uuid)"
            >
              {{ item.owner_name }} {{ item.owner_last_name }}
            </nuxt-link>
            <span v-else>
              {{ item.owner_name }} {{ item.owner_last_name }}
            </span>
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
  </div>
</template>

<script>
import authMixin from '~/mixins/authMixin'
import dateMixin from '~/mixins/dateMixin'
import userRoleMixin from '~/mixins/userRoleMixin'
import MedDivider from '~/components/MedDivider'
import ConfirmDialog from '~/components/ConfirmDialog'

const debounce = require('lodash.debounce')

export default {
  name: 'EMR',
  components: {
    ConfirmDialog,
    MedDivider
  },
  mixins: [dateMixin, userRoleMixin, authMixin],
  layout: 'dashboard',
  middleware: [
    'authenticated',
    'not-blocked',
    'not-deleted',
    'verified',
    'pin-set'
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
    deleteId: null,
    loadingDelete: false
  }),
  head() {
    return {
      title: this.$t('emr')
    }
  },
  watch: {
    searchTerm: debounce(function (v) {
      this.$api
        .get('/medical-record', {
          params: {
            type: this.type,
            search: v
          }
        })
        .then(({ data }) => {
          this.items = data
        })
    }, 500)
  },
  mounted() {
    this.setColumns()
  },
  methods: {
    isPdfLoading(recordId) {
      return this.printing === recordId
    },
    printRecord(id) {
      this.printing = id
      this.loadingPdf = true
      this.$api
        .get('/medical-record/pdf/' + id)
        .then(({ data }) => {
          this.$toast.success(this.$t('pdf_gend').toString())
          this.pdfFile = process.env.API_URL + '/generated/record/' + data.file
          setTimeout(() => {
            this.$refs.pdfDownload.click()
          }, 500)
        })
        .catch(() => {
          this.$toast.error(this.$t('pdf_fail').toString())
        })
        .finally(() => {
          this.loadingPdf = false
          this.printing = null
        })
    },
    confirmDelete() {
      this.loadingDelete = true
      this.$api
        .delete('/medical-record/' + this.deleteId)
        .then(() => {
          this.$toast.success('Record deleted successfully')
          this.items = this.items.filter((it) => {
            return it.mere_uuid !== this.deleteId
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
      const draftHeader = {
        text: '',
        value: 'mere_is_draft',
        sortable: false
      }

      if (this.type === 'record') {
        this.headers = [
          {
            text: 'EMR',
            value: 'user_mrn',
            sortable: false
          },
          {
            text: 'Patient',
            value: 'patient',
            sortable: false
          },
          {
            text: 'Created At',
            value: 'mere_date',
            sortable: false
          },
          draftHeader,
          {
            text: 'Actions',
            value: 'actions',
            sortable: false
          }
        ]
      } else {
        this.headers = [
          {
            text: this.$t('template_name'),
            value: 'mere_name'
          }
        ]
        if (this.isAdmin || this.isSuper) {
          this.headers.push({
            text: this.$t('created_by'),
            value: 'owner_name'
          })
        }

        this.headers.push(
          draftHeader,
          {
            text: this.$t('created_at'),
            value: 'mere_date'
          },
          {
            text: 'Actions',
            value: 'actions',
            sortable: false
          }
        )
      }
      this.loadingData = true
      this.$api
        .get('/medical-record', {
          params: {
            type: this.type
          }
        })
        .then(({ data }) => {
          this.items = data
          console.log('--->', data, '<---')
        })
        .finally(() => {
          this.loadingData = false
        })
    }
  }
}
</script>
