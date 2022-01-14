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
            text: $t('update_tc'),
            disabled: true,
          }
        ]"></v-breadcrumbs>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <p class='h4 mb-1'>
          {{ $t('update_tc') }}
        </p>
        <v-skeleton-loader v-if='loading' />
        <div v-else>
          <client-only>
            <client-only>
              <VueEditor v-model='txt' placeholder='Left side text.' />
            </client-only>
          </client-only>
          <v-btn small tile class='mt-3' color='primary' :loading="loadingBtn" @click='update'>
            {{ $t('update_tc') }}
          </v-btn>
        </div>
      </v-col>
    </v-row>
  </div>
</template>
<script>
import vmodelMixin from '~/mixins/vmodelMixin'

export default {
  components: {
  },
  mixins: [vmodelMixin],
  layout: 'dashboard',
  data() {
    return {
      loadingBtn: false,
      txt: '',
      loading: true
    }
  },
  head(){
    return {
      title: this.$t('update_tc')
    }
  },
  mounted() {
    this.$api.get('/content/terms-conditions').then(({ data }) => {
      this.loading = false
      this.$nextTick(() => {
        if (data && data.teco_text) {
         this.txt = data.teco_text
        }
      })

    }).finally(() => {
      setTimeout(() => {
        this.loading = false
      }, 600)
    })
  },
  methods: {
    update() {
      this.loadingBtn = true
      this.$api.put('/content/terms-conditions', {
        txt: this.txt
      }).then(() => {
        this.$toast.success(this.$t('cont_hb_up').toString())
      }).catch(() => {
        this.$toast.error(this.$t('thw_tyl').toString())
      }).finally(() => {
        this.loadingBtn = false
      })
    }
  }
}
</script>
