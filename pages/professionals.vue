<template>
  <div class='pa-6 mh-100v'>
    <v-row>
      <v-col>
        <div v-if='doctors && doctors.length' class='mb-1'>
          <p class='h3 text-center'>
            My Doctors
          </p>
          <div class='mb-1 my-doctors'>
            <ProfessionalThumb v-for='(p, i) in doctors' :key='i' class='doctor' :user='p'></ProfessionalThumb>
          </div>
        </div>
        <div class='mb-1'>
          <v-row>
            <v-col md="12">
              <p class='h2 text-center'>Find Doctors</p>
            </v-col>
          </v-row>
          <v-row>
            <v-col  md="6" offset-md="3" lg="6" offset-lg="3">
              <div class="flex-center">
                <v-text-field v-model="term" type="search" placeholder="Search by professional name" @keyup.enter="search"></v-text-field>
                <v-btn small tile color="primary" @click="search"><v-icon>mdi-magnify</v-icon></v-btn>
              </div>
            </v-col>
          </v-row>
        </div>
        <v-row>
          <v-col md="12">
            <v-skeleton-loader v-if='loadingResults'/>
            <div v-else-if="results.length > 0">
              <section v-for="(r, i) in results" :key="i" class="professional-bar">
                <div>
                  <professional-thumb :user="r" :show-make-appointment="false"></professional-thumb>
                </div>
                <div>
                  <div class="w-100">
                    <h3>{{ r.user_last_name }}, {{ r.user_first_name }} {{ r.profe_credentials }}</h3>
                  </div>
                  <div v-if="r.addr_line1" class="w-100 mb-1">
                    <p>
                      {{display_address(r)}}
                    </p>
                    <p>
                      <v-chip
                        v-if="r.category"
                        color="primary"
                      >
                        {{ r.category }}
                      </v-chip>
                      <v-chip
                        v-if="r.specialty"
                        color="success"
                      >
                        {{ r.specialty }}
                      </v-chip>
                      <v-divider vertical></v-divider>
                    </p>
                  </div>
                  <div class="flex-line">
                    <add-my-doctors :uuid="r.uuid" class="mr-1"></add-my-doctors>
                    <MakeAppointment :user="r" :super-small="false" button></MakeAppointment>
                  </div>

                </div>
              </section>
            </div>
            <div v-else>
              <p class="text-center">
                {{ $t('no_data_av') }}
              </p>
            </div>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <RequestModal ref='rmodal'></RequestModal>
      </v-col>
      <v-col>
        <v-dialog
          v-model='visible'
          max-width="320px"
          persistent
        >
          <v-card>
            <v-card-title>
              $t('conf_action')
            </v-card-title>
            <v-card-text>
              <p>{{ $t('conf_send_ch') }}</p>
            </v-card-text>
            <v-card-actions>
              <v-btn color="error" small tile :disabled="confirmLoading" @click="handleCancel">Cancel</v-btn>
              <v-btn color="primary" small tile :loading="confirmLoading" @click="handleOk">Ok</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import authMixin from '~/mixins/authMixin'
import addressDisplayMixin from "~/mixins/addressDisplayMixin";


export default {
  name: 'Professionals',

  mixins: [authMixin, addressDisplayMixin],
  middleware: ['verified'],
  data() {
    return {
      term: '',
      visible: false,
      columns: [
        {
          title: this.$t('full_name'),
          dataIndex: 'user_first_name',
          key: 'user_first_name',
          slots: {title: this.$t('full_name')},
          scopedSlots: {customRender: 'full_name'}
        },
        {
          title: this.$t('action'),
          key: 'action',
          scopedSlots: {customRender: 'action'}
        }
      ],
      users: [],
      loading: true,
      confirmLoading: false,
      uuid: '',
      action: '',
      socket: null,
      doctors: [],
      loadingResults: false,
      results: []
    }
  },
  head() {
    return {
      title: this.$t('profs')
    }
  },
  mounted() {
    this.search()
    this.getModerators()
    this.socket = this.$nuxtSocket({})
    this.socket.emit('join-room', this.myUserId)
    this.socket.on('chat-allowed', () => {
      this.getModerators()
    })



    if (this.isLoggedIn) {
      this.$api.get('/my-doctor', {
        params: {
          five: true
        }
      }).then(({data}) => {
        this.doctors = data
      })
    }
  },
  methods: {
    search() {
      this.loadingResults = true
      this.$userApi.get('/search', {
        params: {
          searchTerm: this.term,
          type: 'MODERATOR',
          categories: this.selectedCategories
        }
      }).then(({data}) => {
        if (data) {
          this.results = data
        }
        this.searched = true
      }).catch((err) => {
        this.$toast.error(err)
      }).finally(() => {
        this.loadingResults = false
      })
    },
    getModerators() {
      this.loading = true
    },
    handleCancel() {
      this.visible = false
      this.uuid = null
      this.confirmLoading = false
    },
    handleOk() {
      this.confirmLoading = true
      if (this.action === 'save') {
        this.$api.post('/my-professional', {
          professional: this.uuid
        }).then(() => {
          this.getModerators()
        }).catch((err) => {
          this.$refs.rmodal.$emit('error', err)
        }).finally(() => {
          this.confirmLoading = false
          this.visible = false
        })
      }
    },
    save(uuid) {
      this.uuid = uuid
      this.action = 'save'
      this.visible = true
    },
    remove(uuid) {
      this.uuid = uuid
      this.action = 'remove'
      this.visible = true
    }
  }
}
</script>

<style scoped lang='sass'>

.view-more-box
  display: flex
  width: 130px
  height: 130px
  justify-content: center
  align-items: center
  border: 1px solid #ccc
  padding: 1rem
  color: $mdn-primary

  &:hover
    cursor: pointer

.my-doctors
  display: flex
  flex-wrap: wrap
  justify-content: center
  align-items: center
  padding: 0.3rem
  flex-direction: row
  width: 100%

  .doctor
    display: flex

.professional-bar
  background: #fff
  border: 1px solid #ccc
  margin: 1rem
  display: flex
  flex-direction: column

  > div
    text-align: center

  > div:not(:first-child)
    padding: 1rem

@media screen and (min-width: $md)
  .professional-bar
    flex-direction: row

    > div
      text-align: left
  .view-more-box
    width: 133px
    height: 133px


@media screen and (min-width: $lg)
  .view-more-box
    width: 150px
    height: 150px
</style>
