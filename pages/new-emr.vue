<template>
  <div class="pa-6">
    <v-row class="mb-1">
      <v-col>
        <v-breadcrumbs
          :items="[
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
            },
          ]"
        ></v-breadcrumbs>
      </v-col>
    </v-row>
    <div v-if="loadingData">
      <v-skeleton-loader />
    </div>
    <v-form v-else ref="form" v-model="valid" @submit.prevent="handleSubmit">
      <v-row>
        <v-col>
          <p class="h4 mb-1">
            <span v-if="isTemplate">
              <span v-if="recordId">{{ $t('update_template') }}</span>
              <span v-else>{{ $t('create_template') }}</span>
            </span>
            <span v-else>
              <span v-if="recordId">{{ $t('update_record') }}</span>
              <span v-else>New Encounter</span>
            </span>
          </p>
        </v-col>
      </v-row>
      <v-row>
        <v-col sm="12">
          <div>
            <v-text-field
              v-if="isTemplate"
              v-model="template_name"
              :rules="[
                (v) => !!v || $t('v.en_tmp_name'),
                (v) => (!!v && v.length >= 2) || $t('v.min_2'),
              ]"
              type="text"
              :label="$t('template_name')"
              :placeholder="$t('template_name')"
              @input="inputReceived('template_name')"
            >
            </v-text-field>
            <v-autocomplete
              v-else
              v-model="selectedUser"
              :search-input.sync="userSearch"
              :loading="loadingUsers"
              hide-no-data
              :items="usersList"
              placeholder="Search patient"
              :disabled="recordId && selectedUser && isDisabled ? true : false"
              @change="UserSelectedFunc"
            ></v-autocomplete>
          </div>
        </v-col>
        <v-col v-if="!isTemplate" sm="6">
          <div>
            <!-- <v-text-field
              :value="dateString(picker)"
              placeholder="Date"
              readonly
              @click="visiblePicker = true"
            ></v-text-field> -->
             <date-picker

                v-model="picker"
                :disabled-date="(date) => date >= new Date()"
                format="MM/DD/YYYY"
                :max="new Date().toISOString().substr(0, 10)"
                type="date"
                style="width:100%;margin-top:20px"
                @change="visiblePicker = false"

              ></date-picker>
          </div>
        </v-col>
        <v-col v-if="!isTemplate" sm="6">
          <v-text-field
            v-if="template_name"
            v-model="template_name"
            :disabled="isDisabled"
          ></v-text-field>
          <v-autocomplete
            v-if="!template_name"
            :disabled="isDisabled"
            :items="templatesList"
            :label="$t('template_name')"
            :placeholder="$t('template_name')"
            clearable
            @change="changeTemplate"
          ></v-autocomplete>
        </v-col>
      </v-row>
      <v-row class="emr-container">
        <v-col md="3">
          <v-tabs v-model="tab" vertical>
            <v-tab href="#allergies">{{ $t('allergies') }}</v-tab>
            <v-tab href="#current_meds">{{ $t('current_meds') }}</v-tab>
            <v-tab href="#pharmacies">{{ $t('pharmacies') }}</v-tab>
            <v-tab href="#past_meds">{{ $t('past_meds') }}</v-tab>
            <v-tab href="#med_htry">{{ $t('med_htry') }}</v-tab>
            <v-tab href="#surgical_htry">{{ $t('surgical_htry') }}</v-tab>
            <v-tab href="#soc_htry">{{ $t('soc_htry') }}</v-tab>
            <v-tab href="#fam_hry">{{ $t('fam_hry') }}</v-tab>
          </v-tabs>
          <div class="mt-2">
            <v-tabs v-model="tab2" vertical>
              <v-tab href="#chief_complaint">{{ $t('chief_complaint') }}</v-tab>
              <v-tab href="#hpi">{{ $t('hpi') }}</v-tab>
              <v-tab href="#subject">{{ $t('subject') }}</v-tab>
              <v-tab href="#objective">{{ $t('objective') }}</v-tab>
              <v-tab href="#assessment">{{ $t('assessment') }}</v-tab>
              <v-tab href="#plan">{{ $t('plan') }}</v-tab>
              <v-tab href="#sign" @click="askSign" >{{ $t('sign') }}</v-tab>
              <v-tab href="#addendum">{{ $t('addendum') }}</v-tab>
            </v-tabs>

          </div>
        </v-col>
        <v-col md="9">
          <div id="medical_history_container" ref="medical_history_container" v-on:scroll="onMedicalHistoryScroll" style="height: 400px;overflow: auto; position: relative">
            <div ref="allergies">
              <label class="v-label theme--light" style="margin-bottom: 10px">
                {{$t('allergies')}}
              </label>
              <vue-editor
                v-model="allergies"

                :disabled="isDisabled"

              />
              <v-row v-if="selectedUser">
                <v-col class="text-right mt-1">
                  <v-btn
                    color="primary"
                    tile
                    small
                    @click="saveMedicalHistory('allergies', allergies)"

                  >
                    {{ $t('save_changes') }}
                  </v-btn>
                </v-col>
              </v-row>
            </div>
            <div ref="current_meds" class="mt-1" >
              <label class="v-label theme--light" style="margin-bottom: 10px">
                {{$t('current_meds')}}
              </label>
              <vue-editor
                v-model="current_meds"
                :disabled="isDisabled"
              />
              <v-row v-if="selectedUser">
                <v-col class="text-right mt-1">
                  <v-btn
                    color="primary"
                    tile
                    small
                    @click="saveMedicalHistory('current_meds', current_meds)"

                  >
                    {{ $t('save_changes') }}
                  </v-btn>
                </v-col>
              </v-row>
            </div>
            <div ref="pharmacies" class="mt-1">
              <label class="v-label theme--light" style="margin-bottom: 10px">
                {{$t('pharmacies')}}
              </label>
              <vue-editor
                v-model="pharmacies"
                :disabled="isDisabled"
              />
              <v-row v-if="selectedUser">
                <v-col class="text-right mt-1">
                  <v-btn
                    color="primary"
                    tile
                    small
                    @click="saveMedicalHistory('pharmacies', pharmacies)"

                  >
                    {{ $t('save_changes') }}
                  </v-btn>
                </v-col>
              </v-row>
            </div>
            <div ref="past_meds" class="mt-1">
              <label class="v-label theme--light" style="margin-bottom: 10px">
                {{$t('past_meds')}}
              </label>
              <vue-editor
                v-model="past_meds"
                :disabled="isDisabled"
              />
              <v-row v-if="selectedUser">
                <v-col class="text-right mt-1">
                  <v-btn
                    color="primary"
                    tile
                    small
                    @click="saveMedicalHistory('past_meds', past_meds)"

                  >
                    {{ $t('save_changes') }}
                  </v-btn>
                </v-col>
              </v-row>
            </div>
            <div ref="med_htry" class="mt-1">
              <label class="v-label theme--light" style="margin-bottom: 10px">
                {{$t('med_htry')}}
              </label>
              <vue-editor
                v-model="medical_history"
                :disabled="isDisabled"
              />
              <v-row v-if="selectedUser">
                <v-col class="text-right mt-1">
                  <v-btn
                    color="primary"
                    tile
                    small
                    @click="saveMedicalHistory('medical_history', medical_history)"

                  >
                    {{ $t('save_changes') }}
                  </v-btn>
                </v-col>
              </v-row>
            </div>
            <div ref="surgical_htry" class="mt-1">
              <label class="v-label theme--light" style="margin-bottom: 10px">
                {{$t('surgical_htry')}}
              </label>
              <vue-editor
                v-model="surgical_history"
                :disabled="isDisabled"
              />
              <v-row v-if="selectedUser">
                <v-col class="text-right mt-1">
                  <v-btn
                    color="primary"
                    tile
                    small
                    @click="saveMedicalHistory('surgical_history', surgical_history)"

                  >
                    {{ $t('save_changes') }}
                  </v-btn>
                </v-col>
              </v-row>
            </div>
            <div ref="soc_htry" class="mt-1">
              <label class="v-label theme--light" style="margin-bottom: 10px">
                {{$t('soc_htry')}}
              </label>
              <vue-editor
                v-model="social_history"
                :disabled="isDisabled"
              />
              <v-row v-if="selectedUser">
                <v-col class="text-right mt-1">
                  <v-btn
                    color="primary"
                    tile
                    small
                    @click="saveMedicalHistory('social_history', social_history)"

                  >
                    {{ $t('save_changes') }}
                  </v-btn>
                </v-col>
              </v-row>
            </div>
            <div ref="fam_hry" class="mt-1">
              <label class="v-label theme--light" style="margin-bottom: 10px">
                {{$t('fam_hry')}}
              </label>
              <vue-editor
                v-model="family_history"
                :disabled="isDisabled"
              />
              <v-row v-if="selectedUser">
                <v-col class="text-right mt-1">
                  <v-btn
                    color="primary"
                    tile
                    small
                    @click="saveMedicalHistory('family_history', family_history)"

                  >
                    {{ $t('save_changes') }}
                  </v-btn>
                </v-col>
              </v-row>
            </div>
          </div>
          <table v-if="selectedUser" class="vital-table mt-4">
            <tr class="vital-head">
              <th v-for="(header,index) in vitalHeaders"
                  :key="header.value">
                <div v-if="index != 0">
                  <h6 class="text-center">{{header.date}}</h6>
                  <h6 class="text-center">{{header.time}}</h6>
                </div>
              </th>
              <th  v-if="isNew"><v-icon @click="addVital">mdi-plus</v-icon></th>
            </tr>

            <tr class="vital-second-head">
              <th v-for="(header,index) in vitalHeaders"
                  :key="header.value" >

                <h6 v-if="index == 0"><v-icon  color="#333" class="submenu--icon" @click="changeShowVital">{{showVital? 'mdi-menu-down': 'mdi-menu-up'}}</v-icon> Vitals</h6>
              </th>
              <th v-if="isNew"></th>
            </tr>
            <tr  v-for="(item) in vitalContents" v-show="showVital" :key="item.key">
              <td>{{item.title}}</td>
              <td v-for="(value) in item.content" :key="value.id">
                <input v-if="item.key == 'bp'" v-model="value.content" type='text' class="text-center" :disabled="item.key == 'bmi'"  @change='changeVital(value, item.key)' />
                <input v-else v-model="value.content" type='number' class="text-center" :disabled="item.key == 'bmi'"  @change='changeVital(value, item.key)' />
              </td>
              <td v-if="isNew"></td>
            </tr>

          </table>

          <div ref="detail_container" style="height: 400px;overflow: auto; position: relative" class="mt-4">
            <div ref="chief_complaint">
              <label class="v-label theme--light" style="margin-bottom: 10px">
                {{$t('chief_complaint')}}
              </label>
              <vue-editor
                v-model="chief_complaint"
                :disabled="isDisabled"
              />
              <v-row v-if="selectedUser">
                <v-col class="text-right mt-1">
                  <v-btn
                    color="primary"
                    tile
                    small
                    @click="saveDetail('chief_complaint', chief_complaint)"
                  >
                    {{ $t('save_changes') }}
                  </v-btn>
                </v-col>
              </v-row>
            </div>
            <div ref="hpi" class="mt-1">
              <label class="v-label theme--light" style="margin-bottom: 10px">
                {{$t('hpi')}}
              </label>
              <vue-editor
                v-model="hip"
                :disabled="isDisabled"
              />
              <v-row v-if="selectedUser">
                <v-col class="text-right mt-1">
                  <v-btn
                    color="primary"
                    tile
                    small
                    @click="saveDetail('hip', hip)"
                  >
                    {{ $t('save_changes') }}
                  </v-btn>
                </v-col>
              </v-row>
            </div>
            <div ref="subject" class="mt-1">
              <label class="v-label theme--light" style="margin-bottom: 10px">
                {{$t('subject')}}
              </label>
              <vue-editor
                v-model="subject"
                :disabled="isDisabled"
              />
              <v-row v-if="selectedUser">
                <v-col class="text-right mt-1">
                  <v-btn
                    color="primary"
                    tile
                    small
                    @click="saveDetail('subject', subject)"
                  >
                    {{ $t('save_changes') }}
                  </v-btn>
                </v-col>
              </v-row>
            </div>
            <div ref="objective" class="mt-1">
              <label class="v-label theme--light" style="margin-bottom: 10px">
                {{$t('objective')}}
              </label>
              <vue-editor
                v-model="objective"
                :disabled="isDisabled"
              />
              <v-row v-if="selectedUser">
                <v-col class="text-right mt-1">
                  <v-btn
                    color="primary"
                    tile
                    small
                    @click="saveDetail('objective', objective)"
                  >
                    {{ $t('save_changes') }}
                  </v-btn>
                </v-col>
              </v-row>
            </div>
            <div ref="assessment" class="mt-1">
              <label class="v-label theme--light" style="margin-bottom: 10px">
                {{$t('assessment')}}
              </label>
              <vue-editor
                v-model="assessment"
                :disabled="isDisabled"
              />
              <v-row v-if="selectedUser">
                <v-col class="text-right mt-1">
                  <v-btn
                    color="primary"
                    tile
                    small
                    @click="saveDetail('assessment', assessment)"
                  >
                    {{ $t('save_changes') }}
                  </v-btn>
                </v-col>
              </v-row>
            </div>
            <div ref="plan" class="mt-1">
              <label class="v-label theme--light" style="margin-bottom: 10px">
                {{$t('plan')}}
              </label>
              <vue-editor
                v-model="plan"
                :disabled="isDisabled"
              />
              <v-row v-if="selectedUser">
                <v-col class="text-right mt-1">
                  <v-btn
                    color="primary"
                    tile
                    small
                    @click="saveDetail('plan', plan)"
                  >
                    {{ $t('save_changes') }}
                  </v-btn>
                </v-col>
              </v-row>
            </div>
            <div ref="sign" class="mt-1">
              <v-textarea
                v-model="sign"
                :label="$t('sign')"
                :placeholder="$t('sign')"
                :disabled="true"
              />
            </div>
            <div ref="addendum" class="mt-1">
              <label class="v-label theme--light" style="margin-bottom: 10px">
                {{$t('addendum')}}
              </label>
              <vue-editor
                v-model="addendum"
              />
              <v-row v-if="selectedUser">
                <v-col class="text-right mt-1">
                  <v-btn
                    color="primary"
                    tile
                    small
                    @click="saveDetail('addendum', addendum)"
                  >
                    {{ $t('save_changes') }}
                  </v-btn>
                </v-col>
              </v-row>
            </div>
          </div>
        </v-col>
      </v-row>

      <v-row class="mt-1">
        <v-col>
          <v-btn color="primary" small tile type="submit" :loading="loading">
            <span v-if="isTemplate">
              <span v-if="recordId">{{ $t('update_template') }}</span>
              <span v-else>{{ $t('create_template') }}</span>
            </span>
            <span v-else>
              <span v-if="recordId">{{ 'Save' }}</span>
              <span v-else>{{ $t('chat_record') }}</span>
            </span>
          </v-btn>
          <v-btn
            v-if="!isTemplate"
            small
            tile
            color="pink"
            dark
            :loading="loadingPdf"
            @click="printRecord"
          >
            <v-icon>mdi-file</v-icon>
            {{ $t('print') }}
          </v-btn>
        </v-col>
      </v-row>
      <!-- <v-row v-else class="mt-1">
        <v-col>
          <v-btn
            small
            tile
            color="success"
            @click.prevent="$router.push(localePath('/emr'))"
          >
            Go Back
            <v-icon>mdi-arrow-left</v-icon>
          </v-btn>
        </v-col>
      </v-row> -->
      <RequestModal ref="rmodal" />
      <a
        ref="pdfDownload"
        :href="pdfFile"
        :download="pdfFile"
        class="d-none"
        target="_blank"
      ></a>
    </v-form>
    <ConfirmDialog
      v-model="loadingSign"

      title="Are you sure you want to lock this encounter?"
      @accept="confirmSign"
      @cancel="cancelSign"
    ></ConfirmDialog>
  </div>
