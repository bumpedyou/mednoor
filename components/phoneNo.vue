/** بسم الله الرحمن الرحيم */
<!-- بسم الله الرحمن الرحيم-->
<template>
    <div v-if="loading">
      <v-skeleton-loader type="card"></v-skeleton-loader>
    </div>
    <div v-else  >
        <v-row>
                  <v-col sm="4" md="4" >
                    <v-autocomplete 
                      v-model="selectedCountry"
                      :hint="`${selectedCountry.name} ${' '} ${selectedCountry.code}`"
                      :items="countries_list"
                      :filter="filter"
                      item-value="name"
                      item-text="name"
                      :label="$t('country_code')"
                      persistent-hint
                      auto-select-first
                      return-object
                    :rules="[v => !!v || $t('v.country_code'), v => !!v &&v.name && v.name.length >=4 || $t('v.country_code')]"
                      @change="handleSelectCountry"
                      @input="handleSelectCountry"
                      >
                      <template #[`item`] = "{item}">
                       <v-row   ma-0 pa-0 fill-height  >
                        <v-col  cols="2" ><div>
                              <v-avatar tile>
                                {{item.phone}}
                              </v-avatar>
                            </div></v-col>
                          <v-col cols="10"><div>
                            <v-avatar tile width="200">{{item.name}}</v-avatar>
                          </div></v-col>  
                       </v-row>
                      </template>
                      <template slot="selection"   >
                        <v-avatar  tile size="25%" >
                          <v-img v-if="selectedCountry.alpha2" :src="`https://flagcdn.com/${selectedCountry.alpha2.toLowerCase()}.svg`" max-height="20" max-width="30"  ></v-img>
                        </v-avatar>
                        <v-avatar  tile size="75%">{{selectedCountry.phone}}</v-avatar>   
                      </template>
                    </v-autocomplete>
                    </v-col>
                    <v-col sm="8" md="8" >
                    <v-text-field v-model="number"  :value="number" :placeholder="$t('phone_no')" :label="$t('phone_no')" maxlength="10" :hint="`${selectedCountry.phone}${' '}${number}`"
                  :rules="[v => !!v || $t('v.phone_req'), v => !!v && v.length >=10 || $t('v.min_10')]" 
                  persistent-hint	
                  @keypress="handlePhone"
                  ></v-text-field> 
                  </v-col>
          </v-row>
      <RequestModal ref="rmodal"></RequestModal>
    </div>
  </template>
  
  <script>
  import RequestModal from "~/components/RequestModal";
import phoneNoMixin from "~/mixins/phoneNoMixin";

  export default {
    name: "PhoneNo",
    components: {
      RequestModal
    },
    mixins: [phoneNoMixin],
    props:{cc:{type:String,required:true,default:''},
            uc:{type:String,required:true,default:''},
            pn:{type:String,default:null}
          },
    data (){
      return {
        loading: false,
        countries_list:[],
      }
    },
    mounted(){
      this.load()
    },
    methods: {
       load(){
        let dList
        this.$globalApi.get('/country').then(({data})=>{
          if (data && data.length){
           dList= data.filter(c=>{
            return c.name.length>2 && c.phone.length
            })
            .map(c=>{
              return { 
                  id:c.id, code: c.code?c.code:"N/A",name: c.name,
                  alpha2: c.alpha2?c.alpha2:c.code?c.code.substr(0,2):c.name.substr(0,2),
                  phone: c.phone?c.phone.startsWith("+")?c.phone: `+${c.phone}`:"+00"
                }
             })
          }
        })
        .finally(()=>{
          const cCode= this.cc||'+1'
          const cName= this.uc ?this.uc:cCode==='+1'?'United States of America':''
          let filter =dList.filter(c=>{return c.phone===cCode })
            filter=cName?filter.filter(c=>{return c.name===cName})[0]:filter[0]
            this.countries_list=dList
            this.selectedCountry=filter
            this.number=null
            if(this.pn){this.number=this.pn}
        })
        
      },
     handleSelectCountry(){
      const selectedCountry= this.selectedCountry
      if (selectedCountry===null || selectedCountry==="" || !selectedCountry.id){
        this.selectedCountry={ id:"",code: "",name: "",alpha2: "",phone: "",capital: ""}
      }
     },
     filter(item,queryText,_){
      return (item.name.toLowerCase().includes(queryText.toLowerCase())|| item.phone.includes(queryText))
     },
     handlePhone(e){
        if ( !e )e = window.event 
      const val = e.target.value.toString() + e.key.toString();
      return  !/^[-+]?[0-9]*\.?[0-9]*$/.test(val)? e.preventDefault():true 
      },
    
    }
  }
  </script>