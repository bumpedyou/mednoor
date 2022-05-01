export default {
  methods: {

     padTo2Digits(num) {
      return num.toString().padStart(2, '0');
    },
    
     formatBirthDate(date) {
          return [
              this.padTo2Digits(date.getDate()),
              this.padTo2Digits(date.getMonth() + 1),
              date.getFullYear(),
            ].join('/');
    },
    dateStringDate(date) {
      return this.formatBirthDate(new Date(date))
    },
    dateString(date) {
      return this.formatBirthDate(new Date(date))
    },
  },
}
