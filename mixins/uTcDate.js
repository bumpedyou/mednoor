export default {
    methods: {

        getOffSetDate(date) {
            return new Date(date).setHours(0, 0, 0, 0)
        },
        getISODate(d) {
            //  console.log(this.getOffSetDate(d))
            const tempdate = new Date(this.getOffSetDate(d));
            const utcDate = new Date(tempdate.getTime() - tempdate.getTimezoneOffset() * 60000);
            // console.log(new Date(utcDate))
            return new Date(utcDate).toISOString();

        },


        getUtcDate(d){
            const tempdate = new Date(d);
            const utcDate = new Date(tempdate.getTime() - tempdate.getTimezoneOffset() * 60000);
            // console.log(new Date(utcDate))
            return new Date(utcDate).toISOString();
        }

    },
}
