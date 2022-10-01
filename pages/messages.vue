/** بسم الله الرحمن الرحيم */
<template>
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
              disabled: true
            }
          ]"
        ></v-breadcrumbs>
      </v-col>
    </v-row>
    <v-row align="center"
    justify="space-around">
    <v-col md="3">
      <v-btn icon color="blue" @click="getMessages()">
        <v-icon>mdi-cached</v-icon>
        Refresh
      </v-btn>
    </v-col>
    <v-col md="3">
      <v-btn icon color="red" @click="getUnread()">
        <v-icon>mdi-email-outline</v-icon>
        New
      </v-btn>
    </v-col>
    <v-col md="3">
      <v-btn icon color="green" @click="getRead()">
        <v-icon>mdi-email-open-outline</v-icon>
        Read
      </v-btn>
    </v-col>  
    </v-row>
    <v-row>
      <v-data-table  class="mt-3" :items="messages" :headers="[
         {
            text: 'State',
            value: 'unread',
            sortable: true,
          },
         {
            text: 'Date',
            value: 'sent_date',
            sortable: true,
          },
          {
            text: 'From',
            value: 'sender_name',
            sortable: false,
          },
          
          {
            text: 'Email',
            value: 'sender_email',
            sortable: false,
          }
         

        ]"
         item-key="message_id"
          >
        
        <template #[`item.unread`] = "{item}">
        <v-btn :color="getStateColor(item.unread)"
        dark
         @click="$router.push(localePath({name:'view-message',query:{id:item.message_id}}))">
        <v-icon >
        {{getStateIcon(item.unread)}}
        </v-icon>  Read
      </v-btn>
        </template>
        </v-data-table>
    </v-row>
  </div>
</template>
<script>
export default {
  name:"FeedbackMessages",
  layout: 'dashboard',
  data: () => ({
   messages:[{
    sender_email:'',
    message_content: '',
    message_id:'',
    message_subject:'',
    sender_name:'',
    sent_date:'',
    unread:''
   }]  
  }),
  mounted(){
    this.getMessages();
  },
  methods: {
    getMessages(){
      this.$feedBackApi
        .get('/messages')
        .then(({ data }) => {
          this.messages = this.messagesData(data)
        })
        .catch((err) => {
          console.log(err);
        })
    }
    ,getStateColor(unread){
      return Number(unread) ?'red darken-2':'green darken-2'
    },getStateIcon(unread){
      return Number(unread)? ' mdi-email-outline':'mdi-email-open-outline'
    },
    getUnread(){
      this.$feedBackApi
        .get('/messages/unread')
        .then(({ data }) => {
          this.messages = this.messagesData(data)
        })
        .catch((err) => {
          console.log(err);
        })
    },
    getRead(){
      this.$feedBackApi
      .get('/messages/readed')
        .then(({ data }) => {
          this.messages = this.messagesData(data)
        })
        .catch((err) => {
          console.log(err);
        })
    },
    adjustDate(date){
      let newDate = new Date(date)
      newDate =  newDate.toLocaleString()
      if (newDate.split(",")[0] === new Date().toLocaleDateString().split(",")[0]){
        return newDate.split(",")[1]
      }
      return newDate.split(",")[0]
    },messagesData (data) {
      return data.map((row)=>{
            return {...row,sent_date:this.adjustDate(row.sent_date)}
          }).sort( (a,b)=>{
            return new Date(b.sent_date) - new Date(a.sent_date)
          });
    }
  }
}
</script>