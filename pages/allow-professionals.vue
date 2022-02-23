<template>
  <div>
    <v-row>
      <v-col>
        <h1>{{$t('allo_usrs')}}</h1>
        <p>{{$t('all_des')}}</p>
        <v-data-table :headers="[{
        text: 'Professional',
        value: 'fn1',
        sortable: false,
      },
      {
        text: 'User',
        value: 'user',
        sortable: false,
      },
      {
        text: 'Actions',
        value: 'actions',
        sortable: false,
      }
    ]" :items="items">
          <template #[`item.fn1`] = "{item}">
            {{item.fn1}} {{item.ln1}}
          </template>
          <template #[`item.user`] = "{item}">
            {{item.fn2}} {{item.ln2}}
          </template>
          <template #[`item.actions`] = "{item}">
            <span v-if="item.mypr_allowed">{{$t('all_urs_is')}}</span>
            <a v-else @click='allow(item.mypr_id)'>{{$t('allo_usr')}}</a>
          </template>
        </v-data-table>
      </v-col>
      <RequestModal ref='rmodal'></RequestModal>
    </v-row>
  </div>
</template>

<script>

export default {
  name: "AllowProfessionals",

  middleware: ['authenticated', 'verified'],
  data () {
    return {
      items: [],
    }
  },
  head() {
    return {
      title: this.$t('all_prof'),
    }
  },
  mounted (){
    this.getItems()
  },
  methods: {
    getItems(){
      this.$api.get('/my-professional/all').then(({data})=>{
        this.items = data
      })
    },
    allow (id) {
      this.$api.post('/my-professional/allow/' + id).then(({data})=>{
        this.getItems()
      }).catch((err)=>{
        this.$refs.rmodal.$emit('error', err)
      })
    }
  }
}
</script>
