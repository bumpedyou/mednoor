export default {
    methods: {
        formatAMPM(date) {
            const strTime = date.toLocaleString('en-US', {hour: '2-digit', minute: '2-digit', hour12: true })
            return strTime;
        },

        timeString(date) {
            return this.formatAMPM(new Date(date))
        },
    },
}
