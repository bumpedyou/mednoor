export default {
    methods: {
         formatAMPM(date) {
            let hours = 0;
            let minutes = 0;
            const ampm = hours >= 12 ? 'pm' : 'am';
            
            if(date.getHours()% 12){
                hours =  12; // the hour '0' should be '12'
            }else{
                hours = date.getHours() ; 
            }
            
            if(date.getMinutes() < 10){
                minutes ='0'+date.getMinutes()
            }else{
                minutes =date.getMinutes()
            }
           
            
            const strTime = hours + ':' + minutes + ' ' + ampm;
            return strTime;
          },
          
     timeString(date) {
        return this.formatAMPM(new Date(date))
      },
    },
  }
  