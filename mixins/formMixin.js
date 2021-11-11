export default {
  data() {
    return {
      form: this.$form.createForm(this, { name: 'coordinated' }),
      date: '',
      allowed: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
      day: '',
      month: '',
      year: '',
    }
  },
  watch: {
    date(v) {
      // Auto format date into mm-dd-yyyy
      let str = ''
      for (let i = 0; i < v.length; i++) {
        if (
          (v.charAt(i) === '/' || v.charAt(i) === '-') &&
          (i === 2 || i === 5)
        ) {
          str += v.charAt(i)
        } else if (this.allowed.includes(v.charAt(i))) {
          str += v.charAt(i)
        }
      }
      const lastChar = v.charAt(v.length - 1)
      if (str.length === 1 && !this.allowed.includes(lastChar)) {
        str = '0' + str + '/'
      }

      const last = str.charAt(str.length - 1)

      if (str.length === 3 || str.length === 6) {
        str = this.addSlash(str)
      }

      if (str.length === 4 && !this.allowed.includes(lastChar)) {
        const last = str.charAt(str.length - 1)
        const x = str.substr(0, 3)
        str = x + '0' + last + '/'
      }

      if (str.length > 3) {
        str = str.split('')
        str[2] = '/'
        str = str.join('')
      }

      if (str.length === 6 && !this.allowed.includes(last)) {
        str = str.split('')
        str[5] = '/'
        str = str.join('')
      }
      if (str.length >= 10) {
        str = str.substr(0, 10)
        const dateParts = str.split('/')
        if (dateParts.length === 3) {
          // MM-DD-YYYY
          this.month = dateParts[0]
          this.day = dateParts[1]
          this.year = dateParts[2]
          let err = null

          if (this.month < 1) {
            err = 'The month cannot be zero'
          } else if (this.month > 12) {
            err = 'The month cannot be greater than twelve'
          }
          if (this.day < 1) {
            err = 'The day cannot be zero'
          } else if (this.day > 31) {
            err = 'The day cannot be greater than 31'
          }
          const currentYear = new Date().getFullYear()
          if (this.year <= currentYear - 100) {
            err =
              'The year cannot be more than 100 years away from ' + currentYear
          } else if (this.year > currentYear) {
            err = 'The year cannot be later than ' + currentYear
          }
          console.log('Error', err)
        }
      }
      this.date = str
    },
  },
  methods: {
    addSlash(str) {
      const last = str.charAt(str.length - 1)
      if (this.allowed.includes(last)) {
        return str.substr(0, str.length - 1) + '/' + last
      }
      return str
    },
  },
}
