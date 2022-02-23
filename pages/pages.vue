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
            text: $t('pages'),
            disabled: true,
          }
        ]"></v-breadcrumbs>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <p class='h4 mb-1'>{{ $t('Pages') }}</p>
        <v-btn dark small tile @click="$router.push(localePath('/new-page'))">{{ $t('new_page') }}</v-btn>
        <v-skeleton-loader v-if='loading' />
        <v-data-table v-else :items="items" :headers="[
          {
            text: 'Title',
            value: 'page_title',
            sortable: false,
          },
          {
            text: 'Slug',
            value: 'page_slug',
            sortable: false,
          },
          {
            text: 'Keywords',
            value: 'page_keywords',
            sortable: false,
          },
          {
            text: 'Actions',
            value: 'page_actions',
            sortable: false,
          }
        ]">
          <template #[`item.page_actions`] = "{item}">
            <nuxt-link :to="{path: localePath('/new-page'), query: {page: item.page_uuid}}">{{ $t('update') }}</nuxt-link>
            <MedDivider></MedDivider>
            <span class='red--text clickable' @click='deleteItem(item.page_uuid)'>{{ $t('delete') }}</span>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
    <ConfirmDialog v-model="confirm" :loading="loadingDelete" @cancel="confirm = false" @accept="confirmDelete"></ConfirmDialog>

  </div>
</template>
<script>
export default {
  layout: 'dashboard',
  middleware: ['authenticated', 'verified', 'not-blocked', 'not-deleted', 'admin-or-super'],
  data() {
    return {
      deleteId: null,
      loadingDelete: false,
      confirm: false,
      loading: true,
      items: [],
      columns: [
        {
          title: this.$t('title'),
          dataIndex: 'page_title',
          key: 'page_title',
          slots: { title: this.$t('title') },
          scopedSlots: { customRender: 'page_title' }
        },
        {
          title: this.$t('slug'),
          dataIndex: 'page_slug',
          key: 'page_slug',
          slots: { title: this.$t('slug') },
          scopedSlots: { customRender: 'page_slug' }
        },
        {
          title: this.$t('keywords'),
          dataIndex: 'page_keywords',
          key: 'page_keywords',
          slots: { title: this.$t('keywords') },
          scopedSlots: { customRender: 'page_keywords' }
        },
        {
          title: this.$t('actions'),
          dataIndex: 'page_actions',
          key: 'page_actions',
          slots: { title: this.$t('actions') },
          scopedSlots: { customRender: 'page_actions' }
        }
      ]
    }
  },
  head(){
    return {
      title: this.$t('pages')
    }
  },
  mounted() {
    this.$api.get('/page').then(({ data }) => {
      this.items = data
    }).finally(() => {
      this.loading = false
    })
  },
  methods: {
    confirmDelete(){
      this.loadingDelete= true
      this.$api.delete('/page/' + this.deleteId).then(() => {
        this.items = this.items.filter((it) => {
          return it.page_uuid !== this.deleteId
        })
      }).finally(() => {
        this.deleteId = null
        this.loadingDelete = false
        this.confirm = false
      })
    },
    deleteItem(v) {
      this.confirm = true
      this.deleteId = v
    }
  }
}
</script>
