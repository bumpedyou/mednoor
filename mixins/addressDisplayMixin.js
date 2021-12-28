export default {
  methods: {
    display_address(address) {
      if (address.addr_line1) {
        return [
          address.addr_line1,
          address.addr_city,
          address.addr_state,
          address.addr_zip,
        ].join(', ')
      } else {
        return 'No address was provided.'
      }
    },
  },
}