</template>
<script>
import DatePicker from "vue2-datepicker";
import formMixin from '~/mixins/formMixin'
import dateMixin from '~/mixins/dateMixin'
import uTcDate from '~/mixins/uTcDate'
import 'vue2-datepicker/index.css';
const debounce = require('lodash.debounce')
const { validate } = require('uuid')

export default {
  name: 'NewEmr',
  components:{DatePicker},
  mixins: [formMixin, dateMixin,uTcDate],
  layout: 'dashboard',
  middleware: [
    'authenticated',
    'not-blocked',
    'not-deleted',
    'verified',
    'pin-set',
  ],
  data: () => ({
    isNew: true,
    selectedUser: null,
    loadingUsers: false,
    loadingSign: false,
    selectedTab: '',
    selectedTab2: '',
    oldTab2: 0,
    allergies: '',
    current_meds: '',
    pharmacies: '',
    past_meds: '',
    medical_history: '',
    surgical_history: '',
    social_history: '',
    family_history: '',
    scrollMedicalHistory: 0,
    chief_complaint: '',
    hip: '',
    subject: '',
    objective: '',
    assessment: '',
    plan: '',
    sign: '',
    vitalHeaders: [],
    vitalContents: [],
    vitalData: [],
    addendum: '',
    showVital: true,
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
    picker: new Date(),
    visiblePicker: false,
    isDeafaultData :false
  }),
  head() {
    return {
      title: 'New Encounter',
    }
  },
  computed: {

    tab: {
      set (tab) {
        if(tab !== this.selectedTab) {
          this.selectedTab = tab;
          if(this.$refs[tab]) {
            this.$refs[tab].scrollIntoView(true);
          }
          this.$router.replace({ query: { ...this.$route.query, tab } })
        }

      },
      get () {
        return this.$route.query.tab
      }
    },

    tab2: {
      set (tab2) {
        if(tab2 === this.selectedTab2) {
          return ;
        }
        this.selectedTab2 = tab2;
        if(this.$route.query.tab) {
          if(this.$refs[tab2]) {
            console.log("Change tab2");
            this.$refs[tab2].scrollIntoView(true);
          }
          this.$router.replace({ query: { ...this.$route.query, tab2 } })
        } else {
          const that = this;
          const checkTabInterval = setInterval(function() {
            if(that.$route.query.tab) {
              if(that.$refs[tab2]) {
                that.$refs[tab2].scrollIntoView(true);
              }
              that.$router.replace({ query: { ...that.$route.query, tab2 } })
              clearInterval(checkTabInterval);
            }
          }, 500);
        }
      },
      get () {
        return this.$route.query.tab2
      }
    },


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
    },
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
      // this.saveDraft('bp')
    },
    userSearch: debounce(function (v) {
      if (validate(v)) {
        // The professional selected a valid user.
        // this.saveDraft('user')
      }
      if (v && v.length > 0) {
        this.loadingUsers = true
        this.$userApi
          .get('/search', {
            params: {
              searchTerm: v,
            },
          })
          .then(({ data }) => {
            if (data && data.length) {
              this.usersList = data.map((user) => {
                return {
                  text: user.full_name,
                  value: user.uuid,
                }
              })
            }
          })
          .catch(() => {
            this.$toast.error(this.$t('unable_search').toString())
          })
          .finally(() => {
            this.loadingUsers = false
          })
      } else {
        this.usersList = []
      }
    }, 600),
  },
  mounted() {
    this.vitalHeaders = [
      {value: 'title'},
    ];
    const c = this.$route.query
    if (c.mere) {
      this.recordId = c.mere
      this.loadingData = true
      this.$api
        .get('/medical-record/' + this.recordId)
        .then(({ data }) => {
          this.selectedUser = data.user_uuid
          this.setData(data, true)
          if (data && data.mere_date) {
            this.picker = new Date(data.mere_date)
            console.log(this.picker,data.mere_date)
          }

          if (data.mere_sign) {
            this.locked = true
          }

          if (data.mrus_user_uuid) {
            this.usersList = [
              {
                text: data.user_first_name + ' ' + data.user_last_name,
                value: data.user_uuid,
              },
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
          // this.updateBMI()
          setTimeout(() => {
            this.canSaveDraft = true
          }, 1000)
        })
        .catch(() => {
          this.recordId = null
          this.$toast.error(this.$t('could_nf_rec').toString())
        })
        .finally(() => {
          this.loadingData = false
        })
    } else {
      this.canSaveDraft = true
    }
    this.$api
      .get('/medical-record', {
        params: {
          type: 'template',
        },
      })
      .then(({ data }) => {
        this.templates = data
        this.templatesList = data.map((tmp) => {
          const isAdminTemp = tmp.mere_temp_is_admin? ' by Admin':''
          return {
            text: tmp.mere_name +isAdminTemp,
            value: tmp.mere_uuid,
          }
        })
      })
    if (c.mode && c.mode === 'view') {
      this.locked = true
    }
  },
  methods: {
    selectTab() {
      console.log("Select tab");
      console.log(this.$refs.medical_history_container);
      this.$refs.medical_history_container.scrollIntoView(true);
    },
    selectTab2() {
      console.log("Select tab 2");
      this.$refs.detail_container.scrollIntoView(true);
    },
    saveMedicalHistory(arg, value) {
      console.log(arg + ":" + this.recordId);
      if (validate(this.recordId)) {
        this.putData(arg, value)
      }
    },
    detectScrollPos() {
      const scrollTop = this.$refs.medical_history_container.scrollTop;
      // const menus = [
      //   'allergies',
      //   'current_meds',
      //   'pharmacies',
      //   'past_meds',
      //   'med_htry',
      //   'surgical_htry',
      //   'soc_htry',
      //   'fam_hry'
      // ]
      console.log(scrollTop);
      // if(scrollTop < 0) {
      //   this.tab = menus[0];
      // } else if(scrollTop > this.$refs.medical_history_container.scrollHeight) {
      //   this.tab = menus[menus.length - 1];
      // } else {
      //   menus.forEach(menu => {
      //     console.log(this.$refs[menu].offsetTop + ":" + (this.$refs[menu].offsetTop + this.$refs[menu].offsetHeight));
      //     if(scrollTop >= this.$refs[menu].offsetTop && scrollTop < this.$refs[menu].offsetTop + this.$refs[menu].offsetHeight) {
      //       console.log("Menu is " + menu);
      //       if(this.tab.value !== menu) {
      //         this.tab = menu;
      //         console.log("selected menu " + menu);
      //       }
      //
      //     }
      //   });
      // }
    },
    onMedicalHistoryScroll(evt, el) {
      this.detectScrollPos();
    },
    saveDetail(arg, value) {
      console.log(this.recordId);
      if (validate(this.recordId)) {
        this.putData(arg, value)
      }
    },
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
          this.$api
            .post('/medical-record/draft', {
              type: this.type,
              arg,
            })
            .then(({ data }) => {
              if (data && data.mere_uuid) {
                console.log("Draft Data: " + data.mere_uuid);
                this.recordId = data.mere_uuid
                if(!this.isDeafaultData){
                this.$toast.success('A new draft has been created')
                }

                this.draft = true
                this.putData(arg, v || valueOverride)
                if (data.mere_sign) {
                  this.locked = true
                }
              }
            })
            .catch(() => {
              this.$toast.error(
                "Failed to create a new draft. You can continue but your changes won't be saved automatically."
              )
            })
        } else if (validate(this.recordId)) {
          this.putData(arg, v || valueOverride)
        }
      }
    },
    changeVital(item, key) {
      const id = item.id;
      let height = 0;
      let weight = 0;
      console.log(item);
      console.log(this.vitalContents[0].content);
      this.vitalContents[0].content.forEach((heightData) => {
        console.log(heightData);
        if(heightData.id === id) {
          height = heightData.content;
        }
      });

      this.vitalContents[1].content.forEach((weightData) => {
        if(weightData.id === id) {
          weight = weightData.content;
        }
      });

      const bmi = this.getBMI(weight, height);
      this.vitalContents[2].content.forEach((bmiData) => {
        if(bmiData.id === id) {
          bmiData.content = bmi;
        }
      });


      this.$api
        .patch('/medical-record/' + key + '/' + item.id, {
          value: item.content,
        })
        .then(({ data }) => {
          console.log(`Updated ${name} successfully`)
        })
        .catch(() => {
          this.$toast.error(`Failed to update ${key}`)
        })
    },
    getVitals() {
      this.vitalHeaders = [
        {value: 'title'}
      ];
      this.vitalContents = [
        {
          title: 'Height',
          key: 'height',
          content: [],
        },
        {
          title: 'Weight',
          key: 'weight',
          content: [],
        },
        {
          title: 'BMI',
          key: 'bmi',
          content: [],
        },
        {
          title: 'BP',
          content: [],
          key: 'bp',
        },
        {
          title: 'Temp',
          content: [],
          key: 'temp',
        },
        {
          title: 'Pulse',
          content: [],
          key: 'pulse',
        },
        {
          title: 'Resp Rate',
          content: [],
          key: 'resp-rate',
        },
        {
          title: 'Pulse Ox %',
          content: [],
          key: 'pulse-ox',
        },
      ];
      this.vitalData.forEach(data => {
        let dateTime = data.mruv_date;
        if(dateTime) {
          dateTime = new Date(dateTime);
          console.log(dateTime);
          const date = dateTime.toISOString().substring(0,10);
          const time = dateTime.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: 'numeric',
            hour12: true
          });
          this.vitalHeaders.push({
            value: data.mruv_uuid,
            date,
            time,
          });

          this.vitalContents[0].content.push({
            id: data.mruv_uuid,
            content: data.mruv_height
          })

          this.vitalContents[1].content.push({
            id: data.mruv_uuid,
            content: data.mruv_weight
          })

          this.vitalContents[2].content.push({
            id: data.mruv_uuid,
            content: this.getBMI(data.mruv_weight, data.mruv_height)
          })

          this.vitalContents[3].content.push({
            id: data.mruv_uuid,
            content: data.mruv_bp
          })

          this.vitalContents[4].content.push({
            id: data.mruv_uuid,
            content: data.mruv_temp
          })

          this.vitalContents[5].content.push({
            id: data.mruv_uuid,
            content: data.mruv_pulse
          })

          this.vitalContents[6].content.push({
            id: data.mruv_uuid,
            content: data.mruv_resp_rate
          })

          this.vitalContents[7].content.push({
            id: data.mruv_uuid,
            content: data.mruv_pulse_ox
          })
        }

      });
      console.log(this.vitalHeaders);
      console.log(this.vitalContents);
    },
    addVital() {
      this.$api
        .post('/medical-record/record-vital', {
          recordId: this.recordId,
          uuid: this.selectedUser,
          date: new Date()
        })
        .then(({ data }) => {
          console.log(data);
          this.vitalData.push({
            mruv_uuid: data.mruv_uuid,
            mruv_date: new Date()
          });
          this.getVitals();
          this.isNew = false;
          console.log(this.vitalData);
          console.log(`Updated ${name} successfully`)
        })
        .catch((err) => {
          console.log(err);
          this.$toast.error(`Failed to create vital record`)
        });
    },
    changeShowVital() {
      this.showVital = !this.showVital;
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
      this.$api
        .patch('/medical-record/' + name + '/' + this.recordId, {
          value: v,
        })
        .then(({ data }) => {
          console.log(`Updated ${name} successfully`)
        })
        .catch(() => {
          this.$toast.error(`Failed to update ${name}`)
        })
    },
    printRecord() {
      if (this.recordId) {
        this.loadingPdf = true
        this.$api
          .get('/medical-record/pdf/' + this.recordId)
          .then(({ data }) => {
            this.$toast.success(this.$t('pdf_gend').toString())
            this.pdfFile =
              process.env.API_URL + '/generated/record/' + data.file
            setTimeout(() => {
              this.$refs.pdfDownload.click()
            }, 500)
          })
          .catch(() => {
            this.$toast.error(this.$t('pdf_fail').toString())
          })
          .finally(() => {
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
    getBMI(w, h) {
      let r = 0
      if (w && h) {
        // [weight (lb) / height (in) / height (in)] x 703
        w = parseFloat(w)
        h = parseFloat(h)
        r = (w / h / h) * 703
      }
      return r.toFixed(2)
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

      if (!this.template_name) {
        const err = {
          response: { message: 'Template name required', status: 400 },
        }
        this.$refs.rmodal.$emit('error', err)
        return
      }
      if (this.valid) {
        const values = {
          template_name: this.template_name,
          patient: this.selectedUser,
          allergies: this.allergies,
          current_meds: this.current_meds,
          pharmacies: this.pharmacies,
          past_meds: this.past_meds,
          medical_history: this.medical_history,
          surgical_history: this.surgical_history,
          social_history: this.social_history,
          family_history: this.family_history,
          bp: this.bp,
          pulse: this.pulse,
          resp_rate: this.resp_rate,
          temp: this.temp,
          height: this.height,
          weight: this.weight,
          chief_complaint: this.chief_complaint,
          hip: this.hip,
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

          // const savingDate = new Date(this.getISODate(this.picker));
          // savingDate.setHours(new Date().getHours());
          // savingDate.setMinutes(new Date().getMinutes());


          values.date = new Date(this.picker).toISOString()

          console.log('The values --->', values)
          console.log('saving Date :  --->', values.date)
        // 2022-01-14

        this.loading = true

        console.log('record id ', this.recordId, this.isTemplate)
        if (this.recordId) {
          values.patient = this.selectedUser
          if (!this.isTemplate && !this.isValidUser()) {
            this.loading = false
            this.$toast.error(this.$t('please_select_user').toString())
            return false
          }

          this.$api
            .put('/medical-record/' + this.recordId, values)
            .then(() => {
              if (this.isValidUser() && !this.$route.query.mere) {
                this.$api
                  .post('/medical-record/record', values)
                  .then(() => {
                    this.$toast.success(this.$t('record_hb_created').toString())
                    setTimeout(() => {
                      this.$router.push(this.localePath('/emr'))
                    }, 500)
                  })
                  .catch((err) => {
                    this.$refs.rmodal.$emit('error', err)
                  })
                  .finally(() => {
                    this.loading = false
                  })
              } else {
                this.$router.push(this.localePath('/emr'))
              }
              // this.$router.push(this.localePath('/emr'))
            })
            .catch((err) => {
              this.$refs.rmodal.$emit('error', err)
            })
            .finally(() => {
              this.loading = false
            })
        } else if (this.isTemplate) {
          this.$api
            .post('/medical-record', values)
            .then(() => {
              this.$toast.success(this.$t('template_hb_created').toString())
              this.$router.push(this.localePath('/emr'))
            })
            .catch((err) => {
              this.$refs.rmodal.$emit('error', err)
            })
            .finally(() => {
              this.loading = false
            })
        }
      }
    },
    setData(tm, type) {
      console.log(tm);
      this.recordId = tm.mere_uuid
      this.template_name = tm.mere_name
      if(type) {
        this.allergies = tm.mere_allergies
        this.current_meds = tm.mere_current_meds
        this.pharmacies = tm.mere_pharmicies
        this.past_meds = tm.mere_past_meds
        this.medical_history = tm.mere_medical_history
        this.surgical_history = tm.mere_surgical_history
        this.social_history = tm.mere_social_history
        this.family_history = tm.mere_family_history
      }
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
          this.setData(tm, false)
        }
      })
    },
    UserSelectedFunc(u) {
      this.$api
        .get('/medical-record?type=record&create=true&mrus_user_uuid=' + u)
        .then(({ data }) => {
             console.log('user last record ', data)
          if (data && data.length) {
            if (data && data.length > 1) {
              data = data.sort(function (a, b) {
                return new Date(b.mere_date) - new Date(a.mere_date)
              })
            }
            console.log(data);

            const item = data[0]
             item.mere_sign = '';
            this.setData(item, true);
            this.vitalData = data;
            this.getVitals();


            this.isTemplateD = false
            this.locked = false;
            this.saveDetail('sign', this.sign);
        //    this.updateBMI()
          } else {
            this.isNew = true;
            this.vitalData = [];
            this.getVitals();
          }
        })
        .catch(() => {
          this.recordId = null
          this.$toast.error(this.$t('could_nf_rec').toString())
        })
        .finally(() => {
          this.loadingData = false
        })
    },

    askSign() {
      this.oldTab2 = this.tab2;
      if(!this.sign || this.sign.length === 0) {
        this.loadingSign = true;
      }
    },

    confirmSign() {
      this.loadingSign = false;
      this.sign = this.$auth.user.last_name + ", " + this.$auth.user.user_first_name;
      if(this.selectedUser) {
        this.saveDetail('sign', this.sign);
      }

    },
    cancelSign() {
      this.loadingSign = false;
      this.tab2 = this.oldTab2;
    }
  },
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
