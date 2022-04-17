<template>
  <div class="calendar-appointments">
    <div class="d-flex">
      <div class="calendar-left">
        <vue-cal
          style="height: calc(100vh - 231px)"
          today-button
          hide-view-selector
          sticky-split-labels
          active-view="day"
          :time-from="7 * 60"
          :time-to="24 * 60"
          :time-step="15"
          :time-cell-height="30"
          :events="events"
          :split-days="splitDays"
          :selected-date="selectedDate"
          :disable-views="['years', 'year', 'month', 'week']"
          :drag-to-create-event="false"
          :cell-click-hold="false"
          :on-event-click="onEventClick"
          @cell-dblclick="onEventCreate"
        >
          <template #title="{ view }">
            <span v-if="view.id === 'day'"
              >{{
                view.startDate
                  .toLocaleString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })
                  .replace(/\,/g, '')
              }}
            </span>
          </template>
          <template #split-label="{ split }">
            <strong>{{ split.label }}</strong>
          </template>
        </vue-cal>
        <!--        :min-split-width="150"-->
      </div>
      <div class="calendar-right">
        <vue-cal
          class="vuecal--blue-theme vuecal--rounded-theme small-calendar"
          active-view="month"
          xsmall
          hide-view-selector
          sticky-split-labels
          :time="false"
          :disable-views="['years', 'year', 'week', 'day']"
          @cell-focus="selectedDate = $event"
        ></vue-cal>
        <v-card outlined tile class="mt-5 resource">
          <v-list dense>
            <v-subheader class="subheader">Resource</v-subheader>
            <v-btn icon outlined x-small absolute top right>
              <v-icon @click="showResourceField()"> mdi-plus </v-icon>
            </v-btn>
            <v-list-item
              v-for="(value, data, index) in splitUsers"
              :key="index"
            >
              <template #default="{ active }">
                <v-list-item-action>
                  <v-checkbox
                    v-model="selectedResource"
                    :input-value="active"
                    :value="value.id"
                    class="mt-0"
                  ></v-checkbox>
                </v-list-item-action>

                <v-list-item-content>
                  <v-list-item-title>{{ value.label }}</v-list-item-title>
                </v-list-item-content>

                <v-list-item-action v-if="value.id !== 0">
                  <v-btn
                    icon
                    x-small
                    @click="deleteResource(value.resource_uuid)"
                  >
                    <v-icon color="red">mdi-close</v-icon>
                  </v-btn>
                </v-list-item-action>
              </template>
            </v-list-item>
            <v-list-item v-if="showNewResource">
              <template #default>
                <v-list-item-content>
                  <v-text-field
                    v-model="resource"
                    :error-messages="resourceErrors"
                    label="Resource Name"
                    required
                    @input="$v.resource.$touch()"
                    @blur="$v.resource.$touch()"
                  ></v-text-field>
                </v-list-item-content>

                <v-list-item-action class="flex-row align-center">
                  <v-btn icon x-small class="mr-2" @click="addResource()">
                    <v-icon color="green">mdi-check</v-icon>
                  </v-btn>
                  <v-btn icon x-small @click="hideResourceField()">
                    <v-icon>mdi-close</v-icon>
                  </v-btn>
                </v-list-item-action>
              </template>
            </v-list-item>
          </v-list>
        </v-card>
      </div>
    </div>
    <v-dialog
      v-model="showEventCreationDialog"
      :persistent="true"
      max-width="800"
    >
      <v-card>
        <v-row style="width: 100%">
          <v-col class="d-flex align-left" cols="12" md="10">
            <v-card-title> Add Appointment </v-card-title>
          </v-col>
          <v-col class="d-flex align-right" cols="12" md="2">
            <v-btn
              small
              tile
              color="primary"
              class="mt-5"
              type="submit"
              block
              @click="addPatient()"
            >
              {{ 'Add patient' }}
            </v-btn>
          </v-col>
        </v-row>

        <v-card-text>
          <v-row>
            <v-col :xs="24" :sm="24" :md="12">
              <!-- <a-auto-complete
                v-model="userSearch"
                :error-messages="nameErrors"
                required
                :disabled="checkDisabled"
                placeholder="Search patient"
                min-width="700px"
              >
                <a-icon
                  slot="suffix"
                  type="search"
                  style="color: rgba(0, 0, 0, 0.25)"
                />
              </a-auto-complete> -->

              <v-autocomplete
                v-model="name"
                :items="patientList"
                item-text="patientName"
                item-value="patientName"
                return-string
                required
                clearable
                placeholder="Search Patient"
                :hide-details="true"
              ></v-autocomplete>
            </v-col>
          </v-row>

          <!-- <v-text-field
            v-model="name"
            :disabled="checkDisabled"
            :error-messages="nameErrors"
            label="Patient Name"
            required
            @input="$v.name.$touch()"
            @blur="$v.name.$touch()"
          /> -->
          <v-row>
            <v-col class="d-flex align-center" cols="12" md="2">
              <span>Start Time: </span>
            </v-col>
            <v-col cols="12" md="5">
              <v-menu
                ref="startDateMenu"
                v-model="startDateMenu"
                :close-on-content-click="false"
                transition="scale-transition"
                offset-y
                max-width="290px"
                min-width="auto"
              >
                <template #activator="{ on, attrs }">
                  <v-text-field
                    v-model="startDateFormatted"
                    :disabled="checkDisabled"
                    label="Date"
                    persistent-hint
                    prepend-icon="mdi-calendar"
                    v-bind="attrs"
                    @blur="startDate = parseDate(startDateFormatted)"
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="startDate"
                  no-title
                  @input="startDateMenu = false"
                ></v-date-picker>
              </v-menu>
            </v-col>
            <v-col cols="12" md="5">
              <v-text-field
                v-model="startTime"
                type="time"
                label="Time"
                :disabled="checkDisabled"
              >
              </v-text-field>
            </v-col>
          </v-row>
          <v-row class="mt-0">
            <v-col class="d-flex align-center" cols="12" md="2">
              <span>End Time: </span>
            </v-col>
            <v-col cols="12" md="5">
              <v-menu
                ref="endDateMenu"
                v-model="endDateMenu"
                :close-on-content-click="false"
                transition="scale-transition"
                offset-y
                max-width="290px"
                min-width="auto"
              >
                <template #activator="{ on, attrs }">
                  <v-text-field
                    v-model="endDateFormatted"
                    :disabled="checkDisabled"
                    label="Date"
                    persistent-hint
                    prepend-icon="mdi-calendar"
                    v-bind="attrs"
                    @blur="endDate = parseDate(endDateFormatted)"
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="endDate"
                  no-title
                  @input="endDateMenu = false"
                ></v-date-picker>
              </v-menu>
            </v-col>
            <v-col cols="12" md="5">
              <v-text-field
                v-model="endTime"
                type="time"
                label="Time"
                :disabled="checkDisabled"
              >
              </v-text-field>
            </v-col>
          </v-row>
          <v-textarea
            v-model="notes"
            :disabled="checkDisabled"
            label="Notes"
            counter
          ></v-textarea>
          <v-layout justify-end>
            <v-btn
              v-if="checkEventUpdate"
              class="mr-4"
              :disabled="checkDisabled"
              color="primary"
              @click="closeUpdateDialog()"
              >Update</v-btn
            >
            <v-btn
              v-else
              class="mr-4"
              :disabled="checkDisabled"
              color="primary"
              @click="closeCreationDialog()"
              >Save</v-btn
            >
            <v-btn @click="cancelEventCreation()">Cancel</v-btn>
          </v-layout>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import VueCal from 'vue-cal'
