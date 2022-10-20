<!-- بسم الله الرحمن الرحيم-->
<template>
  <div v-if="loading">
    <v-skeleton-loader type="card"></v-skeleton-loader>
  </div>
  <div  v-else>
    <v-row>
        <v-col  md="4">
                    <v-combobox
                      v-model="selected_state"
                      :items="state_list"
                      :hint="selected_state.code"
                      item-value="name"
                      item-text="name"
                      :label="$t('state')"
                      persistent-hint
                      auto-select-first
                      return-object
                      :rules="[v => !!v || $t('v.state'), v => !!v && v.name && v.name.length >=1 || $t('v.state')]"
                      @change="handleSelectState"
                      >  
                    </v-combobox>
                  </v-col>
                  <v-col md="4">
                    <v-combobox
                      v-model="selected_city"
                      :items="city_list"
                      item-value="name"
                      item-text="name"
                      :label="$t('city')"
                      return-object
                      auto-select-first
                      :rules="[v => !!v || $t('v.city'), v => !!v && v.name && v.name.length >=1 || $t('v.city')]"
                      @change="handleSelectCity"
                      >  
                      </v-combobox>
      </v-col>
      
      <v-col  md="4" >
                  <v-combobox
                      v-model="selected_zip"
                      :items="zip_list"
                      item-value="code"
                      item-text="code"
                      :label="$t('zip_code')"
                      return-object
                      auto-select-first
                      :rules="[v => !!v || $t('v.zip'), v => !!v && v.code && v.code.length >=1 || $t('v.zip')]"
                      @change="handleSelectZip"
                      >  
                  </v-combobox>
                </v-col>
    </v-row>
    <v-row>
      <v-col  >
        <v-text-field v-model="line1" :label="$t('address')" :placeholder="$t('address')" :rules="[
          v => !!v ||$t('v.address_req'),
          v => !! v && v.length >= 10 || $t('v.min_10'),
          v => !! v && v.length <= 60 || $t('v.max_10'),
        ]"></v-text-field>
      </v-col>
    </v-row>
    <RequestModal ref="rmodal"></RequestModal>
  </div>
</template>

<script>
import userRoleMixin from "~/mixins/userRoleMixin";
import RequestModal from "~/components/RequestModal";
import addressMixin from "~/mixins/addressMixin";

export default {
  name: "UserAddress",
  components: {
    RequestModal
  },
  mixins: [userRoleMixin, addressMixin],
  props:{ ac:{type:String,default:""},owner:{type:String,default:''}},
 
  data (){
    return {
      loading: true,
      state_list:[],
      selected_state:{code:'',id:'',name:''},
      city_list:[],
      selected_city:{id:'',name:''},
      zip_list:[],
      selected_zip:{id:'',code:''},
      myTimeout:'',
    }
  },
  watch:{
    ac (newVal,oldVal){
      if(newVal===""||newVal===null){
       this.clearAll()
        return
      }
      if(oldVal!==null){this.handleCountry()}
    },
  },
  mounted(){
    this.getAddress()
    this.$on('refresh', this.getAddress)
  },
  
  methods: {
   
    getAddress(){
      this.loading = true
      const uuid=this.owner
      if (!uuid){
        this.$store.commit('address/setLine1', '')
          this.$store.commit('address/setCity', '')
          this.$store.commit('address/setState', '')
          this.$store.commit('address/setZip', '')
        this.handleCountry()
        return
      }
      this.$api.get(`/address/${uuid}`).then(({data})=>{
        if (data){
          this.$store.commit('address/setLine1', data.addr_line1)
          this.$store.commit('address/setCity', data.addr_city)
          this.$store.commit('address/setState', data.addr_state)
          this.$store.commit('address/setZip', data.addr_zip)
        }
      }).catch((err)=>{
        this.$refs.rmodal.$emit('error', err)
      })
      .finally(()=>{
        clearTimeout(this.myTimeout)
        this.myTimeout=setTimeout(this.handleCountry(),100)
      })
      
    },
    handleCountry(){
      let dList
      this.$globalApi.get('/state',{params:{country:this.ac}}).then(({data})=>{
        if(data && data.length){
          dList=data.map(s=>{
            return {code:s.code?s.code:"N/A",id:s.id?s.id:"N/A",name:s.name?s.name:"N/A"}
          })
        }else{
          dList=[{code:"N/A",id:"N/A",name:"N/A"}]
        }
      }).finally(()=>{
        clearTimeout(this.myTimeout)
        this.myTimeout=setTimeout(() => {
          const filter= dList.filter(s=>{
          return s.name=== this.state
        })
        this.state_list=dList
        this.selected_state=filter.length?filter[0]:this.state_list[0]
        this.handleSelectState()
        }, 100);
        
      })
    },
    handleSelectState(){
      if(this.selected_state===""||this.selected_state===null){
        this.selected_state={name:'',id:''}
        this.clearFromCity()
        return
      }
      let dList
      this.$globalApi.get('/city',{params:{state:this.selected_state.id}})
      .then(({data})=>{
        if(data && data.length){
          dList=data.map(c=>{
              return {id:c.id?c.id:"N/A",name:c.name?c.name:"N/A"}
            })
          }else{
            dList=[{id:"N/A",name:"N/A"}]
          }
      })
      .finally(()=>{
        clearTimeout(this.myTimeout)
        this.myTimeout=setTimeout(() => {
          const filter= dList.filter(c=>{
            return c.name=== this.city
          })
          this.city_list=dList
          this.selected_city=filter.length?filter[0]:this.city_list[0]
          this.state=this.selected_state.name
          this.handleSelectCity()
        }, 100);  
      })
  },
  handleSelectCity(){
    if (this.selected_city===null || this.selected_city===""){
      this.clearFromZip()
      return 
    }
    let dList
    
    this.$globalApi.get('/zip',{params:{city:this.selected_city.id}})
    .then(({data})=>{
      if(data && data.length){
        dList=data.map(z=>{
          return {id:z.id?z.id:"N/A",code:z.code?z.code:"N/A"}
        })
      }else{
        dList=[{id:"N/A",code:"N/A"}]
      }
    })
    .finally(()=>{
        clearTimeout(this.myTimeout)
        this.myTimeout=setTimeout(()=>{
          const filter= dList.filter(z=>{
          return z.code=== this.zip
        })
        this.zip_list=dList
        this.selected_zip=filter.length?filter[0]:this.zip_list[0]
        this.city=this.selected_city.name
        this.handleSelectZip()
        },100)
    })
  },
  handleSelectZip(){
    if (this.selected_zip===null || this.selected_zip==="" ){
        this.selected_zip={id:"",code:""}
    }
    this.loading=false
    this.zip=this.selected_zip.code
  },
  clearAll(){
    this.state_list=[{code:'',id:'',name:''}]
    this.selected_state=this.state_list[0]
    this.clearFromCity()
  },
  clearFromCity(){
    this.city_list=[{name:'',id:''}]
    this.selected_city=this.city_list[0]
    this.clearFromZip()
  },
  clearFromZip(){
    this.zip_list=[{id:'',code:''}]
    this.selected_zip=this.zip_list[0]
  },
  }
}
</script>