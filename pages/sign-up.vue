<template>
  <div class="mt-9">
    <!-- line #1 -->
    <!-- Email -->
      <v-row>
        <v-col md="12" >
        <v-card class="mt-6 sign-up"  elevation="22" outlined :loading="loading">
          <v-card-text>
          <h1 class="h4 mt-5 text-center mb-6 ">{{'Register Here, We Take Care'}}</h1>
            <v-form ref="form" v-model="validForm" @submit.prevent="handleSubmit">
              <v-row class="mb-0 mb-0 pb-0">
                <v-col md="12" class="my-0 py-0">
                  <v-text-field v-model="email" type="search" :autocomplete="false" label="Email" :rules="[v => !!v || $t('v.email_req'), v => !!v && v.length <= 150 || $t('v.max_email_150')]" prepend-inner-icon="mdi-email"></v-text-field>
                </v-col>
              </v-row>
              <v-row class="my-0 py-0">
                <!-- First Name -->
                <v-col xs="12" md="4" class="my-0 py-0">
                  <v-text-field v-model="first_name" :placeholder="$t('fn')" :label="$t('fn')" :rules="[v => !!v ||  $t('v.fn_req'), v => !!v && v.length > 2 || $t('v.min_3', v => !!v && v.length <= 30 || $t('v.max_30'))]"></v-text-field>
                </v-col>
                <!-- EO First Name-->
                <v-col xs="12" md="4" class="my-0 py-0">
                  <v-text-field v-model="middle_name" :placeholder="$t('mn')" :label="$t('mn')"></v-text-field>
                </v-col>
                <v-col xs="12" md="4" class="my-0 py-0">
                  <v-text-field v-model="last_name" :placeholder="$t('ln')" :label="$t('ln')" :rules="[v => !!v ||  $t('v.fn_req'), v => !!v && v.length > 2 || $t('v.min_3', v => !!v && v.length <= 30 || $t('v.max_30'))]"></v-text-field>
                </v-col>
              </v-row>
              <v-row class="my-0 py-0">
              
              <v-col sm="3" md="3"> 
                <v-select
                      v-model="selected_country"
                      :hint="`${selected_country.name} ${' '} ${selected_country.code}`"
                      :items="countries_list"
                      :item-value="`${selected_country.phone}`"
                      item-text="name"
                      :label="$t('country_code')"
                      persistent-hint 
                      return-object
                      @change="handleSelectCountry"
                      >
                      <template #[`item`] = "{item}">
                       <v-row   ma-0 pa-0 fill-height  >
                          <v-col  cols="2" >
                            <div>
                              <v-avatar tile>{{item.phone}}</v-avatar>
                            </div>
                          </v-col>
                          <v-col cols="7">
                            <div>
                              <v-avatar tile width="200">{{item.name}}</v-avatar>
                            </div>
                          </v-col>
                          <v-col cols="2">
                            <v-avatar tile>
                              <v-img :src="`https://flagcdn.com/${item.alpha2.toLowerCase()}.svg`" max-height="20" max-width="30"  ></v-img>
                            </v-avatar>
                          </v-col>                       
                       </v-row>
                      </template>
                      <template slot="selection"   >
                        <v-avatar  tile size="25%" >
                          <v-img :src="`https://flagcdn.com/w20/${selected_country.alpha2.toLowerCase()}.png`"  ></v-img>
                        </v-avatar>
                        <v-avatar  tile size="75%">{{selected_country.phone}}</v-avatar>   
                      </template>
                      </v-select>
                </v-col>

                <v-col sm="5" md="5">
                  <v-text-field v-model="phone_no"  :value="phone_no" :placeholder="$t('phone_no')" :label="$t('phone_no')" maxlength="10" :hint="`${selected_country.phone}${' '}${phone_no}`"
                  :rules="[v => !!v || $t('v.phone_req'), v => !!v && v.length >=10 || $t('v.min_10')]" 
                  persistent-hint	
                  @keypress="handlePhone"
                  ></v-text-field> 
                  </v-col>
                  <v-col sm="4" md="4">
                      <v-select
                      v-model="selected_state"
                      :hint="`${selected_state.code} `"
                      :items="state_list"
                      :item-value="`${state_list.name}`"
                      item-text="name"
                      :label="$t('state')"
                      persistent-hint
                      return-object
                      @change="handleSelectedstate"
                      >  
                      </v-select>
                  </v-col>
              </v-row>
              <v-row class="mb-0 mb-0 pb-0">
                <v-col md="12" class="my-0 py-0">
                  <v-text-field v-model="address" type="search" :autocomplete="false" :label="$t('address')" :rules="[v => !!v ||  $t('v.address_req'), v => !!v && v.length >= 10  || $t('v.min_10', v => !!v && v.length <= 30 || $t('v.max_30'))]"></v-text-field>
                </v-col>
                </v-row>  
                <v-row >
                <v-col  md="6" class="my-0 py-0">
                  <v-select
                      v-model="selected_city"
                      :items="city_list"
                      item-value="id"
                      item-text="name"
                      :label="$t('city')"
                      @change="handleSelectedCity"
                      >  
                      </v-select>
                </v-col>
                <v-col  md="6" class="my-0 py-0">
                  <v-select
                      v-model="selected_zip"
                      :items="zip_list"
                      item-value="code"
                      item-text="code"
                      :label="$t('zip_code')"
                      @change="handleSelectedZip"
                      >  
                      </v-select>
                </v-col>
              </v-row>
              <v-row class="my-0 py-0">
                <v-col xs="12" sm="12" md="6" class="my-0 py-0">
                  <v-text-field v-model="password" :autocomplete="false" :label="$t('pwd')" prepend-inner-icon="mdi-lock" type="password" :rules="[v => !!v || $t('v.pwd_req'), v => !!v && v.length > 5 || $t('v.min_6')]"></v-text-field>
                </v-col>
                <v-col xs="12" sm="12" md="6" class="my-0 py-0">
                  <v-text-field v-model="confirm_password" :autocomplete="false" :label="$t('cpwd')" prepend-inner-icon="mdi-lock" type="password" :rules="[v => !!v || $t('v.pwd_req'), v => !!v && v.length > 5 || $t('v.min_6')]"></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col class="my-0 py-0">
                  <div class="d-flex" style="align-items: center !important">
                    <v-checkbox v-model="agree" :true-value="true" :false-value="false" :label="$t('i_agree')" :rules="[v => !!v || 'You must agree.']" class="mr-1">
                    </v-checkbox>
                    <a :href="localePath('/terms-and-conditions')" target="_blank" >{{$t('terms_cond')}}</a>
                    <span class="mx-1">&</span>
                    <a :href="localePath('/privacy-policy')" target="_blank" >{{$t('privacy')}}</a>
                  </div>
                </v-col>
                <v-col md="12" class="py-0">
                  <v-btn color="primary" type="submit" tile small block :loading="loading">
                    {{$t('sign_up')}}
                  </v-btn>
                </v-col>
              </v-row>
              <v-row>
              </v-row>
              <div>
                <hr />
                <small class="text-center d-block mb-0 mt-5">
                  {{$t('alr_h_acc')}}
                </small>
                <small class='text-center d-block mt-5'>
                  <v-btn color="info" tile small :to="localePath('/sign-in')">{{$t('sign_in')}}</v-btn>
                </small>
              </div>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <RequestModal ref="rmodal"></RequestModal>
  </div>
