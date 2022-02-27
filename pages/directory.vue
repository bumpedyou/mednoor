<template>
<div class="directory mh-100v mt-1">
  <div v-show='isFilterOpened' class="filters pa-1">
    <div class='d-flex'>
      <div>
        <p class="h4 mb-1">Filters</p>
      </div>
      <div class='ml-auto'>
        <a-icon type='close' class='clickable red--text' @click='isFilterOpened = false'></a-icon>
      </div>
    </div>
    <hr>
    <p class="filter-name">
      Category
    </p>
    <div v-if="categories">
      <div v-for="(c,i) in categories" :key="i">
        <a-checkbox :ref="'checkbox-' + i" @change='categoryChanged(c)'>
          {{c.cate_category}}
        </a-checkbox>
      </div>
    </div>
    <p v-else class="text">
      No categories were found.
    </p>
    <!--
    <p class="filter-name mt-1">
      Country
    </p>
    <a-auto-complete placeholder="Country Name"></a-auto-complete>
    -->
  </div>
  <div class="content pa-1">
    <a-row>
      <a-col>
        <div class="pull-child-right mb-1">
          <span class='clickable primary--text' @click='isFilterOpened = true'>Filters <a-icon type="filter" /></span>
        </div>
      </a-col>
    </a-row>
    <a-row>
      <a-col>
        <a-form-item>
          <a-input-search v-model="term" size="large" placeholder="Search by Professional Name" enter-button  @search="search">
          </a-input-search>
        </a-form-item>
      </a-col>
    </a-row>
    <a-row>
      <div v-if="loadingResults">
        <a-skeleton></a-skeleton>
      </div>
      <a-col v-else-if="searched">
        <h4>Search Results</h4>
        <hr class="mb-1">
        <div v-if="results.length > 0">
          <div v-for="(r, i) in results" :key="i" class="search-result">
            <p class="name">{{r.full_sname}}</p>
            <div class="info">
              <p v-if="r.category" class="category">
                {{r.category}}
              </p>
              <!--
              <p>
                -
              </p>
              <div class="country">
                Country Name
              </div>
              -->
            </div>
            <div class="mt-1">
              <a-button type="primary" @click="$router.push(localePath('/user/' + r.uuid))">View Profile</a-button>
            </div>
          </div>
        </div>
        <div v-else>
          <p class="h6">No results were found.</p>
        </div>
      </a-col>
      <a-col v-else>
        <a-alert message="You can use the filters to search by category and/or country." type="info" show-icon />
      </a-col>
    </a-row>
  </div>
</div>
</template>

<script>
export default {
  name: "Directory",
  data: ()=>({
    categories: [],
    term: '',
    results: '',
    searched: false,
    loadingResults: false,
    selectedCategories: [],
    isFilterOpened: false,
  }),
  mounted(){
    this.$api.get('/category').then(({data})=>{
      if (data){
        this.categories = data
      }
    })
  },
  methods: {
    categoryChanged(category){
      if (category && category.cate_id){
        const c = category.cate_id
        if (this.selectedCategories.includes(c)){
          this.selectedCategories = this.selectedCategories.filter((cat)=>{
            return cat !== c
          })
        }else{
          this.selectedCategories.push(c)
        }
      }
      this.search()
    },
    search(){
      this.loadingResults = true
      this.$userApi.get('/search', {
        params: {
          searchTerm: this.term,
          type: 'MODERATOR',
          categories: this.selectedCategories
        }
      }).then(({data})=>{
        if (data){
          this.results = data
        }
        this.searched = true
      }).catch((err)=>{
        this.$toast.error(err)
      }).finally(()=>{
        this.loadingResults = false
      })
    }
  }
}
</script>

<style scoped lang="sass">
.directory
  background: #eee
  .filters
    position: fixed
    top: 0
    left: 0
    right: 0
    bottom: 0
    overflow-y: scroll
    z-index: 230
    background-color: #fff
    padding: 2rem
  .content
    width: 100%
    background: #fff

.filter-name
  font-size: 1.2rem
  margin-bottom: 0

.search-result
  margin: 1rem 0
  border: 1px solid #eee
  padding: 1rem
  box-shadow: 3px 6px 9px #ccc
  .name
    font-weight: bold
    color: #000
  .info
    display: flex
    p
      margin-bottom: 0
      margin-right: 1rem


@media screen and (min-width: $md)
  .directory
    display: flex
    padding: 1rem


</style>
