<template>
  <div id="top" class="pa-6 mh-100v">
    <v-row class='mb-1'>
      <v-col>
        <v-breadcrumbs :items="[
          {
            text: $t('dashboard'),
            to: localePath('/dashboard'),
            disabled: false,
          },
          {
            text: 'Specialties',
            disabled: true,
          }
        ]"></v-breadcrumbs>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <h1>
          Specialties
        </h1>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-form ref="form" v-model="valid" @submit.prevent="create">
          <v-row>
            <v-col md="6">
              <v-autocomplete v-model="category" :rules="[value => !!value || 'This field is required']" placeholder="Category Name" clearable :items="categories" item-text="cate_category" item-value="cate_id"></v-autocomplete>
            </v-col>
            <v-col md="6">
              <v-text-field v-model="specialty" :rules="[value => !! value || 'This field is required', value => !!value && value.length > 2 || 'Must be at least 2 characters long', value => !!value && value.length <=30 || 'Must not be longer than 30 characters']" placeholder="Specialty"></v-text-field>
            </v-col>
          </v-row>
          <v-row class="mb-1 mt-0">
            <v-col>
              <v-btn :loading="loadingCreate" dark type="submit" small tile>
                <span v-if="id">
                  Update specialty
                </span>
                <span v-else>
                  Create Specialty
                </span>
              </v-btn>
              <v-btn color="error" small tile @click="resetData">
                Cancel
              </v-btn>
            </v-col>
          </v-row>
        </v-form>
      </v-col>
    </v-row>
    <v-row v-if="loading">
      <v-skeleton-loader></v-skeleton-loader>
    </v-row>
    <v-row v-else>
      <v-col md="12">
        <v-data-table :items="data" :headers="[
        {
          text: 'Category',
          value: 'cate_category',
          sortable: false,
        },
        {
          text: 'Specialty',
          value: 'spec_specialty',
          sortable: false,
        },
        {
          text: 'Actions',
          value: 'actions',
          sortable: false,
        }
      ]">
          <template #[`item.actions`] = "{item}">
          <span class='clickable primary--text' @click="setSpecialty(item)">
            Update
          </span>
            <MedDivider></MedDivider>
            <span class="clickable red--text" @click="askDel(item.spec_id)">
            Delete
          </span>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
    <v-row>
      <v-dialog v-model="showDelete" max-width="320px">
        <v-card>
          <v-card-title>
            Do you want to delete this specialty?
          </v-card-title>
          <v-card-text>
            This action can't be undone.
          </v-card-text>
          <v-card-actions>
            <v-btn color="error" small tile :disabled="loadingDelete" @click="deleteId =null">
              Cancel
            </v-btn>
            <v-btn color="primary" small tile :loading="loadingDelete" @click="del">
              Accept
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
  </div>
</template>

<script>
import MedDivider from "~/components/MedDivider";
export default {
  name: "Specialties",
  components: {MedDivider},
  layout: 'dashboard',
  data () {
    return {
      showDelete: false,
      loadingDelete: false,
      id: null,
      specialty: '',
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
        {
          title: 'Actions',
          dataIndex: 'actions',
          key: 'actions',
          scopedSlots: { customRender: 'actions' }
        },
      ],
      data: [],
      loading: true,
      categories: [],
      filteredCategories: [],
      valid: false,
      loadingCreate: false,
      category: null,
      deleteId: null,
    }
  },
  mounted(){
    this.$api.get('/category').then(({data})=>{
      this.categories = data
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
    askDel(id){
      this.deleteId = id
      this.showDelete = true
    },
    del(){
      this.loadingDelete = true
      this.$api.delete('/specialty/' + this.deleteId).then(()=>{
        this.$toast.success('Item has been deleted')
        this.data = this.data.filter(it=>{
          return it.spec_id !== this.deleteId
        })
      }).catch((err)=>{
        this.$toast.error(err)
      }).finally(() => {
        this.deleteId = null
        this.showDelete = false
        this.loadingDelete = false
      })
    },
    getCategory(id){
      let category = {}
      this.categories.forEach((c)=>{
        if (c.cate_id === id){
          category = c
        }
      })
      return category
    },
    resetData(){
      this.id = null
      this.specialty = ''
      this.category = null
      this.$refs.form.reset()
    },
    setSpecialty(data){
      this.id = data.spec_id
      this.specialty = data.spec_specialty
      this.category = data.spec_cate_id
      console.log(process.client)
      if (process.client){
        document.body.scrollTop = 0
      }
    },
    askDelete(id){
      console.log('Delete ' + id + '?')
    },
    create(v){
      this.$refs.form.validate()
      if (this.valid){
        this.loadingCreate= true

        console.log('id? --->', this.id)

        const api = this.id ? this.$api.put : this.$api.post
        const base = '/specialty'
        const route = this.id ? base + '/' + this.id : base

        api(route, {
          category: this.category,
          specialty: this.specialty
        }).then(({data})=>{
          if (this.id){
            this.data = this.data.map((it)=>{
              if (it.spec_id === this.id){
                it.spec_specialty = this.specialty
                const c = this.getCategory(this.category)
                it.cate_id = c.cate_id
                it.cate_category = c.cate_category
              }
              return it
            })
          }else{
            const c = this.getCategory(this.category)
            data.cate_id = c.cate_id
            data.cate_category = c.cate_category
            this.data.push(data)
          }
          this.resetData()
        }).catch((err)=>{
          this.$toast.error(err)
        }).finally(()=>{
          this.loadingCreate = false
        })
      }
    },
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