import 'vue-cal/dist/vuecal.css'
import { validationMixin } from 'vuelidate'
import { required } from 'vuelidate/lib/validators'

export default {
  name: 'CalendarAppointment',
  components: { VueCal },
  mixins: [validationMixin],
  middleware: ['authenticated', 'not-blocked', 'not-deleted', 'verified'],
  validations: {
    name: { required },
    resource: { required },
  },
  data: (vm) => ({
    events: [],
    splitUsers: [],
    splitDays: [{ id: 0, label: 'All' }],
    selectedResource: [],
    showEventCreationDialog: false,
    selectedDate: null,
    selectedEvent: null,
    name: null,
    resource: null,
    notes: null,
    checkDisabled: false,
    checkEventUpdate: false,
    startDateMenu: false,
    startDate: vm.initDate(),
    startDateFormatted: vm.formatDate(vm.initDate()),
    patientList: [],
    endDateMenu: false,
    endDate: vm.initDate(),
    endDateFormatted: vm.formatDate(vm.initDate()),
    startTime: '07:00',
    endTime: '07:00',

    showNewResource: false,
  }),
  computed: {
    nameErrors() {
      const errors = []
      if (!this.$v.name.$dirty) return errors
      !this.$v.name.required && errors.push('Name is required.')
      return errors
    },
    resourceErrors() {
      const errors = []
      if (!this.$v.resource.$dirty) return errors
      !this.$v.resource.required && errors.push('Resource Name is required.')
      return errors
    },
  },
  watch: {
    startDate() {
      this.startDateFormatted = this.formatDate(this.startDate)
    },
    endDate() {
      this.endDateFormatted = this.formatDate(this.endDate)
    },

    selectedResource() {
      this.splitDays = []

      if (
        this.selectedResource.length === 1 &&
        this.selectedResource[0].resource_uuid === 0
      ) {
        this.splitDays.push({
          id: 1,
          label: 'All',
        })
      } else {
        const uuids = []
        this.selectedResource.forEach((item) => {
          const index = this.splitUsers.findIndex((x) => x.id === item)

          this.splitDays.push({
            id: item + 1,
            label: this.splitUsers[index].label,
          })

          if (this.splitUsers[index].resource_uuid !== 0)
            uuids.push(this.splitUsers[index].resource_uuid)
        })

        this.splitDays.sort((a, b) => a.id - b.id)

        this.events = []

        this.$appointmentsApi
          .get('appointments/eventgetbyids', {
            params: {
              ids: uuids,
            },
          })
          .then((res) => {
            if (res.data.length > 0) {
              this.splitUsers.forEach((item, index) => {
                const itemEvents = res.data.filter(
                  (x) => x.appointments_resource_uuid === item.resource_uuid
                )
                if (itemEvents.length > 0) {
                  itemEvents.forEach((x) => {
                    this.events.push({
                      start: x.start_date + ' ' + x.start_time,
                      end: x.end_date + ' ' + x.end_time,
                      title: x.patient_name,
                      notes: x.notes,
                      class: 'test-class',
                      split: 1,
                      appointments_uuid: x.appointments_uuid,
                      appointments_resource_uuid: x.appointments_resource_uuid,
                    })

                    this.events.push({
                      start: x.start_date + ' ' + x.start_time,
                      end: x.end_date + ' ' + x.end_time,
                      title: x.patient_name,
                      notes: x.notes,
                      class: 'test-class',
                      split: index + 1,
                      appointments_uuid: x.appointments_uuid,
                      appointments_resource_uuid: x.appointments_resource_uuid,
                    })
                  })
                }
              })
            }
          })
      }
    },
  },
  async mounted() {
    this.$userApi
      .get(`/list?view=users`)
      .then((res) => {
        if (res?.status === 200 && res.data) {
          this.patientList = res.data.map((x) => {
            return {
              patientName: x.user_first_name + ' ' + x.user_last_name,
              ...x,
            }
          })
        }
      })
      .catch(() => {
        this.$toast.error('loading error')
      })

    // console.log(this.$appointmentsApi)
    const res = await this.$appointmentsApi.get('/appointments/', {
      params: {
        uuid: this.$auth.user.uuid,
      },
    })

    this.splitUsers = [{ id: 0, resource_uuid: 0, label: 'All' }]

    let index = 0
    if (res.data.length > 0) {
      res.data.forEach((item) => {
        index++
        this.splitUsers.push({
          id: index,
          resource_uuid: item.resource_uuid,
          label: item.name,
        })
      })
    }

    this.splitUsers.forEach((item, index) => {
      if (item.label !== 'All') {
        this.selectedResource.push(index)
      }
    })
  },
  methods: {
    initData() {
      this.selectedEvent = {}
      this.name = null
      this.$v.$reset()
      this.notes = null
      this.startDate = this.initDate()
      this.startTime = '07:00'
      this.endDate = this.initDate()
      this.endTime = '07:00'
      this.checkDisabled = false
      this.checkEventUpdate = false
    },
    initDate() {
      return new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
        .toISOString()
        .substr(0, 10)
    },
    formatDate(date) {
      if (!date) return null

      const [year, month, day] = date.split('-')
      return `${month}/${day}/${year}`
    },
    formatTime(time) {
      const hour =
        time.getHours() < 10 ? '0' + time.getHours() : time.getHours()
      const min =
        time.getMinutes() < 10 ? '0' + time.getMinutes() : time.getMinutes()
      return hour + ':' + min
    },
    parseDate(date) {
      if (!date) return null

      const [month, day, year] = date.split('/')
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
    },
    onEventCreate(event) {
      if (this.splitDays.length === 0 || event.split === 1) return

      this.startDate = this.endDate = new Date(
        event.date.getTime() - new Date().getTimezoneOffset() * 60000
      )
        .toISOString()
        .substr(0, 10)

      const hour = new Date(
        event.date.getTime() - new Date().getTimezoneOffset() * 60000
      )
        .toISOString()
        .substr(11, 2)
      const min = new Date(
        event.date.getTime() - new Date().getTimezoneOffset() * 60000
      )
        .toISOString()
        .substr(14, 2)

      this.startTime = this.endTime =
        hour +
        ':' +
        (Math.floor(min / 15) * 15 === 0 ? '00' : Math.floor(min / 15) * 15)

      this.selectedEvent = event
      this.showEventCreationDialog = true
      this.checkEventUpdate = false

      return event
    },
    async closeCreationDialog() {
      this.$v.$touch()
      if (!this.name) return

      if (
        this.startDate > this.endDate ||
        this.startTime > this.endTime ||
        this.startTime === this.endTime
      ) {
        alert('Information incorrect!')
      } else {
        this.showEventCreationDialog = false

        const resourceUuid = this.splitUsers.find(
          (item) => item.id === this.selectedEvent.split - 1
        ).resource_uuid

        const res = await this.$appointmentsApi.post('appointments', {
          resource_uuid: resourceUuid,
          patient_name: this.name,
          start_date: this.startDate,
          start_time: this.startTime,
          end_date: this.endDate,
          end_time: this.endTime,
          notes: this.notes,
        })

        this.events.push({
          resource_uuid: resourceUuid,
          start: this.startDate + ' ' + this.startTime,
          end: this.endDate + ' ' + this.endTime,
          title: this.name,
          notes: this.notes,
          class: 'test-class',
          split: 1,
          appointments_uuid: res.data.appointments_uuid,
          appointments_resource_uuid: res.data.appointments_resource_uuid,
        })

        this.events.push({
          resource_uuid: resourceUuid,
          start: this.startDate + ' ' + this.startTime,
          end: this.endDate + ' ' + this.endTime,
          title: this.name,
          notes: this.notes,
          class: 'test-class',
          split: this.selectedEvent.split,
          appointments_uuid: res.data.appointments_uuid,
          appointments_resource_uuid: res.data.appointments_resource_uuid,
        })
        this.initData()
      }
    },
    async closeUpdateDialog() {
      this.$v.$touch()
      if (!this.name) return

      if (
        this.startDate > this.endDate ||
        this.startTime > this.endTime ||
        this.startTime === this.endTime
      ) {
        alert('Information incorrect!')
      } else {
        this.showEventCreationDialog = false

        await this.$appointmentsApi.put(
          'appointments/' + this.selectedEvent.appointments_uuid,
          {
            patient_name: this.name,
            start_date: this.startDate,
            start_time: this.startTime,
            end_date: this.endDate,
            end_time: this.endTime,
            notes: this.notes,
          }
        )

        const _this = this

        this.events.map((item) => {
          if (
            item.appointments_uuid === _this.selectedEvent.appointments_uuid
          ) {
            item.start = _this.startDate + ' ' + _this.startTime
            item.end = _this.endDate + ' ' + _this.endTime
            item.title = _this.name
            item.content = _this.notes
          }

          return item
        })
        this.initData()
      }
    },
    cancelEventCreation() {
      this.showEventCreationDialog = false
      this.initData()
    },
    onEventClick(event, e) {
      this.checkEventUpdate = true
      if (event.split === 1) this.checkDisabled = true
      this.selectedEvent = event
      this.showEventCreationDialog = true
      this.name = this.selectedEvent.title
      this.notes = this.selectedEvent.notes
      this.startDate = new Date(
        this.selectedEvent.start - new Date().getTimezoneOffset() * 60000
      )
        .toISOString()
        .substr(0, 10)
      this.startTime = this.formatTime(this.selectedEvent.start)
      this.endDate = new Date(
        this.selectedEvent.end - new Date().getTimezoneOffset() * 60000
      )
        .toISOString()
        .substr(0, 10)
      this.endTime = this.formatTime(this.selectedEvent.end)
      e.stopPropagation()
    },
    showResourceField() {
      this.showNewResource = true
    },
    hideResourceField() {
      this.showNewResource = false
      this.resource = ''
      this.$v.$reset()
    },
    addResource() {
      if (!this.resource) return
      this.$appointmentsApi
        .post('appointments/addresource', {
          resource_uuid: this.$auth.user.uuid,
          resourcename: this.resource,
        })
        .then((res) => {
          this.splitUsers.push({
            id: this.splitUsers.length + 1,
            resource_uuid: res.data.resource_uuid,
            label: res.data.name,
          })
          this.selectedResource.push(this.selectedResource.length + 1)
          this.hideResourceField()
        })
    },
    deleteResource(uuid) {
      if (confirm('Do you want to delete resource?')) {
        this.$appointmentsApi
          .delete('appointments/deleteresource/' + uuid)
          .then(() => {
            this.splitUsers = this.splitUsers.filter(
              (x) => x.resource_uuid !== uuid
            )

            this.splitUsers = this.splitUsers.map((item, index) => {
              return {
                id: index,
                resource_uuid: item.resource_uuid,
                label: item.label,
              }
            })

            this.selectedResource = []

            this.splitUsers.forEach((item, index) => {
              this.selectedResource.push(index)
            })
          })
      }
    },

    addPatient() {
      this.$router.push(
        this.localePath('/add-user?redirect=calendar-appointments')
      )
    },
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.calendar-appointments {
  padding: 10px;
}

.calendar-appointments .calendar-left {
  flex: 1;
  margin-right: 20px;
}
.calendar-appointments .calendar-right {
  flex: 0 0 270px;
}
.calendar-appointments .calendar-right .vuecal {
  height: 290px;
}
.subheader {
  font-size: 1rem !important;
  padding: 0 16px !important;
}
.vuecal__no-event {
  display: none;
}
.vuecal__cell-split {
  border-left: 1px solid hsla(0, 0%, 76.9%, 0.25);
  background-color: rgba(255, 250, 196, 0.5);
}
.vuecal__event {
  background-color: rgb(255, 255, 255);
  border: 1px solid;
  cursor: pointer;
  user-select: none;
}
</style>
