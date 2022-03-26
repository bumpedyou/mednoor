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
        <v-text-field v-model="name" label="Name" :rules="[v => !!v || $t('v.field_req')]" placeholder="Sub menu item name"></v-text-field>
        <v-text-field v-model="url" label="Url" :rules="[v => !!v || $t('v.field_req')]" placeholder="Sub menu item url end point" ></v-text-field>
        <v-btn color="primary" dark block tile small type="submit">
          {{$t('save')}}
        </v-btn>
      </v-form>
      </v-col>
    </v-row>
    <v-row>
      <v-data-table  class="mt-3" :items="submenus" :headers="[
          {
            text: 'Name',
            value: 'smid_name',
            sortable: false,
          },
          {
            text: 'Url end point',
            value: 'smid_url_end_point',
            sortable: false,
          },
          {
            text: 'Actions',
            value: 'page_actions',
            sortable: false,
          }
        ]">
          <template  #[`item.page_actions`] = "{item}">
            <!-- <span class='red--text clickable' @click='deleteItem(item.smid_id)'>{{ $t('update') }}</span> -->
            <MedDivider></MedDivider>
            <span class='red--text clickable' @click='deleteItem(item.smid_id)'>{{ $t('delete') }}</span>
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
    validForm:false,
    submenus:[]
  }),
  mounted(){
    this.getSubMenuItem();
  },
  methods: {
    saveSubMenuItem(){
      if(this.validForm){
      this.$api
        .post('/submenu',{name:this.name,url:this.url})
        .then(({ data }) => {
          console.log(data);
        })
        .catch((err) => {
          console.log(err);
        })
      }
    },
    deleteItem(id){
      this.$api
        .delete('/submenu/' + id)
        .then(({ data }) => {
           this.$toast.success('Submenu Item has been deleted successfuly.');
           this.submenus = [];
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
          this.submenus = data;
        })
        .catch((err) => {
          console.log(err);
        })
    }
  }
}
</script>