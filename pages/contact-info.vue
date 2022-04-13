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
              text: 'Contact Detail',
              disabled: true
            }
          ]"
        ></v-breadcrumbs>
      </v-col>
    </v-row>
    <v-row>
      <v-col md="4">
      <v-form ref="form"  v-model="validForm" class="mt-6" @submit.prevent='saveUpdateContactDetail'>
        <v-text-field v-model="title" label="Title" :rules="[v => !!v || $t('v.field_req')]" placeholder="Title"></v-text-field>
        <v-text-field v-model="description" label="Description" :rules="[v => !!v || $t('v.field_req')]" placeholder="Description"></v-text-field>
        <v-text-field v-model="address" label="Address" :rules="[v => !!v || $t('v.field_req')]" placeholder="Address"></v-text-field>
        <v-text-field v-model="working_hours" label="Working hours" :rules="[v => !!v || $t('v.field_req')]" placeholder="Working hours"></v-text-field>
        <v-btn color="primary" dark block tile small type="submit">
          Save/Update
        </v-btn>
      </v-form>
      </v-col>
    </v-row>
  </div>
</template>
<script>
export default {
  name:"contactInfo",
  layout: 'dashboard',
  data: () => ({
    title:'',
    description:'',
    address:'',
    working_hours:'',
    validForm:false,
  }),
  mounted(){
    this.getContactDetail();
  },
  methods: {
    saveUpdateContactDetail(){
      if(this.validForm){
      this.$api
        .post('/contactinfo',{'title':this.title,'description':this.description,'address':this.address,'working_hours':this.working_hours})
        .then(({ data }) => {
          this.getContactDetail();
          this.$toast.success(data.result.message);
        })
        .catch((err) => {
          console.log(err);
           this.$toast.error(err);
        })
      }else{
        this.$toast.error("All fields are required");
      }
    },
    
   
    getContactDetail(){
      this.$api
        .get('/contactinfo')
        .then(({ data }) => {
          if(data && data[0]){
          this.title = data[0].title;
          this.description = data[0].description;
          this.address = data[0].address;
          this.working_hours = data[0].working_hours;
          }
          
        })
        .catch((err) => {
          console.log(err);
        })
    }
  }
}
</script>