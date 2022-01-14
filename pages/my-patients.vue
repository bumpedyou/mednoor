<template>
  <div class='pa-6 mh-100v'>
    <v-row>
      <v-col md="12">
        <p class='h4 mb-1'>
          {{ $t('my_patients') }}
        </p>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-data-table :items="items" :headers="[
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
            <nuxt-link :to="localePath('/user/' + item.user_uuid)">
              {{item.full_name}}
            </nuxt-link>
          </template>
          <template #[`item.actions`]="{item}" >
            <nuxt-link :to="{path: localePath('/new-emr'), query: {mere: item.mere_uuid}}">{{ $t('emr') }}</nuxt-link>
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
      loading: true
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
    }).catch(() => {
      this.$toast.error(this.$t('could_nl_p').toString())
    })
  }
}
</script>
