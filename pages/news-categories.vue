<template>
  <div class="pa-6 ml-2 mh-100v">
    <v-row>
      <v-col md="12">
        <v-breadcrumbs
          :items="[
            {
              text: 'Dashboard',
              to: localePath('/dashboard'),
              disabled: false
            },
            {
              text: 'News Categories',
              disabled: true
            }
          ]"
        ></v-breadcrumbs>
      </v-col>
    </v-row>
    <v-row>
      <v-col md="2">
      <v-form ref="form"  v-model="validForm" class="mt-6" @submit.prevent='saveNewsCategory'>
        <v-text-field v-model="name" label="Name" :rules="[v => !!v || $t('v.field_req'),v => /^[a-zA-Z0-9 ]*$/.test(v) || 'Olny alphabets and number are allowed']" placeholder="News category name"></v-text-field>
        <v-btn color="primary" dark block tile small type="submit">
          {{$t('save')}}
        </v-btn>
      </v-form>
      </v-col>
    </v-row>
    <v-row>
      <v-data-table  class="mt-3" :items="news_categories" :headers="[
          {
            text: 'Name',
            value: 'name',
            sortable: false,
          },
          {
            text: 'Status',
            value: 'status',
            sortable: false,
          },
          {
            text: 'Actions',
            value: 'page_actions',
            sortable: false,
          }
        ]">
          <template  #[`item.page_actions`] = "{item}">
            <span class='green--text clickable' @click='updateStatus(item.ncid_id)'>{{item.status =='active' ? "Make it inactive":"Make it active"}}</span>
            <MedDivider></MedDivider>
            <span class='red--text clickable' @click='deleteNewsCategory(item.ncid_id)'>{{ $t('delete') }}</span>
          </template>
        </v-data-table>
    </v-row>
  </div>
</template>
<script>
export default {
  name:"submenu",
  layout: 'dashboard',
  data: () => ({
    name:'',
    validForm:false,
    news_categories:[]
  }),
  mounted(){
    this.getNewsCategories();
  },
  methods: {
    saveNewsCategory(){
      if(this.validForm){
      this.$api
        .post('/news-categories',{name:this.name})
        .then(({ data }) => {
          this.news_categories = [];
          this.name = '';
          this.getNewsCategories();
          this.$toast.success(data.result.message);
        })
        .catch((err) => {
          console.log(err);
           this.$toast.error("News Category already exists");
        })
      }else{
        this.$toast.error("All fields are required");
      }
    },
    deleteNewsCategory(id){
      this.$api
        .delete('/news-categories/' + id)
        .then(({ data }) => {
           this.$toast.success(data.result.message);
           this.news_categories = [];
           this.getNewsCategories();
        })
        .catch((err) => {
          console.log(err);
        })
    },
    updateStatus(id){
      this.$api
        .get('/news-categories/update-status/' + id)
        .then(({ data }) => {
           this.$toast.success(data.result.message);
           this.news_categories = [];
           this.getNewsCategories();
        })
        .catch((err) => {
          console.log(err);
        })
    },
    getNewsCategories(){
      this.$api
        .get('/news-categories')
        .then(({ data }) => {
          this.news_categories = data;
        })
        .catch((err) => {
          console.log(err);
        })
    }
  }
}
</script>