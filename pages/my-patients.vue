<template>
  <div class='pa-6 mh-100v'>
    <v-row>
      <v-col md="12">
        <p class='h4 mb-1'>
          {{ $t('My EMR') }}
        </p>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-data-table :items="items" :headers="[
          {
            text: 'MRN',
            value: 'mrn',
          },
          {
            text: 'Patient\'s name',
            value: 'full_name',
          },
          {
            text: 'Actions',
            value: 'actions'
          }
        ]">
          <template #[`item.full_name`] = "{item}">
            <nuxt-link :to="localePath('/user-profile/' + item.user_uuid)">
              {{item.full_name}}
            </nuxt-link>
          </template>
          <template #[`item.actions`]="{item}" >
            <nuxt-link v-if="item.mere_uuid" :to="{path: localePath('/new-emr'), query: {mere: item.mere_uuid}}">{{ $t('emr') }}</nuxt-link>
            <span v-else class="text-muted">
              No record found.
            </span>

            <span class="ml-5">
                <nuxt-link v-if="item.mere_uuid" :to="localePath('/user-profile/' + item.user_uuid)">      <v-icon>   mdi-eye</v-icon></nuxt-link>
            </span>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </div>
</template>
<script>
export default {
  name: 'MyPatients',
  layout: 'default',
  middleware: ['authenticated', 'pin-set', 'view-set', 'verified'],
  data() {
    return {
      columns: [
        {
          title: this.$t('patients_name'),
          dataIndex: 'full_name',
          key: 'full_name',
          slots: { title: this.$t('patients_name') },
          scopedSlots: { customRender: 'full_name' }
        },
        {
          title: this.$t('actions'),
          dataIndex: 'actions',
          key: 'actions',
          slots: { title: this.$t('actions') },
          scopedSlots: { customRender: 'actions' }
        }
      ],
      items: [],
      loading: true,
      ids: [],
    }
  },
  head(){
    return {
      title: this.$t('my_patients')
    }
  },
  mounted() {

    this.$api.get('/medical-record/patients').then(({ data }) => {
      this.items = data
      data.forEach((user)=>{
        this.ids.push(user.user_uuid)
      })
    }).catch(() => {
      this.$toast.error(this.$t('could_nl_p').toString())
    })
    this.$userApi.get('/list', {
      params: {
        view: 'users'
      }
    }).then(({data})=>{
      data.forEach((user)=>{
        if (!this.ids.includes(user.user_uuid)){
          this.items.push({
            full_name: user.user_first_name + ' ' + user.user_last_name,
            user_uuid: user.user_uuid,
            mrn: user.mrn,
          })
          this.ids.push(user.user_uuid)
        }
      })
    })
  }
}
</script>
