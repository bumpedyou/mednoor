<template>
  <div class="pa-1 mh-100v">
    <a-row class='mb-1'>
      <a-col>
        <a-breadcrumb>
          <a-breadcrumb-item>
            <nuxt-link :to="localePath('/dashboard')">{{ $t('dashboard') }}</nuxt-link>
          </a-breadcrumb-item>
          <a-breadcrumb-item>Specialties</a-breadcrumb-item>
        </a-breadcrumb>
      </a-col>
    </a-row>
    <a-row>
      <a-col>
        <h1>
          Specialties
        </h1>
      </a-col>
    </a-row>
    <a-row class="mb-1">
      <a-form>
        <a-col :md="12">
          <a-form-item label="Specialty">
            <a-input placeholder="Specialty"></a-input>
          </a-form-item>
        </a-col>
        <a-col :md="12">
          <a-form-item label="Category">
            <a-auto-complete placeholder="Category Name" :data-source="filteredCategories" :filter-option="true"></a-auto-complete>
          </a-form-item>
        </a-col>
      </a-form>
    </a-row>
    <a-row>
      <a-col>
        <a-button type="raisin-black">
          Add Specialty
        </a-button>
      </a-col>
    </a-row>
    <a-row v-if="loading">
      <a-skeleton></a-skeleton>
    </a-row>
    <a-row v-else>
      <a-table :columns="columns" :data-source="data"></a-table>
    </a-row>
  </div>
</template>

<script>
export default {
  name: "Specialties",
  data () {
    return {
      columns: [
        {
          title: 'Category',
          dataIndex: 'cate_category',
          key: 'cate_category',
          scopedSlots: { customRender: 'cate_category' }
        },
        {
          title: 'Specialty',
          dataIndex: 'spec_specialty',
          key: 'spec_specialty',
          scopedSlots: { customRender: 'spec_specialty' }
        },
      ],
      data: [],
      loading: true,
      categories: [],
      filteredCategories: [],
    }
  },
  mounted(){
    this.$api.get('/category').then(({data})=>{
      console.log('[specialties.vue] Categories --->', data)
      this.categories = data.map((it)=>{
        return {
          value: it.cate_id.toString(),
          text: it.cate_category
        }
      })
      this.filteredCategories = [...this.categories]

    }).catch(()=>{
      this.$toast.error('Unable to fetch the categories list.')
    })
    this.$api.get('/specialty').then(({data})=>{
      this.data = data
    }).catch(()=>{
      this.$toast.error('Unable to fetch data')
    }).finally(()=>{
      this.loading = false
    })
  },
  methods: {
    filterCategories(val, option){
      console.log('Filter --->', val,'Option --->', option)

      const c = this.categories.filter((it)=>{
        const t = it.text.toLowerCase()
        const v = val.toLowerCase()
        return t.includes(v)
      })
      console.log('New filtered --->', c)
      return true
    },
  },
}
</script>

<style scoped lang="sass">
</style>
