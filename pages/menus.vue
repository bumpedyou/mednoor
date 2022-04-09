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
              text: $t('sub_menu'),
              disabled: true
            }
          ]"
        ></v-breadcrumbs>
      </v-col>
    </v-row>
    <v-row>
      <v-col md="2">
      <v-form ref="form"  v-model="validForm" class="mt-6" @submit.prevent='saveSubMenuItem'>
        <v-text-field v-model="name" label="Name" :rules="[v => !!v || $t('v.field_req')]" placeholder="menu item name"></v-text-field>
        <!-- <v-text-field v-model="url" label="Url" :rules="[v => !!v || $t('v.field_req'),v => /^[a-zA-Z0-9 ]*$/.test(v) || 'Olny alphabets and number are allowed']" placeholder="Sub menu item url end point" ></v-text-field> -->
        <v-select
          :items="['main_menu','sub_menu','footer_quick_menu','footer_support_menu','footer_info_menu']"
          label="Menu"
          v-model="type"
          :rules="[v => !!v || $t('v.field_req')]"
        ></v-select>
        <v-btn color="primary" dark block tile small type="submit">
          {{$t('save')}}
        </v-btn>
      </v-form>
      </v-col>
    </v-row>
    <v-row>
      <v-data-table  class="mt-3" :items="menus" :headers="[
          {
            text: 'Name',
            value: 'name',
            sortable: false,
          },
          {
            text: 'Url end point',
            value: 'url_end_point',
            sortable: false,
          },
          {
            text: 'Status',
            value: 'status',
            sortable: false,
          },
          {
            text: 'Type',
            value: 'type',
            sortable: false,
          },
          {
            text: 'Actions',
            value: 'page_actions',
            sortable: false,
          }
        ]">
          <template  #[`item.page_actions`] = "{item}">
            <span class='green--text clickable' @click='updateStatus(item.mid_id)'>{{item.status =='active' ? "Make it inactive":"Make it active"}}</span>
            <MedDivider></MedDivider>
            <span class='red--text clickable' @click='deleteItem(item.mid_id)'>{{ $t('delete') }}</span>
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
    url:'',
    type:'sub_menu',
    validForm:false,
    menus:[]
  }),
  mounted(){
    this.getSubMenuItem();
  },
  methods: {
    saveSubMenuItem(){
      if(this.validForm){
      this.$api
        .post('/submenu',{name:this.name,url:this.url,type:this.type})
        .then(({ data }) => {
          this.menus = [];
          this.name = '';
          this.url = '';
          this.type = 'sub_menu';
          this.getSubMenuItem();
          this.$toast.success(data.result.message);
        })
        .catch((err) => {
          console.log(err);
           this.$toast.error("Url already exists with same menu");
        })
      }else{
        this.$toast.error("All fields are required");
      }
    },
    deleteItem(id){
      this.$api
        .delete('/submenu/' + id)
        .then(({ data }) => {
           this.$toast.success(data.result.message);
           this.menus = [];
           this.getSubMenuItem();
        })
        .catch((err) => {
          console.log(err);
        })
    },
    updateStatus(id){
      this.$api
        .get('/submenu/update-status/' + id)
        .then(({ data }) => {
           this.$toast.success(data.result.message);
           this.menus = [];
           this.getSubMenuItem();
        })
        .catch((err) => {
          console.log(err);
        })
    },
    getSubMenuItem(){
      this.$api
        .get('/submenu')
        .then(({ data }) => {
          this.menus = data;
        })
        .catch((err) => {
          console.log(err);
        })
    }
  }
}
</script>