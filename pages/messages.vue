<template>
  <div>
    <h1>User messages table</h1>
    <div class="w-100">
      <vue-good-table :rows="messages" :columns="columns"></vue-good-table>
    </div>
  </div>
</template>

<script>
export default {
  // TODO: render a table of messages with the following columns:
  // Date, Time, Name, Email, Message, Actions

  mounted() {
    this.getMessages()
  },

  data() {
    return {
      messages: [],
      columns: [
        {
          label: 'Date',
          field: 'sent_date',
          sortable: true,
        },

        {
          label: 'Name',
          field: 'sender_name',
          sortable: true,
        },
        {
          label: 'Email',
          field: 'sender_email',
          sortable: true,
        },
        {
          label: 'Subject',
          field: 'message_subject',
          sortable: true,
        },
        {
          label: 'Message',
          field: 'message_body',
          sortable: true,
        },
        {
          label: 'Actions',
          field: 'actions',
          sortable: true,
        },
      ],
    }
  },

  methods: {
    getMessages() {
      this.$axios
        .get('https://murmuring-taiga-10309.herokuapp.com/feed-back/messages')
        .then((response) => {
          this.messages = response.data
        })
    },
  },
}
</script>
