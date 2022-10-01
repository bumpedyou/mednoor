/** بسم الله الرحمن الرحيم */
<template >
  <div class="pa-6 ml-2 mh-100v">
    <v-row><h3> Feedback Messages </h3></v-row>
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
              text: 'Feedback Messages',
              to: localePath('/messages'),
              disabled: false
            },
            {
              text: 'View',
              disabled: true
            }
          ]"
        ></v-breadcrumbs>
      </v-col>
    </v-row>
    <v-row>
      
    </v-row>
    <v-row no-gutters>
      <v-col cols="2" >
        <v-card elevation="2" class=".caption" >From</v-card>
      </v-col>
      <v-col><b>{{message.sender_name}}</b></v-col>
    </v-row>
    <v-row no-gutters>
      <v-col cols="2" >
        <v-card elevation="2" class=".caption" >Email</v-card>
      </v-col>
      <v-col><b>{{message.sender_email}}</b></v-col>
    </v-row>
    <v-row no-gutters>
      <v-col cols="2" >
        <v-card elevation="2" class=".caption" >Date</v-card>
      </v-col>
      <v-col><b>{{message.sent_date}}</b></v-col>
    </v-row>
    <v-row no-gutters>
      <v-col cols="2" >
        <v-card elevation="2" class=".caption" >Subject</v-card>
      </v-col>
      <v-col><b>{{message.message_subject}}</b></v-col>
    </v-row>
    <v-row no-gutters>
      <v-col cols="2" >
        <v-card elevation="2" class=".caption" >Content</v-card>
      </v-col>
      <v-col class=" darken-2 ">
        <p class="text-justify">
          <v-card elevation="2"> 
            <b> {{message.message_content}}</b></v-card>
        </p>
      </v-col>
    </v-row> 
    <v-row align="center"
    justify="space-around">
    <v-col md="3">
      <v-btn icon color="blue" @click="$router.push(localePath('/messages/'))">
        <v-icon>mdi-arrow-left</v-icon>
        back
      </v-btn>
    </v-col>
    <v-col md="3">
      <v-btn icon color="red" @click="deleteMessage(message.message_id,$router,localePath)">
        <v-icon>mdi-delete</v-icon>
        delete
      </v-btn>
    </v-col>
   
    <v-col md="3">  </v-col>
    </v-row>
  </div>
</template>
<script>
export default {
  name:"ViewMessage",
  layout: 'dashboard',
  data: () => ({
   message:{
    sender_email:'',
    message_content: '',
    message_id:'',
    message_subject:'',
    sender_name:'',
    sent_date:'',
    unread:''
   }
  }),
  mounted(){
    this.viewMessage(this.$route.query.id);
  },
  methods: {
 viewMessage(id){
      this.$feedBackApi
        .get(`/messages/${id}`)
        .then(({data}) => {
        this.message={...data,sent_date:this.adjustDate(data.sent_date)}
        })
        .catch((err) => {
          console.log(err);
        })
      
    },
    deleteMessage(id,router,localePath){
      this.$feedBackApi
        .delete(`/messages/${id}`)
        .then(({data}) => {
        if(data==="OK"){
          this.$toast.success('Operation successful')
          router.push(localePath('/messages/'))
        }
        })
        .catch((err) => {
          console.log(err);
        })
      
    },
    adjustDate(date){
      const newDate = new Date(date)
      return newDate.toLocaleString()
    }
  }
}
</script>