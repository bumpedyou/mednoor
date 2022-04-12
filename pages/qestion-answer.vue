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
              text: 'Question Answer',
              disabled: true
            }
          ]"
        ></v-breadcrumbs>
      </v-col>
    </v-row>
    <v-row>
      <v-col md="8">
      <v-form ref="form"  v-model="validForm" class="mt-6" @submit.prevent='saveQuestionAnswer'>
        <v-select v-model="news_category" 
              :rules="[ v => !!v || $t('v.field_req')]"
              :items="news_categories" label="News Category">
            </v-select>
        <v-text-field v-model="question" label="Sub heading" :rules="[v => !!v || $t('v.field_req')]" placeholder="Sub heading"></v-text-field>
        <!-- <v-text-field v-model="answer" label="Answer" :rules="[v => !!v || $t('v.field_req')]" placeholder="Answer" ></v-text-field> -->
          <div>
            <client-only>
              <VueEditor v-model='answer' :rules="[ v => !!v || $t('v.field_req')]" />
            </client-only>
          </div>
        <v-btn color="primary" dark block tile small type="submit">
          {{$t('save')}}
        </v-btn>
      </v-form>
      </v-col>
    </v-row>
    <v-row>
      <v-data-table  class="mt-3" :items="question_answers" :headers="[
          {
            text: 'Sub heading',
            value: 'question',
            sortable: false,
          },
          {
            text: 'Status',
            value: 'status',
            sortable: false,
          },
          {
            text: 'News Category Id',
            value: 'news_category_id',
            sortable: false,
          },
          {
            text: 'Actions',
            value: 'page_actions',
            sortable: false,
          }
        ]">
          <template  #[`item.page_actions`] = "{item}">
            <span class='green--text clickable' @click='updateStatus(item.id)'>{{item.status =='active' ? "Make it inactive":"Make it active"}}</span>
            <MedDivider></MedDivider>
            <span class='red--text clickable' @click='deleteItem(item.id)'>{{ $t('delete') }}</span>
          </template>
        </v-data-table>
    </v-row>
  </div>
</template>
<script>
export default {
  name:"questionanswer",
  layout: 'dashboard',
  data: () => ({
    question:'',
    answer:'',
    news_category:'',
    validForm:false,
    question_answers:[],
    news_categories:[]
  }),
  mounted(){
    this.getNewsCategories();
    this.getQuestionAnswers();
  },
  methods: {
    saveQuestionAnswer(){
      if(this.validForm && this.answer){
      this.$api
        .post('/question-answer',{question:this.question,answer:this.answer,news_category:this.news_category})
        .then(({ data }) => {
          this.question_answers = [];
          this.question ='';
          this.answer = '';
          this.news_category = '';
          this.getQuestionAnswers();
          this.$toast.success(data.result.message);
        })
        .catch((err) => {
          console.log(err);
           this.$toast.error("Already exists");
        })
      }else{
        this.$toast.error("All fields are required");
      }
    },
    deleteItem(id){
      this.$api
        .delete('/question-answer/' + id)
        .then(({ data }) => {
           this.$toast.success(data.result.message);
           this.question_answers = [];
           this.getQuestionAnswers();
        })
        .catch((err) => {
          console.log(err);
        })
    },
    updateStatus(id){
      this.$api
        .get('/question-answer/update-status/' + id)
        .then(({ data }) => {
           this.$toast.success(data.result.message);
           this.question_answers = [];
           this.getQuestionAnswers();
        })
        .catch((err) => {
          console.log(err);
        })
    },
    getNewsCategories(){
      this.$api
        .get('/news-categories')
        .then(({ data }) => {
          if(data){
            this.news_categories  = data.map(item => { return  item.name });
          }
        })
        .catch((err) => {
          console.log(err);
        })
    },
    getQuestionAnswers(){
      this.$api
        .get('/question-answer')
        .then(({ data }) => {
          this.question_answers = data;
        })
        .catch((err) => {
          console.log(err);
        })
    }
  }
}
</script>