</template>

<script>
import RequestModal from '~/components/RequestModal'
import formMixin from '~/mixins/formMixin'
import inputMixin from "~/mixins/inputMixin";

export default {
  components: {
    RequestModal
  },
  mixins: [formMixin, inputMixin],
  layout: 'home',
  middleware: ['unauthenticated'],
  data() {
    return {
      loading: false,
      validForm: false,
      email: '',
      first_name: '',
      middle_name:'',
      last_name: '',
      country:'United States of America',
      country_code:'+1',
      phone_no:'',
      state:'Alabama',
      address:'',
      city:'Abernant',
      zip_code:'35440',
      password: '',
      confirm_password: '',
      agree: false,
      countries_list:[],
      selected_country:{ id:"d2b7d01d-33c6-45e8-9fac-24fcbc386e17",
        code: "USA",name: "United States of America",alpha2: "US",
        phone: "+1",capital: "DCA"
      },
      state_list:[],
      selected_state:{code: "AL",
      id: "110c1a91-fb92-41e8-b40d-37d3befefafe",name:"Alabama"},
      city_list:[],
      selected_city:{id:"81db56a1-a665-46b7-8df0-6e59fba0e7c0",name:"Abernant"},
      zip_list:[],
      selected_zip:{code:"35440",id:"072afa05-c93c-4a78-9b8f-8b7427c42124"},
    }
  },
  head() {
    return {
      title: this.$t('sign_up'),
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: this.$t('seo.sign_up')
        }
      ]
    }
  },mounted(){this.loadApis()},
  methods: {
      async loadApis(){
        let res = await this.$globalApi.get('/country')
        res= res.data.filter(c=>{
          return c.name && c.name.length>3
        })
        res=res.sort((a,b)=>{
          return a.name - b.name
        })
        res = res.map(c=>{
          return { 
            id:c.id, code: c.code?c.code:"N/A",
            name: c.name,
            alpha2: c.alpha2?c.alpha2:c.code?c.code.substr(0,2):c.name.substr(0,2),
            phone: c.phone?c.phone.startsWith("+")?c.phone: `+${c.phone}`:"+00",
            capital: c.capital
          }
        })
        this.countries_list=res
        res= await this.$globalApi.get('/state',{params:{country:this.selected_country.id}})
        this.state_list=res.data.map(s=>{
          return {code: s.code, id:s.id,name:s.name}
                  
        })
      
        res= await this.$globalApi.get('/city',{params:{state:this.selected_state.id}})
        this.city_list=res.data.map(c=>{
          return {name:c.name,id:c.id}
        })
        
        
        res= await this.$globalApi.get('/zip',{params:{city:this.selected_city.id}})
        this.zip_list = res.data.map(z=>{
          return {id:z.id,code:z.code}
        })
      },
      async handleSelectCountry(){
       const res = await this.$globalApi('/state',{params:{country:this.selected_country.id}})
          if (res.data.length>0){this.state_list = res.data.map(s=>{
            return {code:s.code,id:s.id,name:s.name}
          })}
          else {this.state_list = [{code: "N/A",id:"N/A",name:"N/A"}]}
          this.selected_state=this.state_list[0]
          this.country=this.selected_country.name
          this.country_code=this.selected_country.phone
          this.handleSelectedstate()
      },
      async handleSelectedstate(){
        const res = await this.$globalApi.get('/city',{params:{state:this.selected_state.id}})
        
        if (res.data.length>0){this.city_list = res.data.map(c=>{
          return {id:c.id,name:c.name}
        })}
        else {this.city_list = [{id:"N/A",name:"N/A"}]}
        this.selected_city=this.city_list[0]  
        this.state=this.selected_state.name
        this.handleSelectedCity()
      },
      async handleSelectedCity(){
        const id= this.selected_city.id?  this.selected_city.id:this.selected_city
        const res= await this.$globalApi.get('/zip',{params:{city:id}})
        if (res.data.length>0){this.zip_list = res.data.map(z=>{
          return {id:z.id,code:z.code}
        })}
        else {this.zip_list=[{id:"N/A",code:"N/A"}]}
        this.selected_zip=this.zip_list[0]
        this.city=this.selected_city.name
        this.handleSelectedZip()
      },
      handleSelectedZip(){
        this.zip_code=this.selected_zip.code
      },
       handlePhone(e){
        if ( !e )e = window.event 
      const val = e.target.value.toString() + e.key.toString();
      return  !/^[-+]?[0-9]*\.?[0-9]*$/.test(val)? e.preventDefault():true 
      },
    handleSubmit() {
      this.$refs.form.validate()
      if (this.validForm){
        this.loading = true
        this.$userApi
          .post('/register', {
            email: this.email,
            first_name: this.first_name,
            middle_name:this.middle_name,
            last_name: this.last_name,
            country_code: this.country_code,
            country:this.country,
            phone_no: this.phone_no,
            state:this.state,
            address:this.address,
            city:this.city,
            zip_code:this.zip_code,
            password: this.password,
            confirm_password: this.confirm_password,
            // dob: [this.year, this.month, this.day].join('-')
          })
          .then(async () => {
            try {
              await this.$auth
                .loginWith('local', {
                  data: {
                    email: this.email,
                    password: this.password
                  }
                })
                .then(() => {
                  // redirect
                })
                .catch((e) => {
                  this.$refs.rmodal.$emit('error', e.response.data.msg)
                })
            } catch (e) {
              this.$refs.rmodal.$emit('error', e.response.data.msg)
            }
          })
          .catch((e) => {
            this.$refs.rmodal.$emit('error', e.response.data.msg)
          })
          .finally(() => {
            this.loading = false
          })
      }
    }
  }
}
</script>

<style scoped>
.sign-up {
  background: #fff;
}
</style>